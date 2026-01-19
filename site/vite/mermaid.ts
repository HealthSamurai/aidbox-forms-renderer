import { getThemeVariables } from "./theme.ts";

type MdastNode = {
  type: string;
  children?: MdastNode[];
  lang?: string;
  value?: string;
  name?: string;
  attributes?: Array<{
    type: "mdxJsxAttribute";
    name: string;
    value?: string;
  }>;
};

type Renderer = {
  initialize: (config: {
    startOnLoad: boolean;
    theme: string;
    securityLevel: string;
    themeVariables?: Record<string, string>;
    htmlLabels?: boolean;
    wrap?: boolean;
    markdownAutoWrap?: boolean;
    flowchart?: {
      htmlLabels?: boolean;
      wrappingWidth?: number;
    };
  }) => void;
  render: (id: string, code: string) => Promise<{ svg: string }>;
};

let rendererPromise: Promise<Renderer> | undefined;

const ensureDomGlobals = async () => {
  if (globalThis.window && globalThis.document) return;
  const { JSDOM } = await import("jsdom");
  const dom = new JSDOM("<!doctype html><html><body></body></html>");
  const windowReference = dom.window as Window & typeof globalThis;
  if (!globalThis.window) {
    globalThis.window = windowReference;
  }
  if (!globalThis.document) {
    globalThis.document = windowReference.document;
  }
  if (!globalThis.DOMParser) {
    globalThis.DOMParser = windowReference.DOMParser;
  }
  if (!globalThis.SVGElement) {
    globalThis.SVGElement = windowReference.SVGElement;
  }
  if (!globalThis.Element) {
    globalThis.Element = windowReference.Element;
  }
  if (globalThis.SVGElement) {
    const svgPrototype = globalThis.SVGElement.prototype as unknown as {
      getBBox?: () => DOMRect;
      getComputedTextLength?: () => number;
    };
    if (!svgPrototype.getBBox) {
      const parseNumber = (
        value: string | null | undefined,
        fallback: number,
      ) => {
        const parsed = Number.parseFloat(value ?? "");
        return Number.isFinite(parsed) ? parsed : fallback;
      };
      const createRect = (rect: {
        x: number;
        y: number;
        width: number;
        height: number;
      }) => {
        return {
          ...rect,
          rx: 5,
          ry: 5,
        } as unknown as DOMRect;
      };

      svgPrototype.getBBox = function getBBox() {
        const element = this as unknown as SVGElement;
        const tagName = element.tagName?.toLowerCase();
        const widthAttribute = element.getAttribute("width");
        const heightAttribute = element.getAttribute("height");
        if (widthAttribute || heightAttribute) {
          return createRect({
            x: 0,
            y: 0,
            width: parseNumber(widthAttribute, 16),
            height: parseNumber(heightAttribute, 16),
          });
        }
        if (tagName === "circle") {
          const radius = parseNumber(element.getAttribute("r"), 8);
          return createRect({
            x: 0,
            y: 0,
            width: radius * 2,
            height: radius * 2,
          });
        }
        if (tagName === "ellipse") {
          const rx = parseNumber(element.getAttribute("rx"), 8);
          const ry = parseNumber(element.getAttribute("ry"), 6);
          return createRect({ x: 0, y: 0, width: rx * 2, height: ry * 2 });
        }
        if (tagName === "line") {
          const x1 = parseNumber(element.getAttribute("x1"), 0);
          const x2 = parseNumber(element.getAttribute("x2"), 0);
          const y1 = parseNumber(element.getAttribute("y1"), 0);
          const y2 = parseNumber(element.getAttribute("y2"), 0);
          return createRect({
            x: 0,
            y: 0,
            width: Math.abs(x2 - x1) || 1,
            height: Math.abs(y2 - y1) || 1,
          });
        }
        if (tagName === "text" || tagName === "tspan") {
          const text = element.textContent ?? "";
          const fontSize = parseNumber(element.getAttribute("font-size"), 16);
          const width = Math.max(8, text.length * fontSize * 0.6);
          const height = Math.max(10, fontSize * 1.2);
          return createRect({ x: 0, y: 0, width, height });
        }
        return createRect({ x: 0, y: 0, width: 16, height: 16 });
      };
    }
    if (!svgPrototype.getComputedTextLength) {
      const parseNumber = (
        value: string | null | undefined,
        fallback: number,
      ) => {
        const parsed = Number.parseFloat(value ?? "");
        return Number.isFinite(parsed) ? parsed : fallback;
      };
      svgPrototype.getComputedTextLength = function getComputedTextLength() {
        const element = this as unknown as SVGElement;
        const text = element.textContent ?? "";
        const fontSize = parseNumber(element.getAttribute("font-size"), 16);
        return Math.max(8, text.length * fontSize * 0.6);
      };
    }
  }
};

const getRenderer = async (): Promise<Renderer> => {
  if (!rendererPromise) {
    rendererPromise = (async () => {
      await ensureDomGlobals();
      const module = await import("mermaid");
      const renderer = (module.default ?? module) as Renderer;
      const themeVariables = await getThemeVariables();
      renderer.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "strict",
        htmlLabels: false,
        wrap: false,
        markdownAutoWrap: false,
        flowchart: {
          htmlLabels: false,
          wrappingWidth: 9999,
        },
        themeVariables,
      });
      return renderer;
    })();
  }
  return rendererPromise;
};

const applyInlineStyles = (
  element: Element,
  entries: Record<string, string>,
) => {
  const styleMap = new Map<string, string>();
  const rawStyle = element.getAttribute("style") ?? "";
  for (const item of rawStyle.split(";")) {
    const [key, value] = item.split(":").map((part) => part.trim());
    if (!key) continue;
    styleMap.set(key, value ?? "");
  }
  for (const [key, value] of Object.entries(entries)) {
    styleMap.set(key, value);
  }
  const nextStyle = [...styleMap.entries()]
    .map(([key, value]) => `${key}:${value}`)
    .join("; ");
  element.setAttribute("style", nextStyle);
};

const normalizeSvg = (svg: string) => {
  if (!globalThis.DOMParser) return svg;
  const parser = new globalThis.DOMParser();
  const document = parser.parseFromString(svg, "image/svg+xml");
  const svgElement = document.querySelector("svg");
  if (!svgElement) return svg;

  const parseNumber = (value: string | null, fallback = 0) => {
    const parsed = Number.parseFloat(value ?? "");
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const ensureTextFitsNodes = () => {
    const nodes = svgElement.querySelectorAll("g.node");
    for (const node of nodes) {
      const labelContainer = node.querySelector(
        "rect.label-container",
      ) as SVGRectElement | null;
      const foreignObject = node.querySelector("foreignObject");
      if (!labelContainer || !foreignObject) continue;

      const labelHost = foreignObject.querySelector("div");
      const paragraphs = [...foreignObject.querySelectorAll("p")];
      const lines =
        paragraphs.length > 0
          ? paragraphs
              .map((paragraph) => paragraph.textContent?.trim() ?? "")
              .filter(Boolean)
          : (foreignObject.textContent ?? "")
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);

      if (lines.length === 0) continue;

      const fontSize = parseNumber(foreignObject.getAttribute("font-size"), 16);
      const maxTextLength = Math.max(...lines.map((line) => line.length));
      const textWidth = Math.max(8, maxTextLength * fontSize * 0.6);
      const textHeight = Math.max(1, lines.length) * fontSize * 1.2;
      const horizontalPadding = 24;
      const verticalPadding = 12;
      const targetWidth = Math.max(
        parseNumber(labelContainer.getAttribute("width"), 0),
        textWidth + horizontalPadding,
      );
      const targetHeight = Math.max(
        parseNumber(labelContainer.getAttribute("height"), 0),
        textHeight + verticalPadding,
      );

      const offsetX = -targetWidth / 2;
      const offsetY = -targetHeight / 2;

      labelContainer.setAttribute("width", targetWidth.toFixed(2));
      labelContainer.setAttribute("height", targetHeight.toFixed(2));
      labelContainer.setAttribute("x", offsetX.toFixed(2));
      labelContainer.setAttribute("y", offsetY.toFixed(2));

      foreignObject.setAttribute("width", targetWidth.toFixed(2));
      foreignObject.setAttribute("height", targetHeight.toFixed(2));
      foreignObject.setAttribute("x", offsetX.toFixed(2));
      foreignObject.setAttribute("y", offsetY.toFixed(2));

      if (labelHost) {
        applyInlineStyles(labelHost, {
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
          width: "100%",
          height: "100%",
          "text-align": "center",
          "box-sizing": "border-box",
          padding: "6px 12px",
          "line-height": "1.5",
          "white-space": "nowrap",
        });
      }
    }
  };

  const parseTranslate = (value: string) => {
    const match = value.match(/translate\(([^,\s)]+)(?:[,\s]+([^)]+))?\)/);
    if (!match) return { x: 0, y: 0 };
    const x = parseNumber(match[1], 0);
    const y = parseNumber(match[2] ?? "0", 0);
    return { x, y };
  };

  const getTranslateOffset = (element: Element) => {
    let offsetX = 0;
    let offsetY = 0;
    let current: Element | null = element;
    while (current) {
      const transform = current.getAttribute("transform");
      if (transform) {
        const { x, y } = parseTranslate(transform);
        offsetX += x;
        offsetY += y;
      }
      current = current.parentElement;
    }
    return { x: offsetX, y: offsetY };
  };

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  const updateBounds = (x: number, y: number) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  const updateBoundsFromPoints = (
    element: Element,
    offsetX: number,
    offsetY: number,
  ) => {
    const points = element.getAttribute("points") ?? "";
    const coords = points
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    for (let index = 0; index + 1 < coords.length; index += 2) {
      updateBounds(offsetX + coords[index], offsetY + coords[index + 1]);
    }
  };

  ensureTextFitsNodes();

  const elements = svgElement.querySelectorAll(
    "rect, circle, ellipse, line, polygon, polyline",
  );
  for (const element of elements) {
    const { x: offsetX, y: offsetY } = getTranslateOffset(element);
    switch (element.tagName.toLowerCase()) {
      case "rect": {
        const x = parseNumber(element.getAttribute("x"));
        const y = parseNumber(element.getAttribute("y"));
        const width = parseNumber(element.getAttribute("width"));
        const height = parseNumber(element.getAttribute("height"));
        updateBounds(offsetX + x, offsetY + y);
        updateBounds(offsetX + x + width, offsetY + y + height);
        break;
      }
      case "circle": {
        const cx = parseNumber(element.getAttribute("cx"));
        const cy = parseNumber(element.getAttribute("cy"));
        const radius = parseNumber(element.getAttribute("r"));
        updateBounds(offsetX + cx - radius, offsetY + cy - radius);
        updateBounds(offsetX + cx + radius, offsetY + cy + radius);
        break;
      }
      case "ellipse": {
        const cx = parseNumber(element.getAttribute("cx"));
        const cy = parseNumber(element.getAttribute("cy"));
        const rx = parseNumber(element.getAttribute("rx"));
        const ry = parseNumber(element.getAttribute("ry"));
        updateBounds(offsetX + cx - rx, offsetY + cy - ry);
        updateBounds(offsetX + cx + rx, offsetY + cy + ry);
        break;
      }
      case "line": {
        const x1 = parseNumber(element.getAttribute("x1"));
        const y1 = parseNumber(element.getAttribute("y1"));
        const x2 = parseNumber(element.getAttribute("x2"));
        const y2 = parseNumber(element.getAttribute("y2"));
        updateBounds(offsetX + x1, offsetY + y1);
        updateBounds(offsetX + x2, offsetY + y2);
        break;
      }
      case "polygon": {
        updateBoundsFromPoints(element, offsetX, offsetY);
        break;
      }
      case "polyline": {
        updateBoundsFromPoints(element, offsetX, offsetY);
        break;
      }
      default: {
        break;
      }
    }
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY)) return svg;

  const padding = 8;
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const viewBox = `${minX - padding} ${minY - padding} ${
    width + padding * 2
  } ${height + padding * 2}`;
  svgElement.setAttribute("viewBox", viewBox);

  const styleAttribute = svgElement.getAttribute("style") ?? "";
  const styleEntries = styleAttribute
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry) => !entry.startsWith("max-width"));
  styleEntries.push(`max-width: ${width + padding * 2}px`);
  svgElement.setAttribute("style", styleEntries.join("; "));

  return svgElement.outerHTML;
};

const renderDiagramToSvg = async (code: string, diagramId: string) => {
  const renderer = await getRenderer();
  const { svg } = await renderer.render(diagramId, code);
  return normalizeSvg(svg);
};

const isDiagramCodeBlock = (
  node: MdastNode,
): node is MdastNode & { value: string } =>
  node.type === "code" &&
  node.lang?.toLowerCase() === "mermaid" &&
  typeof node.value === "string";

const createDiagramComponentNode = (svg: string): MdastNode => ({
  type: "mdxJsxFlowElement",
  name: "Diagram",
  attributes: [{ type: "mdxJsxAttribute", name: "svg", value: svg }],
  children: [],
});

const replaceDiagramCodeBlocks = async (
  node: MdastNode,
  diagramIndex: { value: number },
): Promise<void> => {
  if (!Array.isArray(node.children)) return;

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];
    if (isDiagramCodeBlock(child)) {
      const diagramId = `diagram-${diagramIndex.value}`;
      diagramIndex.value += 1;
      try {
        const svg = await renderDiagramToSvg(child.value, diagramId);
        node.children[index] = createDiagramComponentNode(svg);
      } catch {
        continue;
      }
    } else {
      await replaceDiagramCodeBlocks(child, diagramIndex);
    }
  }
};

const applyDiagramReplacements = async (tree: MdastNode) => {
  await replaceDiagramCodeBlocks(tree, { value: 0 });
};

export const remarkDiagramCodeBlocks = () => applyDiagramReplacements;
