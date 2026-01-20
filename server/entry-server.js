import { renderToString } from "react-dom/server";
import { jsx, jsxs, Fragment as Fragment$1 } from "react/jsx-runtime";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import * as React from "react";
import React__default, { useRef, useState, useEffect, useCallback, Fragment, useMemo } from "react";
import { Github, ChevronRight, SquarePen, ArrowUp, ArrowLeft, ArrowRight, Star, CircleDot, ArrowUpRight, X, Search as Search$1, Shield, Sparkles, HeartPulse, LayoutGrid, List, Settings, BookOpen, Paintbrush2, Palette, Rocket, ChevronDown, Menu } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Renderer, Triangle, Program, Color, Mesh } from "ogl";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as SheetPrimitive from "@radix-ui/react-dialog";
function cn(...inputs) {
  return twMerge(classNames(...inputs));
}
const slugify$1 = (value) => {
  return value.toLowerCase().trim().replaceAll(/[^\w\s-]/g, "").replaceAll(/\s+/g, "-").replaceAll(/-+/g, "-");
};
const extractText = (node) => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map((child) => extractText(child)).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    const element = node;
    return extractText(element.props?.children);
  }
  return "";
};
const resolveHeadingId = (rawId, fallback) => {
  const normalized = rawId?.trim() ?? "";
  if (normalized) return normalized;
  const text = fallback ? extractText(fallback) : "";
  const candidate = slugify$1(text);
  return candidate.length > 0 ? candidate : void 0;
};
function CodeBlock({ html, code, className }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "overflow-x-auto rounded-xl border border-border/60 bg-muted/60 p-4 text-xs text-foreground [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:font-mono [&_code]:font-mono [&_code]:text-xs",
        className
      ),
      children: html ? /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: html } }) : /* @__PURE__ */ jsx("pre", { children: /* @__PURE__ */ jsx("code", { children: code }) })
    }
  );
}
const GlareHover = ({
  width = "500px",
  height = "500px",
  background = "#000",
  borderRadius = "10px",
  borderColor = "#333",
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = "",
  style = {}
}) => {
  const hex = glareColor.replace("#", "");
  let rgba = glareColor;
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${red}, ${green}, ${blue}, ${glareOpacity})`;
  } else if (/^[\dA-Fa-f]{3}$/.test(hex)) {
    const red = Number.parseInt(hex[0] + hex[0], 16);
    const green = Number.parseInt(hex[1] + hex[1], 16);
    const blue = Number.parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${red}, ${green}, ${blue}, ${glareOpacity})`;
  }
  const overlayReference = useRef(
    void 0
  );
  const animateIn = () => {
    const element = overlayReference.current;
    if (!element) return;
    element.style.transition = "none";
    element.style.backgroundPosition = "-100% -100%, 0 0";
    element.style.transition = `${transitionDuration}ms ease`;
    element.style.backgroundPosition = "100% 100%, 0 0";
  };
  const animateOut = () => {
    const element = overlayReference.current;
    if (!element) return;
    if (playOnce) {
      element.style.transition = "none";
      element.style.backgroundPosition = "-100% -100%, 0 0";
    } else {
      element.style.transition = `${transitionDuration}ms ease`;
      element.style.backgroundPosition = "-100% -100%, 0 0";
    }
  };
  const overlayStyle = {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(${glareAngle}deg,
        hsla(0,0%,0%,0) 60%,
        ${rgba} 70%,
        hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-100% -100%, 0 0",
    pointerEvents: "none"
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative grid place-items-center overflow-hidden border cursor-pointer ${className}`,
      style: {
        width,
        height,
        background,
        borderRadius,
        borderColor,
        ...style
      },
      onMouseEnter: animateIn,
      onMouseLeave: animateOut,
      children: [
        /* @__PURE__ */ jsx("div", { ref: overlayReference, style: overlayStyle }),
        children
      ]
    }
  );
};
const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  ...properties
}) => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetReference = useRef(
    void 0
  );
  useEffect(() => {
    if (disabled) {
      return;
    }
    const handleMouseMove = (event) => {
      const element = magnetReference.current;
      if (!element) return;
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = Math.abs(centerX - event.clientX);
      const distanceY = Math.abs(centerY - event.clientY);
      if (distanceX < width / 2 + padding && distanceY < height / 2 + padding) {
        setIsActive(true);
        const offsetX = (event.clientX - centerX) / magnetStrength;
        const offsetY = (event.clientY - centerY) / magnetStrength;
        setPosition({ x: offsetX, y: offsetY });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };
    globalThis.addEventListener("mousemove", handleMouseMove);
    return () => {
      globalThis.removeEventListener("mousemove", handleMouseMove);
    };
  }, [padding, disabled, magnetStrength]);
  const resolvedPosition = disabled ? { x: 0, y: 0 } : position;
  const resolvedIsActive = disabled ? false : isActive;
  const transitionStyle = resolvedIsActive ? activeTransition : inactiveTransition;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: magnetReference,
      className: wrapperClassName,
      style: { position: "relative", display: "inline-block" },
      ...properties,
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: innerClassName,
          style: {
            transform: `translate3d(${resolvedPosition.x}px, ${resolvedPosition.y}px, 0)`,
            transition: transitionStyle,
            willChange: "transform"
          },
          children
        }
      )
    }
  );
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const withBase = (value) => {
  if (!value.startsWith("/")) {
    return value;
  }
  return `${"/formbox-renderer/"}${value.slice(1)}`;
};
const stripBase = (pathname) => {
  return pathname.startsWith("/formbox-renderer/") ? `/${pathname.slice("/formbox-renderer/".length)}` : pathname;
};
function SiteHeader({
  links,
  extraNav,
  mobileNav,
  mobileToc,
  search,
  showGithubIcon = true
}) {
  const navLinks = links ?? [
    { href: "/", label: "Home" },
    { href: "/docs/", label: "Docs" },
    { href: "/storybook/", label: "Storybook" }
  ];
  return /* @__PURE__ */ jsxs("header", { className: "bg-background/80 sticky top-0 z-40 backdrop-blur-lg", children: [
    /* @__PURE__ */ jsxs("div", { className: "container flex h-14 items-center justify-between gap-2 px-4 md:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "hidden flex-1 md:flex", children: /* @__PURE__ */ jsxs("a", { className: "flex", href: withBase("/"), children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            className: "h-7 w-7 brightness-0 invert",
            src: withBase("/android-chrome-192x192.png"),
            alt: "Formbox logo"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "ml-3 self-center font-bold", children: "Formbox Renderer" })
      ] }) }),
      mobileNav,
      /* @__PURE__ */ jsxs("a", { className: "flex md:hidden", href: withBase("/"), children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            className: "h-7 w-7 brightness-0 invert",
            src: withBase("/android-chrome-192x192.png"),
            alt: "Formbox logo"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "ml-3 self-center font-bold", children: "Formbox Renderer" })
      ] }),
      /* @__PURE__ */ jsxs(
        "nav",
        {
          className: "hidden flex-1 items-center justify-center gap-6 text-sm font-semibold lg:flex",
          "aria-label": "Primary",
          children: [
            navLinks.map((link) => /* @__PURE__ */ jsx(
              "a",
              {
                className: "text-muted-foreground transition-colors hover:text-foreground",
                href: withBase(link.href),
                children: link.label
              },
              link.href
            )),
            extraNav
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 justify-end gap-2", children: [
        search,
        showGithubIcon ? /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "icon", children: /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://github.com/HealthSamurai/formbox-renderer",
            target: "_blank",
            rel: "noreferrer",
            children: /* @__PURE__ */ jsx(Github, { className: "size-[18px]" })
          }
        ) }) }) : void 0
      ] })
    ] }),
    mobileToc ? /* @__PURE__ */ jsx("div", { className: "lg:hidden", children: mobileToc }) : void 0
  ] });
}
const DEFAULT_FROM = { opacity: 0, y: 40 };
const DEFAULT_TO = { opacity: 1, y: 0 };
let gsapRuntimePromise;
const loadGsapRuntime = () => {
  if (!gsapRuntimePromise) {
    gsapRuntimePromise = Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText")
    ]).then(([gsapModule, scrollTriggerModule, splitTextModule]) => {
      const { gsap } = gsapModule;
      const { ScrollTrigger } = scrollTriggerModule;
      const { SplitText: SplitText2 } = splitTextModule;
      gsap.registerPlugin(ScrollTrigger, SplitText2);
      return { gsap, ScrollTrigger, SplitText: SplitText2 };
    });
  }
  return gsapRuntimePromise;
};
function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = DEFAULT_FROM,
  to = DEFAULT_TO,
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete
}) {
  const elementReference = useRef(
    void 0
  );
  const animationCompletedReference = useRef(false);
  const onCompleteReference = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(() => {
    const fonts = globalThis.document?.fonts;
    return !fonts || fonts.status === "loaded";
  });
  const [runtime, setRuntime] = useState();
  useEffect(() => {
    onCompleteReference.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);
  useEffect(() => {
    let cancelled = false;
    void loadGsapRuntime().then((loadedRuntime) => {
      if (!cancelled) setRuntime(loadedRuntime);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    const fonts = globalThis.document?.fonts;
    if (!fonts || fonts.status === "loaded") {
      return;
    }
    let cancelled = false;
    void fonts.ready.then(
      () => {
        if (!cancelled) setFontsLoaded(true);
      },
      () => {
        if (!cancelled) setFontsLoaded(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!runtime || !fontsLoaded || !text) return;
    if (animationCompletedReference.current) return;
    const element = elementReference.current;
    if (!element) return;
    const elementWithInstance = element;
    if (elementWithInstance.splitInstance) {
      try {
        elementWithInstance.splitInstance.revert();
      } catch {
      }
      delete elementWithInstance.splitInstance;
    }
    const { gsap, ScrollTrigger, SplitText: SplitTextConstructor } = runtime;
    const startPercent = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? Number.parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch?.[2] ?? "px";
    const sign = marginValue === 0 ? "" : marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPercent}%${sign}`;
    let targets = [];
    const assignTargets = (splitInstance2) => {
      if (splitType.includes("chars") && (splitInstance2.chars?.length ?? 0) > 0) {
        targets = splitInstance2.chars ?? [];
        return;
      }
      if (splitType.includes("words") && splitInstance2.words.length > 0) {
        targets = splitInstance2.words;
        return;
      }
      if (splitType.includes("lines") && splitInstance2.lines.length > 0) {
        targets = splitInstance2.lines;
        return;
      }
      targets = splitInstance2.chars ?? splitInstance2.words ?? splitInstance2.lines ?? [];
    };
    const splitInstance = new SplitTextConstructor(element, {
      type: splitType,
      smartWrap: true,
      autoSplit: splitType === "lines",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
      reduceWhiteSpace: false,
      onSplit: (instance) => {
        assignTargets(instance);
        return gsap.fromTo(
          targets,
          { ...from },
          {
            ...to,
            duration,
            ease,
            stagger: delay / 1e3,
            scrollTrigger: {
              trigger: element,
              start,
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4
            },
            onComplete: () => {
              animationCompletedReference.current = true;
              onCompleteReference.current?.();
            },
            willChange: "transform, opacity",
            force3D: true
          }
        );
      }
    });
    elementWithInstance.splitInstance = splitInstance;
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
      try {
        splitInstance.revert();
      } catch {
      }
      delete elementWithInstance.splitInstance;
    };
  }, [
    runtime,
    fontsLoaded,
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    threshold,
    rootMargin
  ]);
  const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;
  const style = {
    textAlign,
    wordWrap: "break-word",
    willChange: "transform, opacity"
  };
  const Tag = tag;
  const setElementReference = useCallback((node) => {
    elementReference.current = node;
  }, []);
  return /* @__PURE__ */ jsx(Tag, { ref: setElementReference, style, className: classes, children: text });
}
const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

#define PI 3.1415926538

const int u_line_count = 40;
const float u_line_width = 7.0;
const float u_line_blur = 10.0;

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
    return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
    float split_offset = (perc * 0.4);
    float split_point = 0.1 + split_offset;

    float amplitude_normal = smoothstep(split_point, 0.7, st.x);
    float amplitude_strength = 0.5;
    float finalAmplitude = amplitude_normal * amplitude_strength
                           * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

    float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
    float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
        st.x * 0.3
    );

    float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;

    float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y,
        st.y
    );

    float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
    );

    return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;

    float line_strength = 1.0;
    for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / float(u_line_count);
        line_strength *= (1.0 - lineFn(
            uv,
            u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
            p,
            (PI * 1.0) * p,
            uMouse,
            iTime,
            uAmplitude,
            uDistance
        ));
    }

    float colorVal = 1.0 - line_strength;
    fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
const Threads = ({
  color = [1, 1, 1],
  amplitude = 1,
  distance = 0,
  enableMouseInteraction = false,
  ...rest
}) => {
  const containerReference = useRef(
    void 0
  );
  const animationFrameId = useRef(0);
  useEffect(() => {
    if (!containerReference.current) return;
    const container = containerReference.current;
    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.append(gl.canvas);
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          )
        },
        uColor: { value: new Color(...color) },
        uAmplitude: { value: amplitude },
        uDistance: { value: distance },
        uMouse: { value: new Float32Array([0.5, 0.5]) }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });
    function resize() {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      program.uniforms["iResolution"].value.r = clientWidth;
      program.uniforms["iResolution"].value.g = clientHeight;
      program.uniforms["iResolution"].value.b = clientWidth / clientHeight;
    }
    window.addEventListener("resize", resize);
    resize();
    const currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];
    function handleMouseMove(event) {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      targetMouse = [x, y];
    }
    function handleMouseLeave() {
      targetMouse = [0.5, 0.5];
    }
    if (enableMouseInteraction) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    function update(t) {
      if (enableMouseInteraction) {
        const smoothing = 0.05;
        currentMouse[0] += smoothing * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += smoothing * (targetMouse[1] - currentMouse[1]);
        program.uniforms["uMouse"].value[0] = currentMouse[0];
        program.uniforms["uMouse"].value[1] = currentMouse[1];
      } else {
        program.uniforms["uMouse"].value[0] = 0.5;
        program.uniforms["uMouse"].value[1] = 0.5;
      }
      program.uniforms["iTime"].value = t * 1e-3;
      renderer.render({ scene: mesh });
      animationFrameId.current = requestAnimationFrame(update);
    }
    animationFrameId.current = requestAnimationFrame(update);
    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", resize);
      if (enableMouseInteraction) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (container.contains(gl.canvas)) gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, amplitude, distance, enableMouseInteraction]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerReference,
      className: "relative h-full w-full",
      ...rest
    }
  );
};
function Landing() {
  const heroHeadline = "Render HL7® FHIR® Questionnaires across any UI system";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground font-body", children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        className: "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground",
        href: "#content",
        children: "Skip to content"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "border-b border-border/60 bg-muted/50", children: /* @__PURE__ */ jsxs("div", { className: "container flex items-center justify-between gap-3 px-4 py-2 text-xs text-muted-foreground sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-foreground/80", children: "Alpha" }),
      /* @__PURE__ */ jsx("span", { className: "flex-1", children: "Expect breaking changes while the API stabilizes." }),
      /* @__PURE__ */ jsx(
        "a",
        {
          className: "text-foreground/80 underline-offset-4 transition hover:text-foreground hover:underline",
          href: "https://github.com/HealthSamurai/formbox-renderer/releases",
          target: "_blank",
          rel: "noreferrer",
          children: "Release notes"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(
      SiteHeader,
      {
        links: [
          { href: "#features", label: "Features" },
          { href: "#themes", label: "Themes" },
          { href: "#customize", label: "Customize" },
          { href: "storybook/", label: "Storybook" },
          { href: "docs/", label: "Docs" },
          { href: "#quickstart", label: "Quickstart" }
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute inset-0 -z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background via-background to-muted/40" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.12),transparent_70%)] blur-3xl opacity-70" }),
        /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_30%_30%,hsl(var(--ring)/0.18),transparent_70%)] blur-3xl opacity-60" })
      ] }),
      /* @__PURE__ */ jsxs("main", { id: "content", children: [
        /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden pb-24 pt-32", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "pointer-events-none absolute inset-0",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-35 mix-blend-screen", children: /* @__PURE__ */ jsx(
                Threads,
                {
                  color: [0.9, 0.94, 1],
                  amplitude: 2,
                  distance: 0.4,
                  enableMouseInteraction: true
                }
              ) })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "container grid gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-4 py-1 text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground animate-fade-up motion-reduce:animate-none [animation-delay:0ms]", children: "Open-source · FHIR R5 · React" }),
              /* @__PURE__ */ jsx(
                SplitText,
                {
                  text: heroHeadline,
                  tag: "h1",
                  textAlign: "left",
                  splitType: "words",
                  delay: 40,
                  duration: 1.1,
                  from: { opacity: 0, y: 32 },
                  to: { opacity: 1, y: 0 },
                  className: "block font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground animate-fade-up motion-reduce:animate-none [animation-delay:240ms]", children: "Formbox Renderer is a typed React renderer for FHIR R5 Questionnaires. Build clinical forms once, then ship them with pluggable themes, predictable state, and Storybook-ready previews." }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 animate-fade-up motion-reduce:animate-none [animation-delay:360ms]", children: [
                /* @__PURE__ */ jsx(
                  Magnet,
                  {
                    padding: 100,
                    magnetStrength: 2,
                    wrapperClassName: "inline-flex",
                    innerClassName: "inline-flex",
                    children: /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/25 transition hover:bg-primary/90",
                        href: "storybook/",
                        children: "Explore Storybook"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    className: "inline-flex items-center rounded-full border border-border/70 bg-muted/60 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/40",
                    href: "https://github.com/HealthSamurai/formbox-renderer",
                    target: "_blank",
                    rel: "noreferrer",
                    children: "View on GitHub"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    className: "inline-flex items-center rounded-full border border-border/70 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/40",
                    href: "docs/",
                    children: "Read docs"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    className: "inline-flex items-center rounded-full border border-border/70 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/40",
                    href: "#quickstart",
                    children: "Get started"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 text-sm animate-fade-up motion-reduce:animate-none [animation-delay:480ms]", children: [
                /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-muted-foreground", children: "4 official themes" }),
                /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-muted-foreground", children: "FHIR R5 ready" }),
                /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-muted-foreground", children: "MIT license" }),
                /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-muted-foreground", children: "Headless core" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border/70 bg-card/80 p-7 shadow-xl shadow-black/40 backdrop-blur animate-fade-up motion-reduce:animate-none [animation-delay:200ms]", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Quick install" }),
                /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border/60 bg-muted/60 px-2 py-1 text-[0.65rem] font-semibold text-foreground", children: "FHIR R5" })
              ] }),
              /* @__PURE__ */ jsx("h2", { className: "mt-4 font-display text-lg text-foreground", children: "Render your first Questionnaire" }),
              /* @__PURE__ */ jsx(
                CodeBlock,
                {
                  className: "mt-4",
                  html: '<pre class="shiki github-dark" tabindex="0"><code><span class="line"><span style="color:#B392F0">pnpm</span><span style="color:#9ECBFF"> add</span><span style="color:#9ECBFF"> @formbox/renderer</span><span style="color:#9ECBFF"> @formbox/hs-theme</span></span></code></pre>'
                }
              ),
              /* @__PURE__ */ jsx(
                CodeBlock,
                {
                  className: "mt-4",
                  html: '<pre class="shiki github-dark" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#9ECBFF"> "@formbox/hs-theme/style.css"</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { Renderer } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "@formbox/renderer"</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { theme } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "@formbox/hs-theme"</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#79B8FF">Renderer</span><span style="color:#B392F0"> questionnaire</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{questionnaire} </span><span style="color:#B392F0">theme</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{theme} /></span></span></code></pre>'
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-3 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "mt-1 h-2 w-2 rounded-full bg-primary" }),
                  /* @__PURE__ */ jsx("span", { children: "Swap themes without rewriting questionnaires." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "mt-1 h-2 w-2 rounded-full bg-primary" }),
                  /* @__PURE__ */ jsx("span", { children: "Wire data pipelines with controlled value props." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "mt-1 h-2 w-2 rounded-full bg-primary" }),
                  /* @__PURE__ */ jsx("span", { children: "Validate clinical UX with Storybook previews." })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "section",
          {
            id: "features",
            className: "scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8",
            children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
              /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
                /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl text-foreground", children: "Everything you need to render at scale" }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Purpose-built for FHIR R5 Questionnaires with a fully typed renderer, tested helpers, and predictable state management." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-10 grid grid-cols-1 gap-5 md:grid-cols-6 lg:grid-cols-12", children: [
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-6 lg:col-span-7", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        className: "h-7 w-7 text-foreground/70",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.6",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsx("path", { d: "M12 3l9 5-9 5-9-5 9-5z" }),
                          /* @__PURE__ */ jsx("path", { d: "M3 12l9 5 9-5" }),
                          /* @__PURE__ */ jsx("path", { d: "M3 17l9 5 9-5" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Typed renderer core" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Strict Questionnaire typing, composable renderers, and validation utilities that scale from single forms to full workflows." }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
                      /* @__PURE__ */ jsx("span", { children: "FHIR R5 Questionnaire ready" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
                      /* @__PURE__ */ jsx("span", { children: "Predictable stores and helpers" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
                      /* @__PURE__ */ jsx("span", { children: "Built for clinical UX teams" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-6 lg:col-span-5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        className: "h-7 w-7 text-foreground/70",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.6",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsx("path", { d: "M8 5L4 12l4 7" }),
                          /* @__PURE__ */ jsx("path", { d: "M16 5l4 7-4 7" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Customize themes" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "The renderer never touches DOM APIs directly. Your theme defines markup, layout, and styling while data flows through strict props." })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-3 lg:col-span-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        className: "h-7 w-7 text-foreground/70",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.6",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1.5" }),
                          /* @__PURE__ */ jsx("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1.5" }),
                          /* @__PURE__ */ jsx("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1.5" }),
                          /* @__PURE__ */ jsx("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1.5" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Pre-built themes" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Start with NHS Design, Health Samurai, Ant Design, or Mantine and keep your clinical workflows on-brand." })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-3 lg:col-span-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        className: "h-7 w-7 text-foreground/70",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.6",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsx("path", { d: "M12 3l7 3v6c0 5-3 7-7 9-4-2-7-4-7-9V6l7-3z" }),
                          /* @__PURE__ */ jsx("path", { d: "M9 12l2 2 4-4" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "SDC spec coverage" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Structured Data Capture behavior is covered and actively expanding toward full parity." })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-3 lg:col-span-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        className: "h-7 w-7 text-foreground/70",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.6",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsx("rect", { x: "7", y: "7", width: "10", height: "10", rx: "2" }),
                          /* @__PURE__ */ jsx("path", { d: "M4 9h3M4 15h3M17 9h3M17 15h3" }),
                          /* @__PURE__ */ jsx("path", { d: "M9 4v3M15 4v3M9 17v3M15 17v3" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Headless engine" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Core rendering logic works in React Native, CLI tooling, or server-side environments." })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-6 lg:col-span-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        className: "h-7 w-7 text-foreground/70",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.6",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsx("path", { d: "M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13" }),
                          /* @__PURE__ */ jsx("path", { d: "M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 0 1-7-7L7 11" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Formbox Builder ready" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Integrated with Formbox Builder for end-to-end questionnaire authoring and renderer delivery." })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-6 lg:col-span-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        className: "h-7 w-7 text-foreground/70",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.6",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "5", r: "2.5" }),
                          /* @__PURE__ */ jsx("path", { d: "M4 9h16" }),
                          /* @__PURE__ */ jsx("path", { d: "M10 13l-2 8" }),
                          /* @__PURE__ */ jsx("path", { d: "M14 13l2 8" }),
                          /* @__PURE__ */ jsx("path", { d: "M12 9v11" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Accessibility-first rendering" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "ARIA ids, helper text, and error messaging flow through the theme contract to support WCAG-ready experiences." })
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "section",
          {
            id: "customize",
            className: "scroll-mt-28 border-y border-border/60 bg-muted/30 px-4 py-20 sm:px-6 lg:px-8",
            children: /* @__PURE__ */ jsxs("div", { className: "container grid gap-10 lg:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.3em] text-muted-foreground", children: "Customize" }),
                /* @__PURE__ */ jsx("h2", { className: "mt-4 font-display text-3xl text-foreground", children: "Own the markup, keep the data flow clean" }),
                /* @__PURE__ */ jsx("p", { className: "mt-4 text-base text-muted-foreground", children: "A Theme is a full object with React components for every slot. The renderer never touches DOM APIs directly, so your theme controls layout and styling while data stays purely in props." }),
                /* @__PURE__ */ jsxs("ul", { className: "mt-6 space-y-3 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "mt-1 h-4 w-4 shrink-0 rounded border border-border/60 bg-muted/60" }),
                    /* @__PURE__ */ jsx("span", { children: "Extend a base theme with object spread or build from scratch." })
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "mt-1 h-4 w-4 shrink-0 rounded border border-border/60 bg-muted/60" }),
                    /* @__PURE__ */ jsx("span", { children: "Controlled-value props keep inputs predictable." })
                  ] }),
                  /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "mt-1 h-4 w-4 shrink-0 rounded border border-border/60 bg-muted/60" }),
                    /* @__PURE__ */ jsx("span", { children: "Accessibility contract passes aria ids to your components." })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/70 p-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-display text-base text-foreground", children: "Extend a base theme" }),
                  /* @__PURE__ */ jsx(
                    CodeBlock,
                    {
                      className: "mt-4",
                      html: '<pre class="shiki github-dark" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#F97583"> type</span><span style="color:#E1E4E8"> { Theme } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "@formbox/theme"</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { theme </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> baseTheme } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "@formbox/hs-theme"</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> theme</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Theme</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#F97583">  ...</span><span style="color:#E1E4E8">baseTheme,</span></span>\n<span class="line"><span style="color:#E1E4E8">  Label: MyLabel,</span></span>\n<span class="line"><span style="color:#E1E4E8">};</span></span></code></pre>'
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/70 p-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-display text-base text-foreground", children: "Install the theme contract" }),
                  /* @__PURE__ */ jsx(
                    CodeBlock,
                    {
                      className: "mt-4",
                      html: '<pre class="shiki github-dark" tabindex="0"><code><span class="line"><span style="color:#B392F0">pnpm</span><span style="color:#9ECBFF"> add</span><span style="color:#9ECBFF"> @formbox/theme</span></span></code></pre>'
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "The Theme type requires every component, so you always know what to render." })
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "section",
          {
            id: "themes",
            className: "scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8",
            children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
              /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
                /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl text-foreground", children: "Theme kits ready to ship" }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Start with the official themes or bring your own design system to stay on-brand." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3", children: [
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Health Samurai" }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
                    "Clinical-ready layout density, contrast, and spacing tuned for Formbox workflows, built on",
                    " ",
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "text-foreground/80 transition hover:text-foreground",
                        href: "https://www.health-samurai.io/",
                        target: "_blank",
                        rel: "noreferrer",
                        children: "Health Samurai Design System"
                      }
                    ),
                    "."
                  ] }),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      className: "mt-4 inline-flex items-center text-sm font-semibold text-foreground/80 transition hover:text-foreground",
                      href: "docs/hs-theme/",
                      children: "Docs"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "NHS Design" }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
                    "NHS.UK-aligned typography, spacing, and component behavior for public health services, built on",
                    " ",
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "text-foreground/80 transition hover:text-foreground",
                        href: "https://service-manual.nhs.uk/design-system",
                        target: "_blank",
                        rel: "noreferrer",
                        children: "NHS.UK Design System"
                      }
                    ),
                    "."
                  ] }),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      className: "mt-4 inline-flex items-center text-sm font-semibold text-foreground/80 transition hover:text-foreground",
                      href: "docs/nshuk-theme/",
                      children: "Docs"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Ant Design" }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
                    "Enterprise-grade components and layout patterns for complex clinical apps, powered by",
                    " ",
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "text-foreground/80 transition hover:text-foreground",
                        href: "https://ant.design/",
                        target: "_blank",
                        rel: "noreferrer",
                        children: "Ant Design"
                      }
                    ),
                    "."
                  ] }),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      className: "mt-4 inline-flex items-center text-sm font-semibold text-foreground/80 transition hover:text-foreground",
                      href: "docs/antd-theme/",
                      children: "Docs"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Mantine" }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
                    "Mantine components with first-class Provider setup and theme tokens, built on",
                    " ",
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "text-foreground/80 transition hover:text-foreground",
                        href: "https://mantine.dev/",
                        target: "_blank",
                        rel: "noreferrer",
                        children: "Mantine"
                      }
                    ),
                    "."
                  ] }),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      className: "mt-4 inline-flex items-center text-sm font-semibold text-foreground/80 transition hover:text-foreground",
                      href: "docs/mantine-theme/",
                      children: "Docs"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-dashed border-border/60 bg-card/40 p-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "React Native" }),
                    /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border/60 bg-muted/60 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Coming soon" })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
                    "Gluestack-powered native layouts with accessible, touch-friendly components, built on",
                    " ",
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "text-foreground/80 transition hover:text-foreground",
                        href: "https://gluestack.io/",
                        target: "_blank",
                        rel: "noreferrer",
                        children: "Gluestack UI"
                      }
                    ),
                    "."
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Build Your Own" }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
                    "Map renderer slots to your design system while keeping data flow predictable with the",
                    " ",
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "text-foreground/80 transition hover:text-foreground",
                        href: "docs/theme/",
                        children: "Theme guide"
                      }
                    ),
                    "."
                  ] }),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      className: "mt-4 inline-flex items-center text-sm font-semibold text-foreground/80 transition hover:text-foreground",
                      href: "docs/theme/",
                      children: "Docs"
                    }
                  )
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "section",
          {
            id: "storybook",
            className: "scroll-mt-28 px-4 pb-20 pt-6 sm:px-6 lg:px-8",
            children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx(
              GlareHover,
              {
                width: "100%",
                height: "auto",
                background: "transparent",
                borderRadius: "24px",
                borderColor: "transparent",
                glareColor: "#ffffff",
                glareOpacity: 0.18,
                glareAngle: -20,
                glareSize: 300,
                transitionDuration: 1e3,
                className: "rounded-3xl",
                children: /* @__PURE__ */ jsxs("div", { className: "w-full rounded-3xl border border-border/60 bg-gradient-to-br from-background/80 via-muted/60 to-background/80 p-8 shadow-xl shadow-black/40", children: [
                  /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl text-foreground", children: "Storybook as a living demo" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Browse every renderer, theme, and sample questionnaire. Use the Storybook page as a living design system and QA checklist." }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-4", children: [
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90",
                        href: "storybook/",
                        children: "Open Storybook"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "inline-flex items-center rounded-full border border-border/70 bg-background/40 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/40",
                        href: "#themes",
                        children: "Browse themes"
                      }
                    )
                  ] })
                ] })
              }
            ) })
          }
        ),
        /* @__PURE__ */ jsxs(
          "section",
          {
            id: "quickstart",
            className: "relative scroll-mt-28 border-y border-border/60 bg-muted/30 px-4 py-20 sm:px-6 lg:px-8",
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_55%)]",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:140px_140px]",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "container relative", children: [
                /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.4em] text-muted-foreground", children: "Quickstart" }),
                  /* @__PURE__ */ jsx("h2", { className: "mt-3 font-display text-3xl text-foreground", children: "From install to first render in four moves" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Install the renderer, choose a theme, and wire it to your Questionnaire data in minutes." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative space-y-6", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "absolute left-4 top-5 hidden h-[calc(100%-2.5rem)] w-px bg-border/60 sm:block",
                        "aria-hidden": "true"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-[0.65rem] font-semibold text-foreground", children: "01" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-black/20", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Install" }),
                        /* @__PURE__ */ jsx("h3", { className: "mt-2 font-display text-base text-foreground", children: "Install renderer + theme" }),
                        /* @__PURE__ */ jsx(
                          CodeBlock,
                          {
                            className: "mt-3",
                            html: '<pre class="shiki github-dark" tabindex="0"><code><span class="line"><span style="color:#B392F0">pnpm</span><span style="color:#9ECBFF"> add</span><span style="color:#9ECBFF"> @formbox/renderer</span><span style="color:#9ECBFF"> @formbox/hs-theme</span></span></code></pre>'
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-[0.65rem] font-semibold text-foreground", children: "02" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-black/20", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Style" }),
                        /* @__PURE__ */ jsx("h3", { className: "mt-2 font-display text-base text-foreground", children: "Include the theme CSS" }),
                        /* @__PURE__ */ jsx(
                          CodeBlock,
                          {
                            className: "mt-3",
                            html: '<pre class="shiki github-dark" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#9ECBFF"> "@formbox/hs-theme/style.css"</span><span style="color:#E1E4E8">;</span></span></code></pre>'
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-[0.65rem] font-semibold text-foreground", children: "03" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-black/20", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Import" }),
                        /* @__PURE__ */ jsx("h3", { className: "mt-2 font-display text-base text-foreground", children: "Import theme" }),
                        /* @__PURE__ */ jsx(
                          CodeBlock,
                          {
                            className: "mt-3",
                            html: '<pre class="shiki github-dark" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { theme } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "@formbox/hs-theme"</span><span style="color:#E1E4E8">;</span></span></code></pre>'
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-[0.65rem] font-semibold text-foreground", children: "04" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-black/20", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Render" }),
                        /* @__PURE__ */ jsx("h3", { className: "mt-2 font-display text-base text-foreground", children: "Render Questionnaire" }),
                        /* @__PURE__ */ jsx(
                          CodeBlock,
                          {
                            className: "mt-3",
                            html: '<pre class="shiki github-dark" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#79B8FF">Renderer</span><span style="color:#B392F0"> questionnaire</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{questionnaire} </span><span style="color:#B392F0">theme</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{theme} /></span></span></code></pre>'
                          }
                        )
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border/60 bg-card/70 p-6 shadow-xl shadow-black/30", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.3em] text-muted-foreground", children: "Full sample" }),
                      /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border/60 bg-muted/60 px-2 py-1 text-[0.65rem] font-semibold text-muted-foreground", children: "~5 min" })
                    ] }),
                    /* @__PURE__ */ jsx("h3", { className: "mt-4 font-display text-lg text-foreground", children: "Ready-to-run snippet" }),
                    /* @__PURE__ */ jsx(
                      CodeBlock,
                      {
                        className: "mt-4",
                        html: '<pre class="shiki github-dark" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#9ECBFF"> "@formbox/hs-theme/style.css"</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { Renderer } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "@formbox/renderer"</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { theme } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "@formbox/hs-theme"</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#79B8FF">Renderer</span><span style="color:#B392F0"> questionnaire</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{questionnaire} </span><span style="color:#B392F0">theme</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{theme} /></span></span></code></pre>'
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-3 sm:grid-cols-2", children: [
                      /* @__PURE__ */ jsx(
                        "a",
                        {
                          className: "inline-flex items-center justify-center rounded-full border border-border/70 bg-background/50 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-foreground/40",
                          href: "docs/",
                          children: "Read docs"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "a",
                        {
                          className: "inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90",
                          href: "storybook/",
                          children: "Open Storybook"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "mt-5 rounded-xl border border-border/60 bg-muted/50 p-4 text-xs text-muted-foreground", children: "Pair Storybook with your questionnaires to audit UI, accessibility, and validation rules before shipping." })
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "section",
          {
            id: "community",
            className: "scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8",
            children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
              /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
                /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl text-foreground", children: "Open-source ready" }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Built by the Formbox team and open to the community. File issues, propose improvements, or ship a new theme." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-10 grid gap-5 md:grid-cols-3", children: [
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        className: "h-7 w-7 text-foreground/70",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.6",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsx("circle", { cx: "6", cy: "6", r: "2" }),
                          /* @__PURE__ */ jsx("circle", { cx: "6", cy: "18", r: "2" }),
                          /* @__PURE__ */ jsx("circle", { cx: "18", cy: "18", r: "2" }),
                          /* @__PURE__ */ jsx("path", { d: "M6 8v6a4 4 0 0 0 4 4h6" }),
                          /* @__PURE__ */ jsx("path", { d: "M18 16v-2a4 4 0 0 0-4-4h-4" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Contribute" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Review the codebase, open pull requests, and help shape the roadmap." })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        className: "h-7 w-7 text-foreground/70",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.6",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: [
                          /* @__PURE__ */ jsx("path", { d: "M9 7v4M15 7v4" }),
                          /* @__PURE__ */ jsx("path", { d: "M7 11h10v3a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-3z" }),
                          /* @__PURE__ */ jsx("path", { d: "M12 18v3" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Integrate" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Embed the renderer in patient portals, provider dashboards, or EHR extensions." })
                ] }),
                /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-border/60 bg-card/70 p-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "h-7 w-7 text-foreground/70",
                        viewBox: "0 0 24 24",
                        "aria-hidden": "true",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.6",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        children: /* @__PURE__ */ jsx("path", { d: "M8 4h4a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v4h-2a2 2 0 0 0-2 2v2h-4a2 2 0 0 1-2-2v-2H6a2 2 0 0 1-2-2v-4h2a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2z" })
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-lg text-foreground", children: "Extend" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Build custom themes or renderer overrides for unique clinical workflows." })
                ] })
              ] })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("footer", { className: "border-t border-border/70 px-4 py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "container text-sm text-muted-foreground", children: /* @__PURE__ */ jsxs("p", { children: [
        "Formbox Renderer is an MIT-licensed project by Health Samurai. View the source on",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            className: "text-foreground transition hover:text-primary",
            href: "https://github.com/HealthSamurai/formbox-renderer",
            children: "GitHub"
          }
        ),
        " ",
        "or explore the",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            className: "text-foreground transition hover:text-primary",
            href: "storybook/",
            children: "Storybook demo"
          }
        ),
        "."
      ] }) }) })
    ] })
  ] });
}
function Breadcrumbs({ route, pages }) {
  const page = pages.find((item) => item.href === route);
  const items = [];
  if (page?.sectionLabel) {
    items.push({ label: page.sectionLabel, href: page.sectionHref });
  }
  if (page?.groupLabel) {
    const href = page.groupHref && page.groupHref !== route ? page.groupHref : void 0;
    items.push({ label: page.groupLabel, href });
  }
  if (page?.label && page?.label !== page.groupLabel) {
    items.push({ label: page.label, href: route });
  }
  if (items.length === 0) return;
  const lastIndex = items.length - 1;
  return /* @__PURE__ */ jsx("nav", { "aria-label": "breadcrumb", className: "mb-4", children: /* @__PURE__ */ jsx("ol", { className: "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", children: items.map((item, index2) => {
    const showSeparator = index2 < lastIndex;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("li", { className: "inline-flex items-center gap-1.5", children: item.href ? /* @__PURE__ */ jsx(
        "a",
        {
          href: withBase(item.href),
          className: cn(
            "hover:text-foreground transition-colors",
            index2 === lastIndex && "text-foreground"
          ),
          "aria-current": index2 === lastIndex ? "page" : void 0,
          children: item.label
        }
      ) : /* @__PURE__ */ jsx("span", { className: "text-foreground font-normal", children: item.label }) }),
      showSeparator && /* @__PURE__ */ jsx(
        "li",
        {
          role: "presentation",
          "aria-hidden": "true",
          className: "[&>svg]:h-3.5 [&>svg]:w-3.5",
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" })
        }
      )
    ] }, `${item.label}-${index2}`);
  }) }) });
}
const emptyComponents = {};
const MDXContext = React__default.createContext(emptyComponents);
function useMDXComponents(components) {
  const contextComponents = React__default.useContext(MDXContext);
  return React__default.useMemo(
    function() {
      if (typeof components === "function") {
        return components(contextComponents);
      }
      return { ...contextComponents, ...components };
    },
    [contextComponents, components]
  );
}
function MDXProvider(properties) {
  let allComponents;
  if (properties.disableParentContext) {
    allComponents = typeof properties.components === "function" ? properties.components(emptyComponents) : properties.components || emptyComponents;
  } else {
    allComponents = useMDXComponents(properties.components);
  }
  return React__default.createElement(
    MDXContext.Provider,
    { value: allComponents },
    properties.children
  );
}
function Diagram({ svg, className }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "overflow-x-auto rounded-lg p-4 [&:not(:first-child)]:mt-6",
        className
      ),
      style: { backgroundColor: "#2f363d" },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "flex justify-center [&>svg]:h-auto [&>svg]:max-w-full [&>svg]:w-full",
          "aria-label": "Mermaid diagram",
          role: "img",
          dangerouslySetInnerHTML: { __html: svg }
        }
      )
    }
  );
}
const mdxComponents = {
  Diagram,
  h1: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "h1",
    {
      className: cn(
        "scroll-m-20 break-words text-4xl font-extrabold tracking-tight lg:text-5xl [&:not(:first-child)]:mt-10",
        className
      ),
      ...properties
    }
  ),
  h2: ({
    id,
    className,
    children,
    ...properties
  }) => {
    const headingId = resolveHeadingId(id, children);
    return /* @__PURE__ */ jsx(
      "h2",
      {
        id: headingId,
        className: cn(
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight [&:not(:first-child)]:mt-10",
          className
        ),
        ...properties,
        children: headingId ? /* @__PURE__ */ jsx("a", { href: `#${headingId}`, className: "no-underline hover:no-underline", children }) : children
      }
    );
  },
  h3: ({
    id,
    className,
    children,
    ...properties
  }) => {
    const headingId = resolveHeadingId(id, children);
    return /* @__PURE__ */ jsx(
      "h3",
      {
        id: headingId,
        className: cn(
          "scroll-m-20 text-2xl font-semibold tracking-tight [&:not(:first-child)]:mt-10",
          className
        ),
        ...properties,
        children: headingId ? /* @__PURE__ */ jsx("a", { href: `#${headingId}`, className: "no-underline hover:no-underline", children }) : children
      }
    );
  },
  h4: ({
    id,
    className,
    children,
    ...properties
  }) => {
    const headingId = resolveHeadingId(id, children);
    return /* @__PURE__ */ jsx(
      "h4",
      {
        id: headingId,
        className: cn(
          "scroll-m-20 text-xl font-semibold tracking-tight [&:not(:first-child)]:mt-10",
          className
        ),
        ...properties,
        children: headingId ? /* @__PURE__ */ jsx("a", { href: `#${headingId}`, className: "no-underline hover:no-underline", children }) : children
      }
    );
  },
  h5: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "h5",
    {
      className: cn(
        "scroll-m-20 text-lg font-semibold tracking-tight [&:not(:first-child)]:mt-10",
        className
      ),
      ...properties
    }
  ),
  h6: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "h6",
    {
      className: cn(
        "scroll-m-20 text-lg font-semibold tracking-tight [&:not(:first-child)]:mt-10",
        className
      ),
      ...properties
    }
  ),
  p: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "p",
    {
      className: cn("leading-7 [&:not(:first-child)]:mt-6", className),
      ...properties
    }
  ),
  a: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "a",
    {
      className: cn("font-semibold underline underline-offset-4", className),
      ...properties
    }
  ),
  ul: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "ul",
    {
      className: cn(
        "[&:not(:first-child)]:mt-6 ml-6 list-disc [&>li]:mt-2",
        className
      ),
      ...properties
    }
  ),
  ol: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "ol",
    {
      className: cn(
        "[&:not(:first-child)]:mt-6 ml-6 list-decimal [&>li]:mt-2",
        className
      ),
      ...properties
    }
  ),
  li: ({ className, ...properties }) => /* @__PURE__ */ jsx("li", { className: cn(className), ...properties }),
  blockquote: ({
    className,
    ...properties
  }) => /* @__PURE__ */ jsx(
    "blockquote",
    {
      className: cn(
        "[&:not(:first-child)]:mt-6 border-l-2 pl-6 italic",
        className
      ),
      ...properties
    }
  ),
  pre: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "pre",
    {
      className: cn(
        "relative overflow-x-auto rounded-lg border p-4 font-mono text-sm [&:not(:first-child)]:mt-6",
        className
      ),
      ...properties
    }
  ),
  table: ({ className, ...properties }) => /* @__PURE__ */ jsx("div", { className: "w-full overflow-y-auto [&:not(:first-child)]:mt-6", children: /* @__PURE__ */ jsx("table", { className: cn("w-full", className), ...properties }) }),
  tr: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "tr",
    {
      className: cn("m-0 border-t p-0 even:bg-muted", className),
      ...properties
    }
  ),
  th: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "th",
    {
      className: cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      ),
      ...properties
    }
  ),
  td: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "td",
    {
      className: cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      ),
      ...properties
    }
  ),
  hr: ({ className, ...properties }) => /* @__PURE__ */ jsx(
    "hr",
    {
      className: cn("[&:not(:first-child)]:mt-6", className),
      ...properties
    }
  ),
  strong: ({
    className,
    ...properties
  }) => /* @__PURE__ */ jsx("strong", { className: cn("font-semibold", className), ...properties })
};
function Markdown({
  children,
  contentId,
  className
}) {
  return /* @__PURE__ */ jsx(MDXProvider, { components: mdxComponents, children: /* @__PURE__ */ jsx(
    "div",
    {
      id: contentId,
      className: cn(
        "[&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:relative [&_:not(pre)>code]:rounded [&_:not(pre)>code]:px-[0.3rem] [&_:not(pre)>code]:py-[0.2rem] [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:font-semibold",
        className
      ),
      children
    }
  ) });
}
const frontmatter$7 = {
  "title": "Renderer",
  "order": 1,
  "icon": "rocket"
};
function _createMdxContent$7(props) {
  const _components = {
    code: "code",
    h2: "h2",
    p: "p",
    pre: "pre",
    span: "span",
    ...useMDXComponents(),
    ...props.components
  };
  return jsxs(Fragment$1, {
    children: [jsx(_components.p, {
      children: "Formbox Renderer is a React renderer for FHIR R5 Questionnaires."
    }), "\n", jsx(_components.h2, {
      children: "Install"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "pnpm"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " add"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " @formbox/renderer"
            })]
          })
        })
      })
    }), "\n", jsx(_components.h2, {
      children: "Usage"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " Renderer "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/renderer"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "<"
            }), jsx(_components.span, {
              style: {
                color: "#79B8FF"
              },
              children: "Renderer"
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: " questionnaire"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{questionnaire} />;"
            })]
          })]
        })
      })
    })]
  });
}
function MDXContent$7(props = {}) {
  const { wrapper: MDXLayout } = {
    ...useMDXComponents(),
    ...props.components
  };
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$7, {
      ...props
    })
  }) : _createMdxContent$7(props);
}
const index$5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$7,
  frontmatter: frontmatter$7
}, Symbol.toStringTag, { value: "Module" }));
const frontmatter$6 = {
  "title": "Behavior",
  "order": 2,
  "icon": "settings"
};
function _createMdxContent$6(props) {
  const _components = {
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    ul: "ul",
    ...useMDXComponents(),
    ...props.components
  };
  return jsxs(Fragment$1, {
    children: [jsx(_components.h2, {
      children: "Accessibility contract"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "ariaLabelledBy"
        }), " and ", jsx(_components.code, {
          children: "ariaDescribedBy"
        }), " are already-composed, space-separated id strings. Attach them verbatim to the\nfocusable element; do not join or parse them."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "Label"
        }), " receives ", jsx(_components.code, {
          children: "id"
        }), " for the label element id. Apply it to the element that wraps the visible label text so controls\ncan reference it via ", jsx(_components.code, {
          children: "aria-labelledby"
        }), "."]
      }), "\n", jsxs(_components.li, {
        children: ["When ", jsx(_components.code, {
          children: "id"
        }), " is provided, set it on the primary focusable element. For composite widgets, choose the element that\nreceives keyboard focus."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "ariaDescribedBy"
        }), " references the rendered ", jsx(_components.code, {
          children: "Help"
        }), " and ", jsx(_components.code, {
          children: "Errors"
        }), " ids. Keep those elements in the DOM when you render\nthem. Legal and flyover content is not included in ", jsx(_components.code, {
          children: "ariaDescribedBy"
        }), " by default, so ensure it remains accessible in\nyour layout."]
      }), "\n", jsxs(_components.li, {
        children: ["For ", jsx(_components.code, {
          children: "TabContainer"
        }), ", follow the WAI-ARIA tab pattern: ", jsx(_components.code, {
          children: 'role="tablist"'
        }), " on the container, ", jsx(_components.code, {
          children: 'role="tab"'
        }), " on each tab with\n", jsx(_components.code, {
          children: "id={buttonId}"
        }), ", ", jsx(_components.code, {
          children: 'role="tabpanel"'
        }), " on each panel with ", jsx(_components.code, {
          children: "id={panelId}"
        }), ", and wire ", jsx(_components.code, {
          children: "aria-controls"
        }), "/", jsx(_components.code, {
          children: "aria-labelledby"
        }), "."]
      }), "\n", jsx(_components.li, {
        children: "For custom select or multiselect widgets, follow standard combobox/listbox roles and keyboard interactions (Arrow\nkeys, Enter/Space to select, Escape to close) when you are not using native inputs."
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      children: "Controlled-value contract"
    }), "\n", jsx(_components.p, {
      children: "All inputs are controlled; callbacks receive values, not DOM events."
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "TextInput/TextArea: pass the raw string; empty string stays empty string."
      }), "\n", jsxs(_components.li, {
        children: ["NumberInput/SpinnerInput/SliderInput: parse to ", jsx(_components.code, {
          children: "number"
        }), " or ", jsx(_components.code, {
          children: "undefined"
        }), ". Use ", jsx(_components.code, {
          children: "undefined"
        }), " when the field is empty or\ninvalid; do not pass strings."]
      }), "\n", jsx(_components.li, {
        children: "DateInput/DateTimeInput/TimeInput: treat the value as an opaque string and return it as entered. Do not normalize,\nformat, or shift timezones."
      }), "\n", jsxs(_components.li, {
        children: ["Select/Radio: ", jsx(_components.code, {
          children: "selectedOption = undefined"
        }), " means no selection. Call ", jsx(_components.code, {
          children: "onChange(token | undefined)"
        }), " for changes."]
      }), "\n", jsxs(_components.li, {
        children: ["CheckboxList/MultiSelect: treat ", jsx(_components.code, {
          children: "selectedOptions[].token"
        }), " as the selected set. Call ", jsx(_components.code, {
          children: "onSelect"
        }), " or ", jsx(_components.code, {
          children: "onDeselect"
        }), " once per\nuser action and do not reorder the provided selections."]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      children: "Disabled behavior"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: ["When ", jsx(_components.code, {
          children: "disabled"
        }), " is true, render the UI as disabled and suppress all callbacks."]
      }), "\n", jsxs(_components.li, {
        children: ["Native inputs: use the ", jsx(_components.code, {
          children: "disabled"
        }), " attribute."]
      }), "\n", jsxs(_components.li, {
        children: ["Custom widgets: set ", jsx(_components.code, {
          children: 'aria-disabled="true"'
        }), ", remove from the tab order (", jsx(_components.code, {
          children: "tabIndex={-1}"
        }), "), and ignore pointer/keyboard\nevents."]
      }), "\n", jsx(_components.li, {
        children: "Disabled options should remain visible and announced as disabled."
      }), "\n", jsxs(_components.li, {
        children: ["If an add/remove action is provided with ", jsx(_components.code, {
          children: "canAdd={false}"
        }), " or ", jsx(_components.code, {
          children: "canRemove={false}"
        }), ", render it disabled rather than\nhiding it."]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      children: "Options and custom options lifecycle"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "Tokens are stable for a given option or selection; it is safe to use them as React keys."
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "SelectedOptionItem.label"
        }), " may not match the current options list (legacy or custom values). Render it as provided."]
      }), "\n", jsxs(_components.li, {
        children: ["The renderer may include disabled legacy options in ", jsx(_components.code, {
          children: "options"
        }), " to keep stored answers visible. Treat them as normal\noptions, but disabled."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "specifyOtherOption"
        }), " is an extra option row. When the user selects it, the renderer enters a custom-entry state and\nprovides ", jsx(_components.code, {
          children: "customOptionForm"
        }), "."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "customOptionForm"
        }), " is present only while custom entry is active. Render it near the options list or in place of it;\nuse its ", jsx(_components.code, {
          children: "submit"
        }), " and ", jsx(_components.code, {
          children: "cancel"
        }), " actions to finish or return to the list."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "isLoading"
        }), " can be true while options fetch. The renderer may also render ", jsx(_components.code, {
          children: "OptionsLoading"
        }), " in the question scaffold;\nhandle both without duplicating spinners."]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      children: "Repeating items contract"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "AnswerList"
        }), " renders one or more ", jsx(_components.code, {
          children: "AnswerScaffold"
        }), " entries; when ", jsx(_components.code, {
          children: "onAdd"
        }), " is provided it should render add-answer\ncontrols."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "AnswerScaffold.onRemove"
        }), " is provided for repeating questions; render a remove action next to the control and disable\nit when ", jsx(_components.code, {
          children: "canRemove"
        }), " is false."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "AnswerScaffold.errors"
        }), " is provided for per-answer validation; render it near the answer content (it may render\nnothing)."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "GroupList"
        }), " renders a list of group instances (", jsx(_components.code, {
          children: "GroupScaffold"
        }), ") and can show an add control when ", jsx(_components.code, {
          children: "onAdd"
        }), "\nis provided."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "GroupScaffold"
        }), " should render a remove action when ", jsx(_components.code, {
          children: "onRemove"
        }), " is provided; use ", jsx(_components.code, {
          children: "canRemove"
        }), " to disable."]
      }), "\n"]
    })]
  });
}
function MDXContent$6(props = {}) {
  const { wrapper: MDXLayout } = {
    ...useMDXComponents(),
    ...props.components
  };
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$6, {
      ...props
    })
  }) : _createMdxContent$6(props);
}
const behavior = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$6,
  frontmatter: frontmatter$6
}, Symbol.toStringTag, { value: "Module" }));
const frontmatter$5 = {
  "title": "Specification",
  "order": 1,
  "icon": "book-open"
};
function _createMdxContent$5(props) {
  const _components = {
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    ul: "ul",
    ...useMDXComponents(),
    ...props.components
  }, { Diagram: Diagram2 } = _components;
  if (!Diagram2) _missingMdxReference("Diagram");
  return jsxs(Fragment$1, {
    children: [jsx(_components.h2, {
      children: "Install"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "pnpm"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " add"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " @formbox/theme"
            })]
          })
        })
      })
    }), "\n", jsx(_components.h2, {
      children: "Quick start"
    }), "\n", jsx(_components.p, {
      children: "Create a theme by implementing the Theme contract. You can start from a base theme and override only what you need."
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: " type"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " { Theme } "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/theme"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " Renderer "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/renderer"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " { theme "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "as"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " baseTheme } "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/hs-theme"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "const"
            }), jsx(_components.span, {
              style: {
                color: "#79B8FF"
              },
              children: " theme"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: ":"
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: " Theme"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: " ="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " {"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "  ..."
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "baseTheme,"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "  Label: MyLabel,"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "};"
            })
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "<"
            }), jsx(_components.span, {
              style: {
                color: "#79B8FF"
              },
              children: "Renderer"
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: " questionnaire"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{questionnaire} "
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "theme"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{theme} />;"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      children: "Theme contract"
    }), "\n", jsx(_components.p, {
      children: "A Theme is a full object with React components for every slot listed in the component reference. The renderer never\ntouches DOM APIs directly, so the theme is responsible for markup, layout, and styling while keeping the data flow\npurely through props."
    }), "\n", jsx(_components.p, {
      children: "You may create a complete theme from scratch or extend an existing one with object spread. The Theme type is strict, so\nevery component must be provided."
    }), "\n", jsx(_components.h2, {
      children: "Conventions"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "Controlled props: text/number/date inputs use value and onChange. Single-selects pass selectedOption, multi-selects\npass selectedOptions with onSelect/onDeselect, and checkbox lists use tokens for the selected set. onChange receives\nthe next value, never a DOM event."
      }), "\n", jsx(_components.li, {
        children: "Disabled states: the renderer uses disabled to indicate non-editable inputs. Prefer disabled over readOnly in theme\ncomponents."
      }), "\n", jsx(_components.li, {
        children: "Accessibility: ariaLabelledBy and ariaDescribedBy are string ids. Wire them to the relevant elements."
      }), "\n", jsx(_components.li, {
        children: "Ids: when id is provided, pass it through to the focusable control."
      }), "\n", jsx(_components.li, {
        children: "children is the slot name for single content. Option data types use label for the display content."
      }), "\n", jsx(_components.li, {
        children: "Optional = Yes means the renderer may omit the prop at runtime; Optional = No means it is always passed. Treat undefined as not provided."
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      children: "Renderer composition overview"
    }), "\n", jsx(_components.p, {
      children: "The renderer composes your theme in a predictable tree. You control layout, but the nesting explains where headers,\nerrors, and actions appear."
    }), "\n", jsx(_components.p, {
      children: "Overview diagram (simplified):"
    }), "\n", jsx(Diagram2, {
      svg: '<svg id="diagram-0" width="100%" xmlns="http://www.w3.org/2000/svg" class="flowchart" style="max-width: 616px" viewBox="-8 -8 616 428.4" role="graphics-document document" aria-roledescription="flowchart-v2"><style>#diagram-0{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;fill:#e1e4e8;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#diagram-0 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#diagram-0 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#diagram-0 .error-icon{fill:hsl(26.6666666667, 12.676056338%, 18.9215686275%);}#diagram-0 .error-text{fill:rgb(200.6338028168, 207.4295774647, 212.866197183);stroke:rgb(200.6338028168, 207.4295774647, 212.866197183);}#diagram-0 .edge-thickness-normal{stroke-width:1px;}#diagram-0 .edge-thickness-thick{stroke-width:3.5px;}#diagram-0 .edge-pattern-solid{stroke-dasharray:0;}#diagram-0 .edge-thickness-invisible{stroke-width:0;fill:none;}#diagram-0 .edge-pattern-dashed{stroke-dasharray:3;}#diagram-0 .edge-pattern-dotted{stroke-dasharray:2;}#diagram-0 .marker{fill:#586069;stroke:#586069;}#diagram-0 .marker.cross{stroke:#586069;}#diagram-0 svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;}#diagram-0 p{margin:0;}#diagram-0 .label{font-family:"trebuchet ms",verdana,arial,sans-serif;color:#e1e4e8;}#diagram-0 .cluster-label text{fill:rgb(200.6338028168, 207.4295774647, 212.866197183);}#diagram-0 .cluster-label span{color:rgb(200.6338028168, 207.4295774647, 212.866197183);}#diagram-0 .cluster-label span p{background-color:transparent;}#diagram-0 .label text,#diagram-0 span{fill:#e1e4e8;color:#e1e4e8;}#diagram-0 .node rect,#diagram-0 .node circle,#diagram-0 .node ellipse,#diagram-0 .node polygon,#diagram-0 .node path{fill:#24292e;stroke:#1b1f23;stroke-width:1px;}#diagram-0 .rough-node .label text,#diagram-0 .node .label text,#diagram-0 .image-shape .label,#diagram-0 .icon-shape .label{text-anchor:middle;}#diagram-0 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#diagram-0 .rough-node .label,#diagram-0 .node .label,#diagram-0 .image-shape .label,#diagram-0 .icon-shape .label{text-align:center;}#diagram-0 .node.clickable{cursor:pointer;}#diagram-0 .root .anchor path{fill:#586069!important;stroke-width:0;stroke:#586069;}#diagram-0 .arrowheadPath{fill:#dbd6d1;}#diagram-0 .edgePath .path{stroke:#586069;stroke-width:2.0px;}#diagram-0 .flowchart-link{stroke:#586069;fill:none;}#diagram-0 .edgeLabel{background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);text-align:center;}#diagram-0 .edgeLabel p{background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);}#diagram-0 .edgeLabel rect{opacity:0.5;background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);fill:hsl(86.6666666667, 12.676056338%, 13.9215686275%);}#diagram-0 .labelBkg{background-color:rgba(36.0000000001, 40.0000000001, 31.0000000001, 0.5);}#diagram-0 .cluster rect{fill:hsl(26.6666666667, 12.676056338%, 18.9215686275%);stroke:hsl(26.6666666667, 0%, 8.9215686275%);stroke-width:1px;}#diagram-0 .cluster text{fill:rgb(200.6338028168, 207.4295774647, 212.866197183);}#diagram-0 .cluster span{color:rgb(200.6338028168, 207.4295774647, 212.866197183);}#diagram-0 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:12px;background:hsl(26.6666666667, 12.676056338%, 18.9215686275%);border:1px solid hsl(26.6666666667, 0%, 8.9215686275%);border-radius:2px;pointer-events:none;z-index:100;}#diagram-0 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#e1e4e8;}#diagram-0 rect.text{fill:none;stroke-width:0;}#diagram-0 .icon-shape,#diagram-0 .image-shape{background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);text-align:center;}#diagram-0 .icon-shape p,#diagram-0 .image-shape p{background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);padding:2px;}#diagram-0 .icon-shape rect,#diagram-0 .image-shape rect{opacity:0.5;background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);fill:hsl(86.6666666667, 12.676056338%, 13.9215686275%);}#diagram-0 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#diagram-0 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#diagram-0 :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}</style><g><marker id="diagram-0_flowchart-v2-pointEnd" class="marker flowchart-v2" viewBox="0 0 10 10" refX="5" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" class="arrowMarkerPath" style="stroke-width: 1; stroke-dasharray: 1,0;"/></marker><marker id="diagram-0_flowchart-v2-pointStart" class="marker flowchart-v2" viewBox="0 0 10 10" refX="4.5" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto"><path d="M 0 5 L 10 10 L 10 0 z" class="arrowMarkerPath" style="stroke-width: 1; stroke-dasharray: 1,0;"/></marker><marker id="diagram-0_flowchart-v2-circleEnd" class="marker flowchart-v2" viewBox="0 0 10 10" refX="11" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><circle cx="5" cy="5" r="5" class="arrowMarkerPath" style="stroke-width: 1; stroke-dasharray: 1,0;"/></marker><marker id="diagram-0_flowchart-v2-circleStart" class="marker flowchart-v2" viewBox="0 0 10 10" refX="-1" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><circle cx="5" cy="5" r="5" class="arrowMarkerPath" style="stroke-width: 1; stroke-dasharray: 1,0;"/></marker><marker id="diagram-0_flowchart-v2-crossEnd" class="marker cross flowchart-v2" viewBox="0 0 11 11" refX="12" refY="5.2" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><path d="M 1,1 l 9,9 M 10,1 l -9,9" class="arrowMarkerPath" style="stroke-width: 2; stroke-dasharray: 1,0;"/></marker><marker id="diagram-0_flowchart-v2-crossStart" class="marker cross flowchart-v2" viewBox="0 0 11 11" refX="-1" refY="5.2" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><path d="M 1,1 l 9,9 M 10,1 l -9,9" class="arrowMarkerPath" style="stroke-width: 2; stroke-dasharray: 1,0;"/></marker><g class="root"><g class="clusters"/><g class="edgePaths"><path d="M199.231,57.2L176.359,62.967C153.487,68.733,107.744,80.267,84.872,91.133C62,102,62,112.2,62,117.3L62,122.4" id="L_QS_QH_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_QS_QH_0" data-points="W3sieCI6MTk5LjIzMTA4MTA4MTA4MTA3LCJ5Ijo1Ny4yfSx7IngiOjYyLCJ5Ijo5MS44fSx7IngiOjYyLCJ5IjoxMjYuNH1d" marker-end="url(#diagram-0_flowchart-v2-pointEnd)"/><path d="M296.8,57.2L296.8,62.967C296.8,68.733,296.8,80.267,296.8,91.133C296.8,102,296.8,112.2,296.8,117.3L296.8,122.4" id="L_QS_AL_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_QS_AL_0" data-points="W3sieCI6Mjk2LjgsInkiOjU3LjJ9LHsieCI6Mjk2LjgsInkiOjkxLjh9LHsieCI6Mjk2LjgsInkiOjEyNi40fV0=" marker-end="url(#diagram-0_flowchart-v2-pointEnd)"/><path d="M296.8,175.6L296.8,181.367C296.8,187.133,296.8,198.667,296.8,209.533C296.8,220.4,296.8,230.6,296.8,235.7L296.8,240.8" id="L_AL_AS_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_AL_AS_0" data-points="W3sieCI6Mjk2LjgsInkiOjE3NS42fSx7IngiOjI5Ni44LCJ5IjoyMTAuMjAwMDAwMDAwMDAwMDJ9LHsieCI6Mjk2LjgsInkiOjI0NC44MDAwMDAwMDAwMDAwNH1d" marker-end="url(#diagram-0_flowchart-v2-pointEnd)"/><path d="M225.161,294L208.367,299.767C191.574,305.533,157.987,317.067,141.193,327.933C124.4,338.8,124.4,349,124.4,354.1L124.4,359.2" id="L_AS_CTRL_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_AS_CTRL_0" data-points="W3sieCI6MjI1LjE2MDgxMDgxMDgxMDgsInkiOjI5NC4wMDAwMDAwMDAwMDAwNn0seyJ4IjoxMjQuNDAwMDAwMDAwMDAwMDIsInkiOjMyOC42fSx7IngiOjEyNC40MDAwMDAwMDAwMDAwMiwieSI6MzYzLjJ9XQ==" marker-end="url(#diagram-0_flowchart-v2-pointEnd)"/><path d="M296.8,294L296.8,299.767C296.8,305.533,296.8,317.067,296.8,327.933C296.8,338.8,296.8,349,296.8,354.1L296.8,359.2" id="L_AS_AE_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_AS_AE_0" data-points="W3sieCI6Mjk2LjgsInkiOjI5NC4wMDAwMDAwMDAwMDAwNn0seyJ4IjoyOTYuOCwieSI6MzI4LjZ9LHsieCI6Mjk2LjgsInkiOjM2My4yfV0=" marker-end="url(#diagram-0_flowchart-v2-pointEnd)"/><path d="M382.401,294L402.468,299.767C422.534,305.533,462.667,317.067,482.734,327.933C502.8,338.8,502.8,349,502.8,354.1L502.8,359.2" id="L_AS_CH_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_AS_CH_0" data-points="W3sieCI6MzgyLjQwMTM1MTM1MTM1MTM3LCJ5IjoyOTQuMDAwMDAwMDAwMDAwMDZ9LHsieCI6NTAyLjgsInkiOjMyOC42fSx7IngiOjUwMi44LCJ5IjozNjMuMn1d" marker-end="url(#diagram-0_flowchart-v2-pointEnd)"/><path d="M396.364,57.2L419.703,62.967C443.042,68.733,489.721,80.267,513.061,91.133C536.4,102,536.4,112.2,536.4,117.3L536.4,122.4" id="L_QS_QE_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_QS_QE_0" data-points="W3sieCI6Mzk2LjM2MzUxMzUxMzUxMzU3LCJ5Ijo1Ny4yfSx7IngiOjUzNi40MDAwMDAwMDAwMDAxLCJ5Ijo5MS44fSx7IngiOjUzNi40MDAwMDAwMDAwMDAxLCJ5IjoxMjYuNH1d" marker-end="url(#diagram-0_flowchart-v2-pointEnd)"/></g><g class="edgeLabels"><g><rect class="background" style="stroke: none"/></g><g><rect class="background" style="stroke: none"/></g><g><rect class="background" style="stroke: none"/></g><g><rect class="background" style="stroke: none"/></g><g><rect class="background" style="stroke: none"/></g><g><rect class="background" style="stroke: none"/></g><g><rect class="background" style="stroke: none"/></g><g class="edgeLabel"><g class="label" data-id="L_QS_QH_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g><g class="edgeLabel"><g class="label" data-id="L_QS_AL_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g><g class="edgeLabel"><g class="label" data-id="L_AL_AS_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g><g class="edgeLabel"><g class="label" data-id="L_AS_CTRL_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g><g class="edgeLabel"><g class="label" data-id="L_AS_AE_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g><g class="edgeLabel"><g class="label" data-id="L_AS_CH_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g><g class="edgeLabel"><g class="label" data-id="L_QS_QE_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g></g><g class="nodes"><g class="node default" id="flowchart-QS-0" transform="translate(296.8, 32.6)"><rect class="basic label-container" style="" x="-106.8" y="-24.6" width="213.6" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">QuestionScaffold</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-QH-1" transform="translate(62, 151)"><rect class="basic label-container" style="" x="-54" y="-24.6" width="108" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">Label</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-AL-3" transform="translate(296.8, 151)"><rect class="basic label-container" style="" x="-130.8" y="-24.6" width="261.6" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">AnswerList</tspan><tspan font-style="normal" class="text-inner-tspan" font-weight="normal"> or</tspan><tspan font-style="normal" class="text-inner-tspan" font-weight="normal"> control</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-AS-5" transform="translate(296.8, 269.40000000000003)"><rect class="basic label-container" style="" x="-97.2" y="-24.6" width="194.4" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">AnswerScaffold</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-CTRL-7" transform="translate(124.40000000000002, 387.8)"><rect class="basic label-container" style="" x="-63.6" y="-24.6" width="127.2" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">Control</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-AE-9" transform="translate(296.8, 387.8)"><rect class="basic label-container" style="" x="-58.8" y="-24.6" width="117.6" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">Errors</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-CH-11" transform="translate(502.8, 387.8)"><rect class="basic label-container" style="" x="-97.2" y="-24.6" width="194.4" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">Children</tspan><tspan font-style="normal" class="text-inner-tspan" font-weight="normal"> Nodes</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-QE-13" transform="translate(536.4000000000001, 151)"><rect class="basic label-container" style="" x="-58.8" y="-24.6" width="117.6" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">Errors</tspan></tspan></text></g></g></g></g></g></g></svg>'
    }), "\n", jsx(_components.p, {
      children: "Group list composition for repeating groups:"
    }), "\n", jsx(Diagram2, {
      svg: '<svg id="diagram-1" width="100%" xmlns="http://www.w3.org/2000/svg" class="flowchart" style="max-width: 601.6px" viewBox="-8 -8 601.6 310.00000000000006" role="graphics-document document" aria-roledescription="flowchart-v2"><style>#diagram-1{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;fill:#e1e4e8;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#diagram-1 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#diagram-1 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#diagram-1 .error-icon{fill:hsl(26.6666666667, 12.676056338%, 18.9215686275%);}#diagram-1 .error-text{fill:rgb(200.6338028168, 207.4295774647, 212.866197183);stroke:rgb(200.6338028168, 207.4295774647, 212.866197183);}#diagram-1 .edge-thickness-normal{stroke-width:1px;}#diagram-1 .edge-thickness-thick{stroke-width:3.5px;}#diagram-1 .edge-pattern-solid{stroke-dasharray:0;}#diagram-1 .edge-thickness-invisible{stroke-width:0;fill:none;}#diagram-1 .edge-pattern-dashed{stroke-dasharray:3;}#diagram-1 .edge-pattern-dotted{stroke-dasharray:2;}#diagram-1 .marker{fill:#586069;stroke:#586069;}#diagram-1 .marker.cross{stroke:#586069;}#diagram-1 svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;}#diagram-1 p{margin:0;}#diagram-1 .label{font-family:"trebuchet ms",verdana,arial,sans-serif;color:#e1e4e8;}#diagram-1 .cluster-label text{fill:rgb(200.6338028168, 207.4295774647, 212.866197183);}#diagram-1 .cluster-label span{color:rgb(200.6338028168, 207.4295774647, 212.866197183);}#diagram-1 .cluster-label span p{background-color:transparent;}#diagram-1 .label text,#diagram-1 span{fill:#e1e4e8;color:#e1e4e8;}#diagram-1 .node rect,#diagram-1 .node circle,#diagram-1 .node ellipse,#diagram-1 .node polygon,#diagram-1 .node path{fill:#24292e;stroke:#1b1f23;stroke-width:1px;}#diagram-1 .rough-node .label text,#diagram-1 .node .label text,#diagram-1 .image-shape .label,#diagram-1 .icon-shape .label{text-anchor:middle;}#diagram-1 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#diagram-1 .rough-node .label,#diagram-1 .node .label,#diagram-1 .image-shape .label,#diagram-1 .icon-shape .label{text-align:center;}#diagram-1 .node.clickable{cursor:pointer;}#diagram-1 .root .anchor path{fill:#586069!important;stroke-width:0;stroke:#586069;}#diagram-1 .arrowheadPath{fill:#dbd6d1;}#diagram-1 .edgePath .path{stroke:#586069;stroke-width:2.0px;}#diagram-1 .flowchart-link{stroke:#586069;fill:none;}#diagram-1 .edgeLabel{background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);text-align:center;}#diagram-1 .edgeLabel p{background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);}#diagram-1 .edgeLabel rect{opacity:0.5;background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);fill:hsl(86.6666666667, 12.676056338%, 13.9215686275%);}#diagram-1 .labelBkg{background-color:rgba(36.0000000001, 40.0000000001, 31.0000000001, 0.5);}#diagram-1 .cluster rect{fill:hsl(26.6666666667, 12.676056338%, 18.9215686275%);stroke:hsl(26.6666666667, 0%, 8.9215686275%);stroke-width:1px;}#diagram-1 .cluster text{fill:rgb(200.6338028168, 207.4295774647, 212.866197183);}#diagram-1 .cluster span{color:rgb(200.6338028168, 207.4295774647, 212.866197183);}#diagram-1 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:12px;background:hsl(26.6666666667, 12.676056338%, 18.9215686275%);border:1px solid hsl(26.6666666667, 0%, 8.9215686275%);border-radius:2px;pointer-events:none;z-index:100;}#diagram-1 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#e1e4e8;}#diagram-1 rect.text{fill:none;stroke-width:0;}#diagram-1 .icon-shape,#diagram-1 .image-shape{background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);text-align:center;}#diagram-1 .icon-shape p,#diagram-1 .image-shape p{background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);padding:2px;}#diagram-1 .icon-shape rect,#diagram-1 .image-shape rect{opacity:0.5;background-color:hsl(86.6666666667, 12.676056338%, 13.9215686275%);fill:hsl(86.6666666667, 12.676056338%, 13.9215686275%);}#diagram-1 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#diagram-1 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#diagram-1 :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}</style><g><marker id="diagram-1_flowchart-v2-pointEnd" class="marker flowchart-v2" viewBox="0 0 10 10" refX="5" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" class="arrowMarkerPath" style="stroke-width: 1; stroke-dasharray: 1,0;"/></marker><marker id="diagram-1_flowchart-v2-pointStart" class="marker flowchart-v2" viewBox="0 0 10 10" refX="4.5" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto"><path d="M 0 5 L 10 10 L 10 0 z" class="arrowMarkerPath" style="stroke-width: 1; stroke-dasharray: 1,0;"/></marker><marker id="diagram-1_flowchart-v2-circleEnd" class="marker flowchart-v2" viewBox="0 0 10 10" refX="11" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><circle cx="5" cy="5" r="5" class="arrowMarkerPath" style="stroke-width: 1; stroke-dasharray: 1,0;"/></marker><marker id="diagram-1_flowchart-v2-circleStart" class="marker flowchart-v2" viewBox="0 0 10 10" refX="-1" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><circle cx="5" cy="5" r="5" class="arrowMarkerPath" style="stroke-width: 1; stroke-dasharray: 1,0;"/></marker><marker id="diagram-1_flowchart-v2-crossEnd" class="marker cross flowchart-v2" viewBox="0 0 11 11" refX="12" refY="5.2" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><path d="M 1,1 l 9,9 M 10,1 l -9,9" class="arrowMarkerPath" style="stroke-width: 2; stroke-dasharray: 1,0;"/></marker><marker id="diagram-1_flowchart-v2-crossStart" class="marker cross flowchart-v2" viewBox="0 0 11 11" refX="-1" refY="5.2" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><path d="M 1,1 l 9,9 M 10,1 l -9,9" class="arrowMarkerPath" style="stroke-width: 2; stroke-dasharray: 1,0;"/></marker><g class="root"><g class="clusters"/><g class="edgePaths"><path d="M199.6,53.157L176.667,59.598C153.733,66.038,107.867,78.919,84.933,90.46C62,102,62,112.2,62,117.3L62,122.4" id="L_GLS_GLH_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_GLS_GLH_0" data-points="W3sieCI6MTk5LjYwMDAwMDAwMDAwMDAyLCJ5Ijo1My4xNTcxMTU3NDk1MjU2MTZ9LHsieCI6NjIsInkiOjkxLjh9LHsieCI6NjIsInkiOjEyNi40fV0=" marker-end="url(#diagram-1_flowchart-v2-pointEnd)"/><path d="M272.8,57.2L272.8,62.967C272.8,68.733,272.8,80.267,272.8,91.133C272.8,102,272.8,112.2,272.8,117.3L272.8,122.4" id="L_GLS_GS_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_GLS_GS_0" data-points="W3sieCI6MjcyLjgsInkiOjU3LjJ9LHsieCI6MjcyLjgsInkiOjkxLjh9LHsieCI6MjcyLjgsInkiOjEyNi40fV0=" marker-end="url(#diagram-1_flowchart-v2-pointEnd)"/><path d="M230.997,175.6L221.197,181.367C211.398,187.133,191.799,198.667,181.999,209.533C172.2,220.4,172.2,230.6,172.2,235.7L172.2,240.8" id="L_GS_GSE_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_GS_GSE_0" data-points="W3sieCI6MjMwLjk5NjYyMTYyMTYyMTY3LCJ5IjoxNzUuNn0seyJ4IjoxNzIuMjAwMDAwMDAwMDAwMDUsInkiOjIxMC4yMDAwMDAwMDAwMDAwMn0seyJ4IjoxNzIuMjAwMDAwMDAwMDAwMDUsInkiOjI0NC44MDAwMDAwMDAwMDAwNH1d" marker-end="url(#diagram-1_flowchart-v2-pointEnd)"/><path d="M314.603,175.6L324.403,181.367C334.202,187.133,353.801,198.667,363.601,209.533C373.4,220.4,373.4,230.6,373.4,235.7L373.4,240.8" id="L_GS_GSR_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_GS_GSR_0" data-points="W3sieCI6MzE0LjYwMzM3ODM3ODM3ODM1LCJ5IjoxNzUuNn0seyJ4IjozNzMuNCwieSI6MjEwLjIwMDAwMDAwMDAwMDAyfSx7IngiOjM3My40LCJ5IjoyNDQuODAwMDAwMDAwMDAwMDR9XQ==" marker-end="url(#diagram-1_flowchart-v2-pointEnd)"/><path d="M346,51.056L372.933,57.847C399.867,64.637,453.733,78.219,480.667,90.109C507.6,102,507.6,112.2,507.6,117.3L507.6,122.4" id="L_GLS_GLAdd_0" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" style=";" data-edge="true" data-et="edge" data-id="L_GLS_GLAdd_0" data-points="W3sieCI6MzQ2LCJ5Ijo1MS4wNTU4NzczNDI0MTkwN30seyJ4Ijo1MDcuNiwieSI6OTEuOH0seyJ4Ijo1MDcuNiwieSI6MTI2LjR9XQ==" marker-end="url(#diagram-1_flowchart-v2-pointEnd)"/></g><g class="edgeLabels"><g><rect class="background" style="stroke: none"/></g><g><rect class="background" style="stroke: none"/></g><g><rect class="background" style="stroke: none"/></g><g><rect class="background" style="stroke: none"/></g><g><rect class="background" style="stroke: none"/></g><g class="edgeLabel"><g class="label" data-id="L_GLS_GLH_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g><g class="edgeLabel"><g class="label" data-id="L_GLS_GS_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g><g class="edgeLabel"><g class="label" data-id="L_GS_GSE_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g><g class="edgeLabel"><g class="label" data-id="L_GS_GSR_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g><g class="edgeLabel"><g class="label" data-id="L_GLS_GLAdd_0" transform="translate(-4, -9.6)"><text y="-10.1"><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"/></text></g></g></g><g class="nodes"><g class="node default" id="flowchart-GLS-0" transform="translate(272.8, 32.6)"><rect class="basic label-container" style="" x="-73.19999999999999" y="-24.6" width="146.39999999999998" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">GroupList</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-GLH-1" transform="translate(62, 151)"><rect class="basic label-container" style="" x="-54" y="-24.6" width="108" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">Label</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-GS-3" transform="translate(272.8, 151)"><rect class="basic label-container" style="" x="-106.8" y="-24.6" width="213.6" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">GroupScaffold...</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-GSE-5" transform="translate(172.20000000000005, 269.40000000000003)"><rect class="basic label-container" style="" x="-58.8" y="-24.6" width="117.6" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">Errors</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-GSR-7" transform="translate(373.4, 269.40000000000003)"><rect class="basic label-container" style="" x="-92.4" y="-24.6" width="184.8" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">Remove</tspan><tspan font-style="normal" class="text-inner-tspan" font-weight="normal"> action</tspan></tspan></text></g></g></g><g class="node default" id="flowchart-GLAdd-9" transform="translate(507.6, 151)"><rect class="basic label-container" style="" x="-78" y="-24.6" width="156" height="49.2"/><g class="label" style="" transform="translate(0, -9.6)"><rect/><g><rect class="background" style="stroke: none"/><text y="-10.1" style=""><tspan class="text-outer-tspan" x="0" y="-0.1em" dy="1.1em"><tspan font-style="normal" class="text-inner-tspan" font-weight="normal">Add</tspan><tspan font-style="normal" class="text-inner-tspan" font-weight="normal"> action</tspan></tspan></text></g></g></g></g></g></g></svg>'
    }), "\n", jsx(_components.p, {
      children: "Typical question node:"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "QuestionScaffold"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "  Label"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "  AnswerList (or a single control)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "    AnswerScaffold (per answer)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "      control (TextInput/Select/etc.)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "      remove action (when onRemove is provided)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "      children (nested nodes)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "      errors (Errors)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "  Errors (question-level)"
            })
          })]
        })
      })
    }), "\n", jsx(_components.p, {
      children: "Typical repeating group list:"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "GroupList"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "  Label (only when list has text)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "  GroupScaffold (per instance)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "    remove action (when onRemove is provided)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "    errors"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "  add action (when onAdd is provided)"
            })
          })]
        })
      })
    }), "\n", jsx(_components.p, {
      children: "Typical non-repeating group:"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "GroupScaffold"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "  Label (when visible)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "  Stack (child nodes)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "  Errors"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      children: "Renderer guarantees"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "id"
        }), ", ", jsx(_components.code, {
          children: "ariaLabelledBy"
        }), ", and ", jsx(_components.code, {
          children: "ariaDescribedBy"
        }), " values are unique within a form render and stable for a given node or\nanswer instance."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "ariaDescribedBy"
        }), " strings are already space-joined; use them as-is."]
      }), "\n", jsx(_components.li, {
        children: "Option tokens are stable across renders; selected options may remain when the option list changes."
      }), "\n", jsx(_components.li, {
        children: "When needed, the renderer passes disabled legacy options so stored answers can still render."
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "label"
        }), " and ", jsx(_components.code, {
          children: "children"
        }), " props are ready-to-render ", jsx(_components.code, {
          children: "ReactNode"
        }), " values."]
      }), "\n"]
    })]
  });
}
function MDXContent$5(props = {}) {
  const { wrapper: MDXLayout } = {
    ...useMDXComponents(),
    ...props.components
  };
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$5, {
      ...props
    })
  }) : _createMdxContent$5(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const index$4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$5,
  frontmatter: frontmatter$5
}, Symbol.toStringTag, { value: "Module" }));
const frontmatter$4 = {
  "title": "Reference",
  "order": 3,
  "icon": "list"
};
function _createMdxContent$4(props) {
  const _components = {
    code: "code",
    h2: "h2",
    h3: "h3",
    p: "p",
    pre: "pre",
    span: "span",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ...useMDXComponents(),
    ...props.components
  };
  return jsxs(Fragment$1, {
    children: [jsx(_components.h2, {
      children: "Component reference"
    }), "\n", jsx(_components.h3, {
      children: "Link"
    }), "\n", jsx(_components.p, {
      children: "General-purpose link for references and related actions surfaced by the renderer. Render as an anchor or equivalent\ncontrol with standard link behavior."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "href"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the anchor destination; the renderer passes a fully qualified or relative URL."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render this content inside the link; it may be plain text or richer markup."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "target"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsxs(_components.td, {
            children: ["Set the anchor target when provided, for example ", jsx(_components.code, {
              children: "_blank"
            }), " for a new tab."]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "rel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsxs(_components.td, {
            children: ["Set the anchor rel attribute; when using ", jsx(_components.code, {
              children: "_blank"
            }), ", prefer ", jsx(_components.code, {
              children: "noopener noreferrer"
            }), "."]
          })]
        })]
      })]
    }), "\n", jsx(_components.p, {
      children: "Use standard link behavior; avoid preventing default unless you provide equivalent navigation."
    }), "\n", jsx(_components.h3, {
      children: "Errors"
    }), "\n", jsx(_components.p, {
      children: "Inline list of validation messages for a specific control, answer, or the form summary. Keep each message distinct and\nclose to the related input or summary area."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Apply as the container id so inputs can reference it via aria-describedby."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "messages"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render each string as a distinct message line."
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: ["Consider rendering messages as a list. If you use ", jsx(_components.code, {
        children: "aria-live"
      }), " or ", jsx(_components.code, {
        children: 'role="alert"'
      }), " to announce updates, prefer polite\nannouncements to avoid repeated reads."]
    }), "\n", jsx(_components.h3, {
      children: "OptionsLoading"
    }), "\n", jsx(_components.p, {
      children: "Loading UI for option-backed controls while options are fetching. Use it to show a spinner or skeleton where options\nwould appear."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsx(_components.tbody, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "isLoading"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "When true, show a loading indicator instead of options."
          })]
        })
      })]
    }), "\n", jsxs(_components.p, {
      children: ["The renderer may render ", jsx(_components.code, {
        children: "OptionsLoading"
      }), " in the question scaffold or selection table while options are loading. Option\ncontrols also receive ", jsx(_components.code, {
        children: "isLoading"
      }), ", so avoid duplicating spinners if you render both."]
    }), "\n", jsx(_components.h3, {
      children: "Help"
    }), "\n", jsx(_components.p, {
      children: "Short help text associated with a node label. Usually rendered near the label and referenced by the control via\naria-describedby."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Apply as the element id so the control can reference it."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render this help content near the label or input."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as aria-label for the help region when needed."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "Legal"
    }), "\n", jsx(_components.p, {
      children: "Legal or consent content tied to a node. It can be inline text or a trigger that reveals more detail, but should remain\naccessible."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Apply to the element that contains (or references) the legal text so other components can target it via aria-describedby."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the legal text or markup provided by the renderer."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as an aria-label when the legal UI is only an icon or otherwise lacks a visible label."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "Flyover"
    }), "\n", jsx(_components.p, {
      children: "Supplementary context for a node, often presented as a tooltip or popover. Keep it discoverable from the header and\nreachable via aria-describedby."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Apply to the element that holds (or is referenced by) the flyover content so inputs can point to it via aria-describedby."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the informational content provided by the renderer."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as an aria-label when the flyover UI is an icon-only control."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "Label"
    }), "\n", jsx(_components.p, {
      children: "Header block for questions and groups that owns label layout (prefix + label text), required marker, and optional\nhelp/legal/flyover slots. It also provides the labelled-by anchor for the main control."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "prefix"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render an optional prefix (for example, a question number)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the primary label content for the node."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Use as the id on the label element so inputs can reference it via aria-labelledby."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "htmlFor"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to the label element to connect it to the primary control."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "required"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, display a visual required indicator near the label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "help"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render the help slot content next to or beneath the label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "legal"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render the legal slot content within the header layout."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "flyover"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render the flyover slot content within the header layout."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "as"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: '"legend" | "label" | "text"'
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Hint for the semantic role of the label; themes can select the appropriate tag."
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: [jsx(_components.code, {
        children: "as"
      }), " is a semantic/styling hint; themes may render a ", jsx(_components.code, {
        children: "div"
      }), " for all values (including ", jsx(_components.code, {
        children: '"legend"'
      }), ") and should not assume\nfieldset/legend markup."]
    }), "\n", jsx(_components.h3, {
      children: "InputGroup"
    }), "\n", jsx(_components.p, {
      children: "Layout wrapper for multi-part inputs such as quantity and coding. Arrange the children as a single logical field using\na 12-column span system. Provide a span value per child; themes do not infer or default them. Keep the total at 12 to\navoid gaps or wrapping."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render each child input in order as a single grouped control."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "spans"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsxs(_components.td, {
            children: ["Column spans in a 12-column system (for example, ", jsx(_components.code, {
              children: "[8, 4]"
            }), " for a 2/3 + 1/3 split). Provide one span per child."]
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "TextInput"
    }), "\n", jsx(_components.p, {
      children: "Single-line text field for short string answers, URLs, or identifiers. Render a standard input and forward accessibility\nids and placeholder."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the input element id so labels can target it."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "type"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as the HTML input type (defaults to text in most themes)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "value"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render this string as the current input value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(value: string) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the new string whenever the user edits the field."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the input in a disabled state and prevent edits."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "placeholder"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Show this hint when the input is empty."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the input with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the input with help or error text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "inputMode"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: 'HTMLAttributes<Element>["inputMode"]'
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply to the inputmode attribute to influence virtual keyboard layouts."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "minLength"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Enforce a minimum character length when provided."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "maxLength"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Enforce a maximum character length when provided."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "TextArea"
    }), "\n", jsx(_components.p, {
      children: "Multi-line text field for longer narrative responses. Use a textarea or equivalent and forward accessibility ids and\nplaceholder."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the textarea id so labels can target it."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "value"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render this string as the current textarea value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(value: string) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the new string whenever the user edits the text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the textarea in a disabled state and prevent edits."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "placeholder"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Show this hint when the textarea is empty."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the textarea with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the textarea with help or error text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "inputMode"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: 'HTMLAttributes<Element>["inputMode"]'
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply to the inputmode attribute to influence virtual keyboard layouts."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "minLength"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Enforce a minimum character length when provided."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "maxLength"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Enforce a maximum character length when provided."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "NumberInput"
    }), "\n", jsx(_components.p, {
      children: "Numeric text field for integer, decimal, and quantity values. Accept undefined for empty and show a unit label when\nprovided."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the input id so labels can target it."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "value"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render this number as the current value; omit it to show an empty field."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(value?: number) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the parsed number when the user edits, or undefined when the field is cleared."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the input in a disabled state and prevent edits."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "placeholder"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Show this hint when the field is empty."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "step"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: 'number | "any"'
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply as the input step value to control increments and precision."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "min"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply as the minimum allowed value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "max"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply as the maximum allowed value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the input with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the input with help or error text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "unitLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render a static unit label alongside the input when provided."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "DateInput"
    }), "\n", jsx(_components.p, {
      children: "Date-only field for calendar values. Use a date picker or text input but keep the value string intact."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the input id so labels can target it."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "value"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsxs(_components.td, {
            children: ["Render this date string as the current value (typically ", jsx(_components.code, {
              children: "YYYY-MM-DD"
            }), ")."]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(value: string) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the new date string whenever the user edits the field."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the input in a disabled state and prevent edits."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "placeholder"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Show this hint when the field is empty."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "min"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply as the minimum allowed date value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "max"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply as the maximum allowed date value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the input with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the input with help or error text."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "DateTimeInput"
    }), "\n", jsx(_components.p, {
      children: "Date and time field for combined values. Use a datetime picker or text input but keep the value string intact."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the input id so labels can target it."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "value"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsxs(_components.td, {
            children: ["Render this date-time string as the current value (typically ", jsx(_components.code, {
              children: "YYYY-MM-DDTHH:mm"
            }), ")."]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(value: string) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the new date-time string whenever the user edits the field."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the input in a disabled state and prevent edits."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "placeholder"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Show this hint when the field is empty."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "min"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply as the minimum allowed date-time value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "max"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply as the maximum allowed date-time value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the input with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the input with help or error text."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "TimeInput"
    }), "\n", jsx(_components.p, {
      children: "Time-only field for hours and minutes. Use a time picker or text input but keep the value string intact."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the input id so labels can target it."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "value"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsxs(_components.td, {
            children: ["Render this time string as the current value (typically ", jsx(_components.code, {
              children: "HH:mm"
            }), ")."]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(value: string) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the new time string whenever the user edits the field."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the input in a disabled state and prevent edits."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "placeholder"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Show this hint when the field is empty."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "min"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply as the minimum allowed time value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "max"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply as the maximum allowed time value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the input with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the input with help or error text."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "SliderInput"
    }), "\n", jsx(_components.p, {
      children: "Range control for bounded numeric values. Show bounds and current value when available, and treat undefined as no\nselection."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "value"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render this number as the current slider position; omit it to represent an unset value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(value?: number) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the new numeric value whenever the slider moves, or undefined if cleared."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the slider in a disabled state and prevent interaction."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "min"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as the lower bound for the slider range."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "max"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as the upper bound for the slider range."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "step"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply as the slider step increment."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the slider with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the slider with help or error text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "lowerLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Display this label near the minimum value marker when provided."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "upperLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Display this label near the maximum value marker when provided."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "unitLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render a unit label alongside the current value when provided."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "SpinnerInput"
    }), "\n", jsx(_components.p, {
      children: "Numeric control with stepper affordances for small ranges. It should support typing, step changes, and min/max rules."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "value"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render this number as the current value; omit it to represent an empty field."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(value?: number) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the new numeric value when the user edits or uses the stepper, or undefined when cleared."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the control in a disabled state and prevent interaction."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "min"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as the lower bound for the value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "max"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as the upper bound for the value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "step"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Apply as the step increment for the control."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the input with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the input with help or error text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "placeholder"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Show this hint when the field is empty."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "unitLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render a unit label alongside the input when provided."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "SelectInput"
    }), "\n", jsx(_components.p, {
      children: "Single-select dropdown for option lists. Include disabled legacy entries in the options list when needed and allow\nclearing the selection when applicable."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "options"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OptionItem[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render these entries as selectable options in the dropdown."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "selectedOption"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "SelectedOptionItem"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render this option as the current selection, or omit it when empty."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(token?: string) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the newly selected option token, or undefined when the selection is cleared."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onSearch"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(query: string) => void"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Call with the search query when the user types into the control."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "specifyOtherOption"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OptionItem"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render an extra option (for example, “Specify other”) alongside the options list."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "customOptionForm"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render UI associated with the custom option (for example, a custom value input row)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the select element id so labels can target it."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the select with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the select with help or error text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the select in a disabled state and prevent changes."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "isLoading"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, show a loading indicator or disable option interactions as needed."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "placeholder"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Show this hint in the input when no option is selected."
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: ["The renderer always provides ", jsx(_components.code, {
        children: "id"
      }), " for option-backed controls. Use it on the primary focusable element and for any\ncombobox/listbox wiring in custom select UIs."]
    }), "\n", jsx(_components.h3, {
      children: "RadioButton"
    }), "\n", jsx(_components.p, {
      children: "Single radio input used for table/grid selections or custom radio layouts."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the radio input id so labels can target it."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "groupName"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Use as the radio group name to keep options exclusive."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "value"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the radio value."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "checked"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the radio as selected when true."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call when the user selects this radio."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the radio with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the radio with help or error text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the radio disabled and prevent selection."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "label"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render optional inline label content when provided."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "RadioButtonList"
    }), "\n", jsx(_components.p, {
      children: "Single-select option list presented as radio buttons. Include disabled legacy options in the options list when needed."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "options"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OptionItem[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render these entries as radio options."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "selectedOption"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "SelectedOptionItem"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render this option as the current selection, or omit it when empty."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(token?: string) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the newly selected option token, or undefined when the selection is cleared."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "specifyOtherOption"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OptionItem"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render an extra option (for example, “Specify other”) alongside the options list."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "customOptionForm"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render UI associated with the custom option (for example, a custom value input row)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Use as the radio group name/id so options stay grouped."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the group with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the group with help or error text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render options as disabled and prevent selection changes."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "isLoading"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, show a loading indicator or busy state for the list."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "Checkbox"
    }), "\n", jsx(_components.p, {
      children: "Single checkbox used for table/grid selections or custom checkbox layouts."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the checkbox input id so labels can target it."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "checked"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the checkbox as checked when true."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call when the user toggles this checkbox."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the checkbox with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the checkbox with help or error text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the checkbox disabled and prevent toggling."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "label"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render optional inline label content when provided."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "CheckboxList"
    }), "\n", jsx(_components.p, {
      children: "Multi-select option list presented as checkboxes. Support per-option errors and optional custom-option content."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "options"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OptionItem[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render these entries as checkbox options."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "selectedOptions"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "SelectedOptionItem[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render these selections as checked options and use their tokens to match state."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onSelect"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(token: string) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the option token when the user checks a box."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onDeselect"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(token: string) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the option token when the user unchecks a box."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "specifyOtherOption"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OptionItem"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render an extra option (for example, “Specify other”) alongside the options list."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "customOptionForm"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render UI associated with the custom option (for example, a custom value input row)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Use as the checkbox group name/id so inputs stay grouped."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby to associate the group with its label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby to associate the group with help or error text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render all options as disabled and prevent changes."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "isLoading"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, show a loading indicator or busy state for the list."
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: ["If a selected option provides ", jsx(_components.code, {
        children: "errors"
      }), " or ", jsx(_components.code, {
        children: "ariaDescribedBy"
      }), ", render the error content near that option and attach\n", jsx(_components.code, {
        children: "aria-describedby"
      }), " to the option's focusable element."]
    }), "\n", jsx(_components.h3, {
      children: "MultiSelectInput"
    }), "\n", jsx(_components.p, {
      children: "Composite multi-select UI that combines a picker, chips, and optional custom-option content. It should display\nselections\nas chips and allow removal when permitted."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "options"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OptionItem[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render these entries as options in the picker dropdown."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "selectedOptions"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "SelectedOptionItem[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render these selections as chips and use their tokens to filter options."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onSelect"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(token: string) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the selected option token when the user picks an option."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onDeselect"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(token: string) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call with the selected token when the user removes a selection."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onSearch"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(query: string) => void"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Call with the search query when the user types into the picker input."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the input id so the combobox and listbox can be referenced."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "specifyOtherOption"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OptionItem"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render an extra option (for example, “Specify other”) alongside the options list."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby for the picker so it associates with the label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby for the picker so it associates with help or error text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the picker and chip actions in a disabled state."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "isLoading"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, show a loading indicator or busy state for the options."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "customOptionForm"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render UI associated with the custom option (for example, a custom value input row)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "placeholder"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Show this placeholder text in the picker when no value is selected."
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: ["When rendering chips or selected rows, attach ", jsx(_components.code, {
        children: "SelectedOptionItem.ariaDescribedBy"
      }), " to the focusable element for that\nselection so per-selection errors can be announced."]
    }), "\n", jsx(_components.h3, {
      children: "CustomOptionForm"
    }), "\n", jsx(_components.p, {
      children: "Layout wrapper for custom option entry flows. Use it to present the custom input along with submit/cancel actions."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "content"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the custom input control."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "errors"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render validation or error content associated with the custom input."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "submit"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "CustomOptionAction"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Configure the primary submit action (label, handler, disabled state)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "cancel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "CustomOptionAction"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Configure the secondary cancel action (label, handler, disabled state)."
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: ["Use ", jsx(_components.code, {
        children: "cancel"
      }), ' as the "back to options" action and ', jsx(_components.code, {
        children: "submit"
      }), " to commit the custom value."]
    }), "\n", jsx(_components.h3, {
      children: "FileInput"
    }), "\n", jsx(_components.p, {
      children: "Attachment picker that handles file selection, display of the selected file, and clearing. Call onChange for the raw\nfile (or undefined when clearing) so the renderer can update the Attachment."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "value"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "Attachment"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render this attachment as the current value; omit it when no file is selected."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "id"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Set as the input id so labels can target the underlying file input."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaLabelledBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Forward to aria-labelledby for the file input and any summary region."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby for the file input and any summary region."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, disable file selection and related actions."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "accept"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to the file input accept attribute to limit selectable file types."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(file?: File) => void"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Call with the selected file, or undefined when clearing the current file."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "AnswerList"
    }), "\n", jsx(_components.p, {
      children: "Container that lays out one or more answers and an optional add control. It controls spacing and ordering of answer\nrows."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the list of answer rows supplied by the renderer."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onAdd"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When provided, render an add‑answer control."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "canAdd"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When false, render the add control disabled."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "addLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as the add‑answer label for icon-only controls."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "AnswerScaffold"
    }), "\n", jsx(_components.p, {
      children: "Layout for a single answer row, combining the main control, an optional remove action, and nested content such as child\nnodes and errors."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "control"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the main input control for this answer instance."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onRemove"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When provided, render a remove action for this answer."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "canRemove"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When false, render the remove action disabled."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "errors"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render per-answer validation errors (Errors)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render nested content such as child nodes."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "QuestionScaffold"
    }), "\n", jsx(_components.p, {
      children: "Wrapper around a question that organizes header, control, and validation feedback. Use it as the outer shell for\nquestion nodes."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "linkId"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsxs(_components.td, {
            children: ["Use for debugging; typically render as a ", jsx(_components.code, {
              children: "data-linkId"
            }), " attribute and feel free to ignore it."]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "header"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render the question header (label, help, legal, flyover)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the question body content, including controls and answer-level errors."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "errors"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render question-level validation errors."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "GroupList"
    }), "\n", jsx(_components.p, {
      children: "Wrapper around a repeating group that holds the collection of instances and the add control."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "linkId"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsxs(_components.td, {
            children: ["Use for debugging; typically render as a ", jsx(_components.code, {
              children: "data-linkId"
            }), " attribute and feel free to ignore it."]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "header"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render the header for the repeating group list."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render each group instance inside the list."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onAdd"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When provided, render an add‑group control."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "canAdd"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When false, render the add control disabled."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "addLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as the add‑group label for icon-only controls."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "GroupScaffold"
    }), "\n", jsx(_components.p, {
      children: "Layout shell for a group instance (repeating or not). It can also render an optional remove action and errors."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "header"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render the group header (label, help, legal, flyover)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render the group body content and nested nodes."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "errors"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render per-instance validation errors."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onRemove"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When provided, render a remove action for this instance."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "canRemove"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When false, render the remove action disabled."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "removeLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as the remove label for icon-only controls."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "Header"
    }), "\n", jsxs(_components.p, {
      children: ["Layout wrapper for group nodes rendered with ", jsx(_components.code, {
        children: 'control="header"'
      }), ". Use it to style and place header content such as\nsummary blocks or callouts above a group body."]
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "linkId"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsxs(_components.td, {
            children: ["Use for debugging; typically render as a ", jsx(_components.code, {
              children: "data-linkId"
            }), " attribute and feel free to ignore it."]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the header content provided by the renderer."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "Footer"
    }), "\n", jsxs(_components.p, {
      children: ["Layout wrapper for group nodes rendered with ", jsx(_components.code, {
        children: 'control="footer"'
      }), ". Use it to style and place footer content such as\nsummaries or actions below a group body."]
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "linkId"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsxs(_components.td, {
            children: ["Use for debugging; typically render as a ", jsx(_components.code, {
              children: "data-linkId"
            }), " attribute and feel free to ignore it."]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the footer content provided by the renderer."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "DisplayRenderer"
    }), "\n", jsx(_components.p, {
      children: "Renderer for display-only nodes such as static text or markdown. It should not expose input controls."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "linkId"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsxs(_components.td, {
            children: ["Use for debugging; typically render as a ", jsx(_components.code, {
              children: "data-linkId"
            }), " attribute and feel free to ignore it."]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the display text or markup provided by the renderer."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "Stack"
    }), "\n", jsx(_components.p, {
      children: "List container that renders nodes in order. It should handle spacing and grouping."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsx(_components.tbody, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the node items provided by the renderer in order."
          })]
        })
      })]
    }), "\n", jsx(_components.h3, {
      children: "Form"
    }), "\n", jsx(_components.p, {
      children: "Outer wrapper for the questionnaire. If you render a form element, prevent default and call onSubmit; otherwise invoke\nonSubmit from your own controls. When pagination is provided, render prev/next controls and keep them aligned with\nsubmit/cancel."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onSubmit"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Call when the user submits; prevent default yourself if you render a form."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onCancel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Call when the user cancels the form flow (e.g., resets or exits)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "children"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render the full form content inside the form element."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "pagination"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "FormPagination"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render pagination controls and the current/total page context."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "title"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render the form title text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "description"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render the form description text."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "errors"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render the provided error element near the top of the form."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "before"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render content before the main form body (pinned headers)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "after"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render content after the main form body (actions, footers)."
          })]
        })]
      })]
    }), "\n", jsx(_components.p, {
      children: "Example patterns:"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "<"
            }), jsx(_components.span, {
              style: {
                color: "#85E89D"
              },
              children: "form"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "  onSubmit"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{("
            }), jsx(_components.span, {
              style: {
                color: "#FFAB70"
              },
              children: "event"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ") "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "=>"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " {"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "    event."
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "preventDefault"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "();"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "    onSubmit"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "?.();"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "  }}"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ">"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "  {children}"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "</"
            }), jsx(_components.span, {
              style: {
                color: "#85E89D"
              },
              children: "form"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ">"
            })]
          })]
        })
      })
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "<"
            }), jsx(_components.span, {
              style: {
                color: "#85E89D"
              },
              children: "div"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ">"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "  {children}"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "  <"
            }), jsx(_components.span, {
              style: {
                color: "#85E89D"
              },
              children: "button"
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: " type"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: '"button"'
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: " onClick"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{onSubmit}>"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "    Submit"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "  </"
            }), jsx(_components.span, {
              style: {
                color: "#85E89D"
              },
              children: "button"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ">"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "</"
            }), jsx(_components.span, {
              style: {
                color: "#85E89D"
              },
              children: "div"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ">"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h3, {
      children: "Table"
    }), "\n", jsxs(_components.p, {
      children: ["Tabular layout used by grid-style groups. Render headers and rows based on column and row metadata. Render a row header\ncolumn for the row ", jsx(_components.code, {
        children: "content"
      }), " values. When ", jsx(_components.code, {
        children: "isLoading"
      }), " or ", jsx(_components.code, {
        children: "errors"
      }), " are provided on a column or row, place them alongside\nthe header content."]
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "columns"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "TableColumn[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render these column definitions as table headers."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "rows"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "TableRow[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render these row definitions, including optional row header content and cell content."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "TabContainer"
    }), "\n", jsx(_components.p, {
      children: "Tabbed layout for group panels. Render the active panel, wire ids for aria, and show errors when relevant."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Prop"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "header"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render the tab set header content (often the group label)."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "items"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "TabItem[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render each tab item, including its label and panel content."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "value"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Use as the active tab index to show the selected panel."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onChange"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "(index: number) => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call when the user selects a different tab."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "errors"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render validation or status content associated with the tab set."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "linkId"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsxs(_components.td, {
            children: ["Use for debugging; typically render as a ", jsx(_components.code, {
              children: "data-linkId"
            }), " attribute and feel free to ignore it."]
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: ["Implement tabs with the standard ARIA roles, using ", jsx(_components.code, {
        children: "buttonId"
      }), " and ", jsx(_components.code, {
        children: "panelId"
      }), " to wire ", jsx(_components.code, {
        children: "aria-controls"
      }), " and\n", jsx(_components.code, {
        children: "aria-labelledby"
      }), "."]
    }), "\n", jsx(_components.h2, {
      children: "Data types"
    }), "\n", jsx(_components.p, {
      children: "Shared data structures referenced by theme component props."
    }), "\n", jsx(_components.h3, {
      children: "FormPagination"
    }), "\n", jsxs(_components.p, {
      children: ["Pagination state used by ", jsx(_components.code, {
        children: "Form"
      }), " when rendering paged questionnaires."]
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Field"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "current"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render this as the current page number in the navigation UI."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "total"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render this as the total page count in the navigation UI."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onPrev"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call when the user activates the previous-page control."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onNext"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call when the user activates the next-page control."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabledPrev"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "When true, render the previous-page control disabled."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabledNext"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "When true, render the next-page control disabled."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "OptionItem"
    }), "\n", jsx(_components.p, {
      children: "Base option shape used by option selectors such as select inputs and radio lists."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Field"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "token"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Use as the stable option token for selection and updates; safe as a React key."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "label"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render as the visible label for the option; the renderer provides display-ready content."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the option as unavailable and prevent selection."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "SelectedOptionItem"
    }), "\n", jsx(_components.p, {
      children: "Represents a selected option rendered as a chip or a single selection."
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Field"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "token"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Use as a stable identifier when rendering and updating selections; safe as a React key."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "label"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render as the selection's visible label, which may differ from the current options list."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the selection as unavailable."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ariaDescribedBy"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Forward to aria-describedby on the focusable element for this selection."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "errors"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render as error content associated with this selection, near the option."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "CustomOptionAction"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Field"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "label"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render as the action label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onClick"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Call when the action is activated."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "disabled"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render the action disabled and prevent interaction."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "Attachment"
    }), "\n", jsxs(_components.p, {
      children: ["Attachment shape used by ", jsx(_components.code, {
        children: "FileInput"
      }), " to display metadata and stored content."]
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Field"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "title"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Display name or title to show for the attachment."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "url"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Link target for downloaded or referenced files."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "size"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "number"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Byte size for the attachment used for display."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "contentType"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "MIME type used for labeling or preview decisions."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "data"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Base64-encoded file content for inline attachments."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "TableColumn"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Field"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "token"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Use as a stable identifier for the column."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "content"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render as the column header content."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "isLoading"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render a loading indicator near the content."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "errors"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render errors associated with the column header content."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "TableRow"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Field"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "token"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Use as a stable identifier for the row."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "content"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render as the row header content."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "cells"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "TableCell[]"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render these cells for the row, aligned to columns."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "isLoading"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When true, render a loading indicator near the content."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "errors"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render errors associated with the row header content."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "onRemove"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "() => void"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Invoke when the remove action is activated for this row."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "canRemove"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "boolean"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "When false, render the remove action disabled."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "removeLabel"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Use as the label for icon-only remove controls."
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: ["When any row provides ", jsx(_components.code, {
        children: "onRemove"
      }), ", render a trailing remove-action column for all rows."]
    }), "\n", jsx(_components.h3, {
      children: "TableCell"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Field"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "token"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Use as a stable identifier for the cell."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "content"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "Yes"
          }), jsx(_components.td, {
            children: "Render as the cell content."
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      children: "TabItem"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Field"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Optional"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "token"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Use as a stable identifier for the tab; safe as a React key."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "label"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render as the tab button label."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "buttonId"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Apply as the tab button id and use it for aria-controls."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "panelId"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "string"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Apply as the tab panel id and use it for aria-labelledby."
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "content"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "ReactNode"
            })
          }), jsx(_components.td, {
            children: "No"
          }), jsx(_components.td, {
            children: "Render as the panel content for this tab."
          })]
        })]
      })]
    })]
  });
}
function MDXContent$4(props = {}) {
  const { wrapper: MDXLayout } = {
    ...useMDXComponents(),
    ...props.components
  };
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$4, {
      ...props
    })
  }) : _createMdxContent$4(props);
}
const reference = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$4,
  frontmatter: frontmatter$4
}, Symbol.toStringTag, { value: "Module" }));
const frontmatter$3 = {
  "title": "Ant Design",
  "order": 1
};
function _createMdxContent$3(props) {
  const _components = {
    code: "code",
    h2: "h2",
    p: "p",
    pre: "pre",
    span: "span",
    ...useMDXComponents(),
    ...props.components
  };
  return jsxs(Fragment$1, {
    children: [jsx(_components.p, {
      children: "Ant Design theme for Formbox Renderer."
    }), "\n", jsx(_components.h2, {
      children: "Install"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "pnpm"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " add"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " @formbox/antd-theme"
            })]
          })
        })
      })
    }), "\n", jsx(_components.p, {
      children: "Include the compiled CSS:"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/antd-theme/style.css"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          })
        })
      })
    }), "\n", jsx(_components.h2, {
      children: "Usage"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " Renderer "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/renderer"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " { theme } "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/antd-theme"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "<"
            }), jsx(_components.span, {
              style: {
                color: "#79B8FF"
              },
              children: "Renderer"
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: " questionnaire"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{questionnaire} "
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "theme"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{theme} />;"
            })]
          })]
        })
      })
    })]
  });
}
function MDXContent$3(props = {}) {
  const { wrapper: MDXLayout } = {
    ...useMDXComponents(),
    ...props.components
  };
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$3, {
      ...props
    })
  }) : _createMdxContent$3(props);
}
const index$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$3,
  frontmatter: frontmatter$3
}, Symbol.toStringTag, { value: "Module" }));
const frontmatter$2 = {
  "title": "Health Samurai",
  "order": 2
};
function _createMdxContent$2(props) {
  const _components = {
    code: "code",
    h2: "h2",
    p: "p",
    pre: "pre",
    span: "span",
    ...useMDXComponents(),
    ...props.components
  };
  return jsxs(Fragment$1, {
    children: [jsx(_components.p, {
      children: "Health Samurai-styled theme for Formbox Renderer."
    }), "\n", jsx(_components.h2, {
      children: "Install"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "pnpm"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " add"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " @formbox/hs-theme"
            })]
          })
        })
      })
    }), "\n", jsx(_components.p, {
      children: "Include the compiled CSS:"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/hs-theme/style.css"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          })
        })
      })
    }), "\n", jsx(_components.h2, {
      children: "Usage"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " Renderer "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/renderer"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " { theme } "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/hs-theme"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "<"
            }), jsx(_components.span, {
              style: {
                color: "#79B8FF"
              },
              children: "Renderer"
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: " questionnaire"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{questionnaire} "
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "theme"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{theme} />;"
            })]
          })]
        })
      })
    })]
  });
}
function MDXContent$2(props = {}) {
  const { wrapper: MDXLayout } = {
    ...useMDXComponents(),
    ...props.components
  };
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$2, {
      ...props
    })
  }) : _createMdxContent$2(props);
}
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$2,
  frontmatter: frontmatter$2
}, Symbol.toStringTag, { value: "Module" }));
const frontmatter$1 = {
  "title": "Mantine",
  "order": 3
};
function _createMdxContent$1(props) {
  const _components = {
    code: "code",
    h2: "h2",
    p: "p",
    pre: "pre",
    span: "span",
    ...useMDXComponents(),
    ...props.components
  };
  return jsxs(Fragment$1, {
    children: [jsx(_components.p, {
      children: "Mantine theme for Formbox Renderer."
    }), "\n", jsx(_components.h2, {
      children: "Install"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "pnpm"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " add"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " @formbox/mantine-theme"
            })]
          })
        })
      })
    }), "\n", jsx(_components.p, {
      children: "Include the compiled CSS:"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/mantine-theme/style.css"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          })
        })
      })
    }), "\n", jsx(_components.h2, {
      children: "Usage"
    }), "\n", jsxs(_components.p, {
      children: ["Mantine components require ", jsx(_components.code, {
        children: "MantineProvider"
      }), " in the React tree.\nThis package re-exports it as ", jsx(_components.code, {
        children: "Provider"
      }), " so you can pass any Mantine provider props."]
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " Renderer "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/renderer"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " { Provider, theme } "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/mantine-theme"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "<"
            }), jsx(_components.span, {
              style: {
                color: "#79B8FF"
              },
              children: "Provider"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ">"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "  <"
            }), jsx(_components.span, {
              style: {
                color: "#79B8FF"
              },
              children: "Renderer"
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: " questionnaire"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{questionnaire} "
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "theme"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{theme} />"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "</"
            }), jsx(_components.span, {
              style: {
                color: "#79B8FF"
              },
              children: "Provider"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ">;"
            })]
          })]
        })
      })
    })]
  });
}
function MDXContent$1(props = {}) {
  const { wrapper: MDXLayout } = {
    ...useMDXComponents(),
    ...props.components
  };
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$1, {
      ...props
    })
  }) : _createMdxContent$1(props);
}
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$1,
  frontmatter: frontmatter$1
}, Symbol.toStringTag, { value: "Module" }));
const frontmatter = {
  "title": "NHS Design",
  "order": 4
};
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h2: "h2",
    p: "p",
    pre: "pre",
    span: "span",
    ...useMDXComponents(),
    ...props.components
  };
  return jsxs(Fragment$1, {
    children: [jsxs(_components.p, {
      children: [jsx(_components.a, {
        href: "https://service-manual.nhs.uk/design-system",
        children: "NHS Design"
      }), " theme for Formbox Renderer."]
    }), "\n", jsx(_components.h2, {
      children: "Install"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "pnpm"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " add"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: " @formbox/nshuk-theme"
            })]
          })
        })
      })
    }), "\n", jsx(_components.p, {
      children: "Include the compiled CSS:"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/nshuk-theme/style.css"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          })
        })
      })
    }), "\n", jsx(_components.h2, {
      children: "Usage"
    }), "\n", jsx(Fragment$1, {
      children: jsx(_components.pre, {
        className: "shiki github-dark",
        style: {
          backgroundColor: "#24292e",
          color: "#e1e4e8"
        },
        tabIndex: "0",
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " Renderer "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/renderer"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: " { theme } "
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#9ECBFF"
              },
              children: ' "@formbox/nshuk-theme"'
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: ";"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "<"
            }), jsx(_components.span, {
              style: {
                color: "#79B8FF"
              },
              children: "Renderer"
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: " questionnaire"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{questionnaire} "
            }), jsx(_components.span, {
              style: {
                color: "#B392F0"
              },
              children: "theme"
            }), jsx(_components.span, {
              style: {
                color: "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                color: "#E1E4E8"
              },
              children: "{theme} />;"
            })]
          })]
        })
      })
    })]
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = {
    ...useMDXComponents(),
    ...props.components
  };
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent,
  frontmatter
}, Symbol.toStringTag, { value: "Module" }));
const PATH_RE = /\/(packages|themes)\/([^/]+)\/(?:doc|docs)\/(.+)\.(md|mdx)$/i;
const modules = /* @__PURE__ */ Object.assign({
  "../../../../packages/renderer/doc/index.md": () => Promise.resolve().then(() => index$5),
  "../../../../packages/theme/doc/behavior.md": () => Promise.resolve().then(() => behavior),
  "../../../../packages/theme/doc/index.md": () => Promise.resolve().then(() => index$4),
  "../../../../packages/theme/doc/reference.md": () => Promise.resolve().then(() => reference),
  "../../../../themes/antd-theme/doc/index.md": () => Promise.resolve().then(() => index$3),
  "../../../../themes/hs-theme/doc/index.md": () => Promise.resolve().then(() => index$2),
  "../../../../themes/mantine-theme/doc/index.md": () => Promise.resolve().then(() => index$1),
  "../../../../themes/nshuk-theme/doc/index.md": () => Promise.resolve().then(() => index)
});
const frontmatterByPath = /* @__PURE__ */ Object.assign({
  "../../../../packages/renderer/doc/index.md": frontmatter$7,
  "../../../../packages/theme/doc/behavior.md": frontmatter$6,
  "../../../../packages/theme/doc/index.md": frontmatter$5,
  "../../../../packages/theme/doc/reference.md": frontmatter$4,
  "../../../../themes/antd-theme/doc/index.md": frontmatter$3,
  "../../../../themes/hs-theme/doc/index.md": frontmatter$2,
  "../../../../themes/mantine-theme/doc/index.md": frontmatter$1,
  "../../../../themes/nshuk-theme/doc/index.md": frontmatter
});
const toPosix = (value) => value.replaceAll("\\", "/");
const routes = /* @__PURE__ */ new Map();
const availableThemesRoute = "/docs/themes/";
const coreGroup = {
  label: "",
  pages: [],
  href: void 0,
  icon: void 0
};
const availableThemesGroup = {
  label: "Available Themes",
  pages: [],
  href: availableThemesRoute,
  icon: "palette"
};
const themeBuilderGroup = {
  label: "Custom Theme",
  pages: [],
  href: void 0,
  icon: "paintbrush"
};
const sidebarTemplate = [
  { label: "Core", groups: [coreGroup], href: void 0, icon: "rocket" },
  {
    label: "Themes",
    groups: [availableThemesGroup, themeBuilderGroup],
    href: void 0,
    icon: "palette"
  }
];
const comparePages = (left, right) => {
  const leftOrder = left.order ?? Number.POSITIVE_INFINITY;
  const rightOrder = right.order ?? Number.POSITIVE_INFINITY;
  if (leftOrder !== rightOrder) return leftOrder - rightOrder;
  return left.label.localeCompare(right.label, void 0, {
    sensitivity: "base"
  });
};
for (const [filePath, load] of Object.entries(modules)) {
  const normalized = toPosix(filePath);
  const match = PATH_RE.exec(normalized);
  if (!match) continue;
  const theme = match[1] === "themes";
  const packageName = match[2];
  const slug = match[3];
  const isIndex = slug.toLowerCase() === "index";
  const route = isIndex ? `/docs/${packageName}/` : `/docs/${packageName}/${slug}/`;
  const title = frontmatterByPath[filePath]?.title;
  if (!title) {
    throw new Error(`Missing frontmatter title for ${filePath}`);
  }
  const order = frontmatterByPath[filePath]?.order;
  const sourcePath = normalized.replace(/^(\.\.\/)+/, "");
  const entry = {
    title,
    description: frontmatterByPath[filePath]?.description,
    load,
    sourcePath,
    icon: frontmatterByPath[filePath]?.icon
  };
  routes.set(route, entry);
  if (theme) {
    if (isIndex) {
      availableThemesGroup.pages.push({
        label: entry.title,
        href: route,
        matchPrefix: true,
        order,
        icon: entry.icon
      });
    }
  } else if (packageName === "renderer") {
    coreGroup.pages.push({
      label: entry.title,
      href: route,
      matchPrefix: false,
      order,
      icon: entry.icon
    });
  } else if (packageName === "theme") {
    if (isIndex) {
      themeBuilderGroup.href = route;
    }
    themeBuilderGroup.pages.push({
      label: entry.title,
      href: route,
      matchPrefix: false,
      order,
      icon: entry.icon
    });
  }
}
coreGroup.pages.sort(comparePages);
availableThemesGroup.pages.sort(comparePages);
themeBuilderGroup.pages.sort(comparePages);
const resolveSectionHref = (section) => {
  return section.groups.find((group) => group.href)?.href ?? section.groups.flatMap((group) => group.pages)[0]?.href;
};
const sidebar = sidebarTemplate.map((section) => {
  const groups = section.groups.filter((group) => group.pages.length > 0);
  return {
    ...section,
    groups,
    href: resolveSectionHref({ ...section, groups })
  };
}).filter((section) => section.groups.length > 0);
const flattenedSidebar = sidebar.flatMap(
  (section) => section.groups.flatMap(
    (group) => group.pages.map((page) => ({
      ...page,
      sectionLabel: section.label,
      sectionHref: section.href,
      groupLabel: group.label,
      groupHref: group.href
    }))
  )
);
const getActiveIndex = (pages, route) => {
  return pages.findIndex((page) => page.href === route);
};
function PageFooter({ route, pages }) {
  const activeIndex = getActiveIndex(pages, route);
  const previous = activeIndex > 0 ? pages[activeIndex - 1] : void 0;
  const next = activeIndex >= 0 && activeIndex < pages.length - 1 ? pages[activeIndex + 1] : void 0;
  const entry = routes.get(route);
  const editUrl = entry?.sourcePath ? `https://github.com/HealthSamurai/formbox-renderer/edit/master/${entry.sourcePath}` : void 0;
  return /* @__PURE__ */ jsxs("div", { className: "mt-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex w-full items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "w-fit", children: editUrl ? /* @__PURE__ */ jsx(
        "a",
        {
          href: editUrl,
          target: "_blank",
          rel: "noreferrer",
          className: "text-primary text-sm font-semibold",
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(SquarePen, { className: "size-4" }),
            "Edit this page"
          ] })
        }
      ) : void 0 }),
      /* @__PURE__ */ jsx("div", { className: "w-fit", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold text-primary transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          onClick: () => globalThis.window?.scrollTo({ top: 0, behavior: "smooth" }),
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ArrowUp, { className: "size-4" }),
            "Back to Top"
          ] })
        }
      ) })
    ] }),
    previous || next ? /* @__PURE__ */ jsxs("div", { className: "border-t pt-6 lg:flex lg:flex-row", children: [
      previous ? /* @__PURE__ */ jsx("a", { href: withBase(previous.href), className: "basis-1/3", children: /* @__PURE__ */ jsx("div", { className: "hover:bg-muted/50 mb-4 space-y-2 rounded-lg border p-4 transition-all", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-6 min-w-6", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "mx-auto size-5 self-center" }) }),
        /* @__PURE__ */ jsx("span", { className: "w-full space-y-2 self-center text-left", children: /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold", children: previous.label }) })
      ] }) }) }) : void 0,
      /* @__PURE__ */ jsx("span", { className: "flex-1" }),
      next ? /* @__PURE__ */ jsx("a", { href: withBase(next.href), className: "basis-1/3", children: /* @__PURE__ */ jsx("div", { className: "hover:bg-muted/50 mb-4 space-y-2 rounded-lg border p-4 transition-all", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "w-full space-y-2 self-center text-right", children: /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold", children: next.label }) }),
        /* @__PURE__ */ jsx("div", { className: "ml-auto flex size-6 min-w-6", children: /* @__PURE__ */ jsx(ArrowRight, { className: "mx-auto size-5 self-center" }) })
      ] }) }) }) : void 0
    ] }) : void 0
  ] });
}
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
const tocLinks = [
  {
    label: "Star on GitHub",
    href: "https://github.com/HealthSamurai/formbox-renderer",
    icon: Star
  },
  {
    label: "Create Issues",
    href: "https://github.com/HealthSamurai/formbox-renderer/issues",
    icon: CircleDot
  }
];
const tocIconLinks = [
  // {
  //   label: "GitHub",
  //   href: "https://github.com/HealthSamurai/formbox-renderer",
  //   icon: Github,
  // },
];
const slugify = (value) => {
  return value.toLowerCase().trim().replaceAll(/[^\w\s-]/g, "").replaceAll(/\s+/g, "-").replaceAll(/-+/g, "-");
};
const ensureUniqueId = (value, usedIds) => {
  const baseId = slugify(value) || "section";
  let candidate = baseId;
  let index2 = 2;
  while (usedIds.has(candidate)) {
    candidate = `${baseId}-${index2}`;
    index2 += 1;
  }
  usedIds.add(candidate);
  return candidate;
};
const collectHeadings = (container) => {
  const headingNodes = [
    ...container.querySelectorAll("h1, h2, h3, h4")
  ];
  const usedIds = /* @__PURE__ */ new Set();
  return headingNodes.reduce((items, heading) => {
    const label = heading.textContent?.trim() ?? "";
    if (!label) return items;
    if (heading.id) {
      usedIds.add(heading.id);
    } else {
      heading.id = ensureUniqueId(label, usedIds);
    }
    const level = Number.parseInt(heading.tagName.slice(1), 10);
    items.push({ id: heading.id, label, level });
    return items;
  }, []);
};
const buildTree = (headings) => {
  const root = [];
  const stack = [];
  headings.forEach((heading) => {
    const node = { ...heading, children: [] };
    while (stack.length > 0 && (stack.at(-1)?.level ?? 0) >= heading.level) {
      stack.pop();
    }
    const parent = stack.at(-1);
    if (parent) {
      parent.children.push(node);
    } else {
      root.push(node);
    }
    stack.push(node);
  });
  return root;
};
const TocTree = ({
  nodes,
  activeIds,
  level,
  className,
  onNavigate
}) => {
  return /* @__PURE__ */ jsx("ul", { className: cn(level !== 0 && "pl-4", className), children: nodes.map((node) => {
    const isActive = activeIds.includes(node.id);
    const showBar = level === 0 || isActive;
    const barPositionClass = level === 0 ? "left-0 md:left-[6px]" : "-left-4 md:left-[-10px]";
    return /* @__PURE__ */ jsxs(
      "li",
      {
        className: cn(
          "relative py-1",
          level !== 0 && "[&:first-child]:pt-2 [&:last-child]:pb-0"
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            showBar ? /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "absolute top-0 bottom-0 w-px transition-colors duration-300 ease-in-out",
                  barPositionClass,
                  level === 0 ? isActive ? "bg-primary" : "bg-border" : "bg-primary"
                )
              }
            ) : void 0,
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `#${node.id}`,
                className: cn(
                  "text-muted-foreground hover:text-primary transition-all",
                  "pl-4.5 md:pl-5.5",
                  isActive && "text-primary"
                ),
                onClick: () => onNavigate?.(node.id),
                children: node.label
              }
            )
          ] }),
          node.children.length > 0 ? /* @__PURE__ */ jsx(
            TocTree,
            {
              nodes: node.children,
              activeIds,
              level: level + 1,
              ...onNavigate ? { onNavigate } : {}
            }
          ) : void 0
        ]
      },
      node.id
    );
  }) });
};
function TableOfContents({
  contentId,
  activeRoute,
  isSmall
}) {
  const [headings, setHeadings] = useState([]);
  const [activeIds, setActiveIds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaReference = useRef(
    void 0
  );
  useEffect(() => {
    const documentReference = globalThis.document;
    if (!documentReference) return;
    const scheduleUpdate = globalThis.queueMicrotask ?? ((callback) => globalThis.setTimeout(callback, 0));
    const container = documentReference.querySelector(
      `#${contentId}`
    );
    if (!container) {
      scheduleUpdate(() => {
        setHeadings([]);
        setActiveIds([]);
      });
      return;
    }
    const items = collectHeadings(container);
    scheduleUpdate(() => {
      setHeadings(items);
      const firstItem = items.at(0);
      setActiveIds(firstItem ? [firstItem.id] : []);
    });
    if (items.length === 0 || !globalThis.IntersectionObserver) {
      return;
    }
    const visibleIds = /* @__PURE__ */ new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const headingId = entry.target.id;
          if (!headingId) return;
          if (entry.isIntersecting) {
            visibleIds.add(headingId);
          } else {
            visibleIds.delete(headingId);
          }
        });
        const nextActive = items.filter((item) => visibleIds.has(item.id)).map((item) => item.id);
        setActiveIds(
          (previous) => nextActive.length > 0 ? nextActive : previous
        );
      },
      {
        rootMargin: "-80px 0px 0px 0px",
        threshold: 0
      }
    );
    items.forEach((item) => {
      const heading = documentReference.querySelector(
        `#${item.id}`
      );
      if (heading) observer.observe(heading);
    });
    return () => observer.disconnect();
  }, [contentId, activeRoute]);
  useEffect(() => {
    if (isSmall || activeIds.length === 0) return;
    const viewport = scrollAreaReference.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (!viewport) return;
    const escapeSelector = typeof globalThis.CSS?.escape === "function" ? globalThis.CSS.escape : (value) => value.replaceAll(/["\\]/g, String.raw`\$&`);
    const padding = 16;
    const viewportRect = viewport.getBoundingClientRect();
    const target = activeIds.map(
      (id) => viewport.querySelector(`a[href="#${escapeSelector(id)}"]`)
    ).find((node) => {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      return rect.top < viewportRect.top + padding || rect.bottom > viewportRect.bottom - padding;
    });
    if (!target) return;
    const targetRect = target.getBoundingClientRect();
    if (targetRect.top < viewportRect.top + padding) {
      viewport.scrollBy({
        top: targetRect.top - viewportRect.top - padding,
        behavior: "smooth"
      });
      return;
    }
    if (targetRect.bottom > viewportRect.bottom - padding) {
      viewport.scrollBy({
        top: targetRect.bottom - viewportRect.bottom + padding,
        behavior: "smooth"
      });
    }
  }, [activeIds, isSmall]);
  const tree = useMemo(() => buildTree(headings), [headings]);
  if (headings.length === 0) return;
  if (isSmall) {
    return /* @__PURE__ */ jsxs("div", { className: "block w-full text-sm lg:hidden", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: "flex w-full px-4 md:px-8 py-3 text-left font-medium",
          type: "button",
          onClick: () => setIsOpen((value) => !value),
          children: [
            "On this page",
            /* @__PURE__ */ jsx(
              ChevronRight,
              {
                className: cn(
                  "ml-auto self-center transition-all",
                  isOpen && "rotate-90"
                )
              }
            )
          ]
        }
      ),
      isOpen ? /* @__PURE__ */ jsx("div", { className: "mx-4 mb-3 pl-2 text-sm", children: /* @__PURE__ */ jsx(
        TocTree,
        {
          nodes: tree,
          activeIds,
          level: 0,
          onNavigate: (id) => setActiveIds([id])
        }
      ) }) : void 0
    ] });
  }
  return /* @__PURE__ */ jsx(
    ScrollArea,
    {
      ref: scrollAreaReference,
      className: "z-30 hidden overflow-y-auto md:block lg:block",
      children: /* @__PURE__ */ jsxs("div", { className: "flex h-[calc(100vh-6.5rem)] flex-col gap-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "mb-2 text-base font-semibold", children: "On this page" }),
          /* @__PURE__ */ jsx(
            TocTree,
            {
              nodes: tree,
              activeIds,
              level: 0,
              className: "border-b pb-5",
              onNavigate: (id) => setActiveIds([id])
            }
          )
        ] }),
        tocLinks.length > 0 ? /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "text-muted-foreground",
              tocIconLinks.length > 0 && "border-b pb-5"
            ),
            children: tocLinks.map((link) => /* @__PURE__ */ jsxs(
              "a",
              {
                href: link.href,
                target: "_blank",
                rel: "noreferrer",
                className: "flex w-full gap-1 underline-offset-4 hover:underline [&:not(:first-child)]:pt-3",
                children: [
                  /* @__PURE__ */ jsx(link.icon, { className: "mr-1 self-center size-4" }),
                  link.label,
                  /* @__PURE__ */ jsx(
                    ArrowUpRight,
                    {
                      className: "text-muted-foreground ml-auto self-center",
                      size: 13
                    }
                  )
                ]
              },
              link.href
            ))
          }
        ) : void 0,
        tocIconLinks.length > 0 ? /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: tocIconLinks.map((link) => /* @__PURE__ */ jsx(
          "a",
          {
            href: link.href,
            target: "_blank",
            rel: "noreferrer",
            children: /* @__PURE__ */ jsx("button", { className: "ring-offset-background focus-visible:ring-ring inline-flex size-7 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", children: /* @__PURE__ */ jsx(link.icon, {}) })
          },
          link.href
        )) }) : void 0,
        /* @__PURE__ */ jsx("div", { className: "flex-grow" })
      ] })
    }
  );
}
function Page({
  title,
  description,
  route,
  pages,
  children
}) {
  return /* @__PURE__ */ jsxs(
    "main",
    {
      id: "content",
      className: "lg:grid lg:grid-cols-[1fr_220px] lg:gap-14 lg:py-8 relative py-6",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full min-w-0", children: [
          /* @__PURE__ */ jsx(Breadcrumbs, { route, pages }),
          /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
            /* @__PURE__ */ jsx("h1", { className: "scroll-m-20 break-words text-4xl font-extrabold tracking-tight lg:text-5xl", children: title }),
            description ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground pt-1 text-lg", children: description }) : void 0
          ] }),
          /* @__PURE__ */ jsx(Markdown, { contentId: "docs-content", children }),
          /* @__PURE__ */ jsx(PageFooter, { route, pages })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden text-sm lg:block", children: /* @__PURE__ */ jsx("div", { className: "sticky md:top-[91px]", children: /* @__PURE__ */ jsx(TableOfContents, { contentId: "docs-content", activeRoute: route }) }) })
      ]
    }
  );
}
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
function ExploreCards({ cards }) {
  return /* @__PURE__ */ jsx("section", { className: "grid gap-4 sm:grid-cols-2", children: cards.map((card) => /* @__PURE__ */ jsx("a", { href: withBase(card.href), className: "group", children: /* @__PURE__ */ jsx(Card, { className: "hover:bg-muted/50 shadow-none transition-all", children: /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs font-medium", children: card.eyebrow }),
    /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: card.title }),
    card.description ? /* @__PURE__ */ jsx(CardDescription, { children: card.description }) : void 0
  ] }) }) }, card.href)) });
}
function Themes() {
  const themesSection = sidebar.find((section) => section.label === "Themes");
  const availableThemes = themesSection?.groups.find((group) => group.label === "Available Themes")?.pages ?? [];
  const customThemes = themesSection?.groups.find((group) => group.label === "Custom Theme")?.pages ?? [];
  const availableCards = availableThemes.map((theme) => ({
    href: theme.href,
    eyebrow: "Available Themes",
    title: theme.label,
    description: routes.get(theme.href)?.description
  }));
  const customCards = customThemes.map((theme) => ({
    href: theme.href,
    eyebrow: "Custom Theme",
    title: theme.label,
    description: routes.get(theme.href)?.description
  }));
  return /* @__PURE__ */ jsx("main", { id: "content", className: "relative py-6", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full min-w-0 space-y-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h1", { className: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", children: "Themes" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground pt-1 text-lg", children: "Browse the available themes or build a custom experience from the theme contract." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base leading-7", children: "Start with a ready-made UI kit, review how each theme wires inputs and layouts, and treat them as reference implementations when you want a consistent UI fast." }),
      /* @__PURE__ */ jsx(ExploreCards, { cards: availableCards })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base leading-7", children: "Use the Theme contract to build your own design system, align behavior with renderer guarantees, and keep styling fully in your control." }),
      /* @__PURE__ */ jsx(ExploreCards, { cards: customCards })
    ] })
  ] }) });
}
function Index() {
  const cards = [
    {
      href: "/docs/renderer/",
      eyebrow: "Core",
      title: "Renderer",
      description: "Learn how to wire questionnaires, themes, and state management."
    },
    {
      href: "/docs/themes/",
      eyebrow: "Themes",
      title: "Available Themes",
      description: "Explore the bundled UI themes and pick a starting point."
    },
    {
      href: "/docs/theme/",
      eyebrow: "Themes",
      title: "Custom Theme",
      description: "Review the theme contract and renderer guarantees."
    },
    {
      href: "/storybook/",
      eyebrow: "Demos",
      title: "Storybook",
      description: "Preview components and review supported question types."
    }
  ];
  return /* @__PURE__ */ jsx("main", { id: "content", className: "relative py-6", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full min-w-0", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", children: "Formbox Renderer docs" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground pt-1 text-lg", children: "Read the package docs and guides. Each package keeps its own reference material alongside the code." })
    ] }),
    /* @__PURE__ */ jsx(ExploreCards, { cards })
  ] }) });
}
const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(
    SheetPrimitive.Content,
    {
      ref,
      className: cn(sheetVariants({ side }), className),
      ...props,
      children: [
        /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] }),
        children
      ]
    }
  )
] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
const SheetHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
SheetHeader.displayName = "SheetHeader";
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
function Shell({
  title,
  children,
  mobileNav,
  mobileToc,
  search
}) {
  useEffect(() => {
    if (!globalThis.document) return;
    const resolvedTitle = title ? title.includes("Formbox Docs") ? title : `${title} - Formbox Docs` : "Formbox Docs";
    document.title = resolvedTitle;
  }, [title]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        className: "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-semibold",
        href: "#content",
        children: "Skip to content"
      }
    ),
    /* @__PURE__ */ jsx(SiteHeader, { mobileNav, mobileToc, search }),
    children,
    /* @__PURE__ */ jsx("footer", { className: "text-muted-foreground py-6 md:px-8 md:py-0", children: /* @__PURE__ */ jsxs("div", { className: "container flex flex-col items-center justify-between gap-2 md:h-24 md:flex-row", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Copyright © 2024" }),
      /* @__PURE__ */ jsx("span", { className: "flex-1" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-2 md:justify-end", children: /* @__PURE__ */ jsx(Button, { asChild: true, variant: "ghost", size: "icon", className: "flex gap-2", children: /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://github.com/HealthSamurai/formbox-renderer",
          target: "_blank",
          rel: "noreferrer",
          children: /* @__PURE__ */ jsx(Github, { className: "size-5" })
        }
      ) }) })
    ] }) })
  ] });
}
const normalizeQuery = (value) => value.trim().toLowerCase();
const Kbd = ({ children }) => /* @__PURE__ */ jsx("kbd", { className: "border-border bg-muted pointer-events-none inline-flex h-5 min-h-5 select-none items-center gap-1 rounded border px-1 font-sans text-[11px] font-medium", children });
function Search({
  inAside = false,
  pages
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputReference = useRef(
    void 0
  );
  const filtered = useMemo(() => {
    const normalized = normalizeQuery(query);
    if (!normalized) return pages;
    return pages.filter((item) => {
      const label = `${item.label} ${item.sectionLabel} ${item.groupLabel}`;
      return label.toLowerCase().includes(normalized);
    });
  }, [pages, query]);
  const grouped = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const item of filtered) {
      const section = item.sectionLabel || "Docs";
      const items = map.get(section) ?? [];
      items.push(item);
      map.set(section, items);
    }
    return [...map.entries()];
  }, [filtered]);
  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    if (!open) return;
    const frame = globalThis.requestAnimationFrame(
      () => inputReference.current?.focus()
    );
    return () => globalThis.cancelAnimationFrame(frame);
  }, [open]);
  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setQuery("");
    }
  };
  return /* @__PURE__ */ jsxs(SheetPrimitive.Root, { open, onOpenChange: handleOpenChange, children: [
    /* @__PURE__ */ jsx(SheetPrimitive.Trigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        className: inAside ? "text-muted-foreground hover:text-accent-foreground mb-4 h-8 w-full self-center rounded-md pr-1.5 font-normal" : "text-muted-foreground hover:text-accent-foreground h-8 self-center rounded-md pr-1.5 font-normal md:w-40 lg:w-60",
        children: [
          /* @__PURE__ */ jsx("span", { className: "mr-auto overflow-hidden", children: "Search documentation..." }),
          /* @__PURE__ */ jsx("span", { className: "ml-auto hidden md:block", children: /* @__PURE__ */ jsxs(Kbd, { children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs", children: "⌘" }),
            "K"
          ] }) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(SheetPrimitive.Portal, { children: [
      /* @__PURE__ */ jsx(SheetPrimitive.Overlay, { className: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80" }),
      /* @__PURE__ */ jsxs(SheetPrimitive.Content, { className: "fixed left-1/2 top-1/2 z-50 w-[min(90vw,680px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-0 shadow-lg", children: [
        /* @__PURE__ */ jsx(SheetPrimitive.Title, { className: "sr-only", children: "Search documentation" }),
        /* @__PURE__ */ jsx(SheetPrimitive.Description, { className: "sr-only", children: "Search the Formbox Renderer docs" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b px-3 py-3 text-sm", children: [
          /* @__PURE__ */ jsx(Search$1, { className: "text-muted-foreground size-[18px]" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: inputReference,
              value: query,
              onChange: (event) => setQuery(event.target.value),
              placeholder: "Type to search...",
              className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-h-[60vh] overflow-y-auto p-1 text-sm", children: grouped.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-muted-foreground py-6 text-center", children: "No results found." }) : grouped.map(([section, items]) => /* @__PURE__ */ jsxs("div", { className: "p-1.5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground px-2 py-1.5 text-xs font-medium", children: section }),
          items.map((item) => /* @__PURE__ */ jsx(
            "a",
            {
              href: withBase(item.href),
              onClick: () => setOpen(false),
              className: "hover:bg-muted flex w-full select-none items-center gap-3 rounded-md px-2 py-2",
              children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground", children: item.label }),
                /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs", children: item.groupLabel ? `${item.sectionLabel} / ${item.groupLabel}` : item.sectionLabel })
              ] })
            },
            item.href
          ))
        ] }, section)) })
      ] })
    ] })
  ] });
}
const isPageActive = (activeRoute, href, matchPrefix) => {
  return matchPrefix ? activeRoute?.startsWith(href) : activeRoute === href;
};
const getSectionHref = (section) => {
  return section.href ?? section.groups.find((group) => group.href)?.href ?? section.groups.flatMap((group) => group.pages)[0]?.href ?? "/docs/";
};
const getActiveSection = (sidebar2, activeRoute) => {
  return sidebar2.find(
    (section) => activeRoute ? activeRoute.startsWith(getSectionHref(section)) || section.groups.some(
      (group) => group.pages.some(
        (page) => isPageActive(activeRoute, page.href, page.matchPrefix)
      )
    ) : false
  ) ?? sidebar2[0];
};
function Sidebar({
  sidebar: sidebar2,
  activeRoute,
  onNavigate
}) {
  const activeSection = getActiveSection(sidebar2, activeRoute);
  const iconRegistry = {
    rocket: Rocket,
    palette: Palette,
    paintbrush: Paintbrush2,
    "book-open": BookOpen,
    settings: Settings,
    list: List,
    "layout-grid": LayoutGrid,
    "heart-pulse": HeartPulse,
    sparkles: Sparkles,
    shield: Shield
  };
  const getIcon = (icon) => icon ? iconRegistry[icon] : void 0;
  const [openGroups, setOpenGroups] = useState({});
  const autoOpenGroups = useMemo(() => {
    const nextState = {};
    activeSection?.groups.forEach((group) => {
      if (!group.label) return;
      const isGroupActive = group.pages.some(
        (page) => isPageActive(activeRoute, page.href, page.matchPrefix)
      );
      if (isGroupActive) {
        nextState[group.label] = true;
      }
    });
    return nextState;
  }, [activeRoute, activeSection]);
  if (!activeSection) return;
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1 border-b pb-4", children: sidebar2.map((section) => {
      const href = getSectionHref(section);
      const isActive = activeRoute === href;
      const Icon = getIcon(section.icon);
      return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: withBase(href),
          onClick: onNavigate,
          className: cn(
            "text-foreground/80 hover:bg-muted hover:text-primary flex h-8 items-center gap-2 rounded-md p-2 text-sm",
            isActive && "bg-muted !text-primary font-medium"
          ),
          children: [
            Icon ? /* @__PURE__ */ jsx(Icon, { className: "size-4 self-center" }) : void 0,
            section.label
          ]
        }
      ) }, section.label);
    }) }),
    /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1 py-1 pt-4", children: activeSection.groups.map((group) => {
      if (!group.label) {
        return group.pages.map((item) => {
          const isActive = isPageActive(
            activeRoute,
            item.href,
            item.matchPrefix
          );
          const Icon2 = getIcon(item.icon);
          return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: withBase(item.href),
              onClick: onNavigate,
              className: cn(
                "text-foreground/80 hover:bg-muted hover:text-primary flex h-8 items-center gap-2 rounded-md p-2 text-sm",
                isActive && "bg-muted !text-primary font-medium"
              ),
              children: [
                Icon2 ? /* @__PURE__ */ jsx(Icon2, { className: "min-w-4 self-center", size: 16 }) : void 0,
                /* @__PURE__ */ jsx("span", { className: "truncate text-nowrap", children: item.label })
              ]
            }
          ) }, item.href);
        });
      }
      const Icon = getIcon(group.icon);
      const isOpen = openGroups[group.label] ?? autoOpenGroups[group.label] ?? false;
      return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "text-foreground/80 hover:bg-muted hover:text-primary flex h-8 w-full cursor-pointer items-center gap-2 rounded-md p-2 text-left text-sm",
            onClick: () => setOpenGroups((previous) => ({
              ...previous,
              [group.label]: !(previous[group.label] ?? false)
            })),
            children: [
              Icon ? /* @__PURE__ */ jsx(Icon, { className: "min-w-4 self-center", size: 16 }) : void 0,
              /* @__PURE__ */ jsx("span", { className: "truncate text-nowrap", children: group.label }),
              /* @__PURE__ */ jsx(
                ChevronDown,
                {
                  className: cn(
                    "ml-auto transition-transform",
                    !isOpen && "-rotate-90"
                  ),
                  size: 16
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { style: isOpen ? void 0 : { display: "none" }, children: /* @__PURE__ */ jsx("ul", { className: "mx-3.5 flex flex-col gap-1 border-l px-2.5 py-1", children: group.pages.map((item) => {
          const isActive = isPageActive(
            activeRoute,
            item.href,
            item.matchPrefix
          );
          const PageIcon = getIcon(item.icon);
          return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: withBase(item.href),
              onClick: onNavigate,
              className: cn(
                "text-foreground/80 hover:bg-muted hover:text-primary flex h-8 items-center gap-2 rounded-md p-2 text-sm",
                isActive && "bg-muted !text-primary font-medium"
              ),
              children: [
                PageIcon ? /* @__PURE__ */ jsx(
                  PageIcon,
                  {
                    className: "min-w-4 self-center",
                    size: 16
                  }
                ) : void 0,
                /* @__PURE__ */ jsx("span", { className: "truncate text-nowrap", children: item.label })
              ]
            }
          ) }, item.href);
        }) }) })
      ] }) }, group.label);
    }) })
  ] });
}
function Layout({
  title,
  activeRoute,
  children,
  pages
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return /* @__PURE__ */ jsx(
    Shell,
    {
      title,
      search: /* @__PURE__ */ jsx(Search, { pages }),
      mobileNav: /* @__PURE__ */ jsxs(Sheet, { open: menuOpen, onOpenChange: setMenuOpen, children: [
        /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "md:hidden", children: /* @__PURE__ */ jsx(Menu, { className: "size-[18px]" }) }) }),
        /* @__PURE__ */ jsxs(SheetContent, { side: "left", className: "pr-0", children: [
          /* @__PURE__ */ jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsxs("a", { className: "flex", href: withBase("/"), children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                className: "h-7 w-7 brightness-0 invert",
                src: withBase("/android-chrome-192x192.png"),
                alt: "Formbox logo"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "ml-3 self-center font-bold", children: "Formbox Renderer" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "relative h-full overflow-hidden py-6 pr-6 text-sm", children: /* @__PURE__ */ jsx(
            Sidebar,
            {
              sidebar,
              activeRoute,
              onNavigate: () => setMenuOpen(false)
            }
          ) }),
          /* @__PURE__ */ jsx(SheetHeader, { className: "sr-only", children: /* @__PURE__ */ jsx(SheetTitle, { children: "Docs navigation" }) })
        ] })
      ] }),
      mobileToc: /* @__PURE__ */ jsx(
        TableOfContents,
        {
          contentId: "docs-content",
          activeRoute,
          isSmall: true
        }
      ),
      children: /* @__PURE__ */ jsx("div", { className: "min-h-screen border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 items-start px-4 md:grid md:gap-6 md:px-8 lg:gap-10 container md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]", children: [
        /* @__PURE__ */ jsx("aside", { className: "h-[calc(100vh-3.5rem)] md:top-[61px] fixed z-30 -ml-2 hidden w-full shrink-0 overflow-y-auto top-[102px] md:sticky md:block", children: /* @__PURE__ */ jsx(ScrollArea, { className: "h-full py-6 pr-6 text-sm md:pr-4", children: /* @__PURE__ */ jsx(Sidebar, { sidebar, activeRoute }) }) }),
        children
      ] }) })
    }
  );
}
const normalizeRoute = (value) => {
  if (!value.startsWith("/")) {
    value = `/${value}`;
  }
  if (value === "/") return value;
  return value.endsWith("/") ? value : `${value}/`;
};
const NotFound = ({ title }) => /* @__PURE__ */ jsx(Shell, { title, children: /* @__PURE__ */ jsxs(
  "div",
  {
    id: "content",
    className: "flex h-[calc(100vh-3.5rem)] items-center justify-center",
    children: [
      /* @__PURE__ */ jsx("h3", { className: "scroll-m-20 border-r px-4 py-3 text-2xl font-semibold", children: "404" }),
      /* @__PURE__ */ jsx("span", { className: "scroll-m-20 px-4", children: "This page could not be found." })
    ]
  }
) });
const getRoutes = () => [
  "/",
  "/docs/",
  "/docs/themes/",
  ...routes.keys()
];
const resolveRoute = async (url) => {
  const pathname = normalizeRoute(
    stripBase(new URL(url, "http://localhost").pathname)
  );
  if (pathname.startsWith("/docs/")) {
    if (pathname === "/docs/") {
      return {
        element: /* @__PURE__ */ jsx(
          Layout,
          {
            title: "Formbox Docs",
            activeRoute: pathname,
            pages: flattenedSidebar,
            children: /* @__PURE__ */ jsx(Index, {})
          }
        ),
        title: "Formbox Docs"
      };
    }
    if (pathname === "/docs/themes/") {
      return {
        element: /* @__PURE__ */ jsx(
          Layout,
          {
            title: "Themes",
            activeRoute: pathname,
            pages: flattenedSidebar,
            children: /* @__PURE__ */ jsx(Themes, {})
          }
        ),
        title: "Themes - Formbox Docs"
      };
    }
    const entry = routes.get(pathname);
    if (!entry) {
      return {
        element: /* @__PURE__ */ jsx(NotFound, { title: "Docs · Not Found" }),
        title: "Docs · Not Found"
      };
    }
    const module = await entry.load();
    const Content = module.default;
    return {
      element: /* @__PURE__ */ jsx(
        Layout,
        {
          title: entry.title,
          activeRoute: pathname,
          pages: flattenedSidebar,
          children: /* @__PURE__ */ jsx(
            Page,
            {
              title: entry.title,
              description: entry.description,
              route: pathname,
              pages: flattenedSidebar,
              children: /* @__PURE__ */ jsx(Content, {})
            }
          )
        }
      ),
      title: `${entry.title} - Formbox Docs`
    };
  }
  if (pathname !== "/") {
    return {
      element: /* @__PURE__ */ jsx(NotFound, { title: "Not Found" }),
      title: "Not Found"
    };
  }
  return {
    element: /* @__PURE__ */ jsx(Landing, {}),
    title: "Formbox Renderer"
  };
};
async function render(url) {
  const { element, title } = await resolveRoute(url);
  const appHtml = renderToString(element);
  return { appHtml, title };
}
export {
  getRoutes as prerenderRoutes,
  render
};
