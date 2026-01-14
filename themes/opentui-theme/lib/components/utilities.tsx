import { TextAttributes } from "@opentui/core";
import { isValidElement, type ReactNode } from "react";

export function InlineText({
  children,
  dim = false,
  color,
}: {
  children: ReactNode;
  dim?: boolean;
  color?: string | undefined;
}) {
  return (
    <text
      attributes={dim ? TextAttributes.DIM : 0}
      style={color ? { fg: color } : {}}
    >
      {children}
    </text>
  );
}

function valueToPlainText(type: unknown, value: unknown): string {
  if (value === undefined || value === null) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  const kind = typeof type === "string" ? type : undefined;

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (kind === "coding") {
      const displayCandidate = record["display"];
      const codeCandidate = record["code"];
      const systemCandidate = record["system"];

      const display =
        typeof displayCandidate === "string"
          ? displayCandidate
          : typeof codeCandidate === "string"
            ? codeCandidate
            : "";
      const system = typeof systemCandidate === "string" ? systemCandidate : "";
      if (!display) return system ? `(${system})` : "";
      return system ? `${display} (${system})` : display;
    }

    if (kind === "quantity") {
      const magnitudeCandidate = record["value"];
      const unitCandidate = record["unit"];

      const magnitude =
        typeof magnitudeCandidate === "number" ||
        typeof magnitudeCandidate === "string"
          ? String(magnitudeCandidate)
          : "";
      const unit = typeof unitCandidate === "string" ? unitCandidate : "";
      return [magnitude, unit].filter((part) => part.length > 0).join(" ");
    }

    if (kind === "reference") {
      const displayCandidate = record["display"];
      const referenceCandidate = record["reference"];

      if (typeof displayCandidate === "string") return displayCandidate;
      if (typeof referenceCandidate === "string") return referenceCandidate;
    }

    const textCandidate = record["text"];
    const displayCandidate = record["display"];

    if (typeof textCandidate === "string") {
      return textCandidate;
    }

    if (typeof displayCandidate === "string") {
      return displayCandidate;
    }
  }

  return "";
}

export function toPlainText(node: ReactNode): string {
  if (node === undefined || node === null) return "";

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (typeof node === "boolean") {
    return "";
  }

  if (Array.isArray(node)) {
    return node.map((part) => toPlainText(part as ReactNode)).join("");
  }

  if (isValidElement<Record<string, unknown>>(node)) {
    const properties = node.props;

    const type = properties["type"];
    const value = properties["value"];
    if (type !== undefined && value !== undefined) {
      const candidate = valueToPlainText(type, value);
      if (candidate.length > 0) {
        return candidate;
      }
    }

    if ("children" in properties) {
      return toPlainText(properties["children"] as ReactNode);
    }

    return "";
  }

  return "";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
