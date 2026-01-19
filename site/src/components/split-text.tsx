import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType } from "react";

type SplitTextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
type SplitTextConstructor = typeof import("gsap/SplitText").SplitText;
type SplitTextInstance = InstanceType<SplitTextConstructor>;
type GsapRuntime = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  SplitText: SplitTextConstructor;
};

type TweenVariables = Record<string, number | string | boolean | undefined>;

const DEFAULT_FROM: TweenVariables = { opacity: 0, y: 40 };
const DEFAULT_TO: TweenVariables = { opacity: 1, y: 0 };

export interface SplitTextProperties {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: TweenVariables;
  to?: TweenVariables;
  threshold?: number;
  rootMargin?: string;
  tag?: SplitTextTag;
  textAlign?: CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

let gsapRuntimePromise: Promise<GsapRuntime> | undefined;

const loadGsapRuntime = () => {
  if (!gsapRuntimePromise) {
    gsapRuntimePromise = Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
    ]).then(([gsapModule, scrollTriggerModule, splitTextModule]) => {
      const { gsap } = gsapModule;
      const { ScrollTrigger } = scrollTriggerModule;
      const { SplitText } = splitTextModule;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      return { gsap, ScrollTrigger, SplitText };
    });
  }
  return gsapRuntimePromise;
};

export default function SplitText({
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
  onLetterAnimationComplete,
}: SplitTextProperties) {
  const elementReference = useRef<HTMLElement | null>(
    undefined as unknown as HTMLElement | null,
  );
  const animationCompletedReference = useRef(false);
  const onCompleteReference = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(() => {
    const fonts = globalThis.document?.fonts;
    return !fonts || fonts.status === "loaded";
  });
  const [runtime, setRuntime] = useState<GsapRuntime>();

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
      },
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

    const elementWithInstance = element as HTMLElement & {
      splitInstance?: SplitTextInstance;
    };

    if (elementWithInstance.splitInstance) {
      try {
        elementWithInstance.splitInstance.revert();
      } catch {
        // Ignore revert failures from interrupted animations.
      }
      delete elementWithInstance.splitInstance;
    }

    const { gsap, ScrollTrigger, SplitText: SplitTextConstructor } = runtime;
    const startPercent = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? Number.parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch?.[2] ?? "px";
    const sign =
      marginValue === 0
        ? ""
        : marginValue < 0
          ? `-=${Math.abs(marginValue)}${marginUnit}`
          : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPercent}%${sign}`;
    let targets: Element[] = [];

    const assignTargets = (splitInstance: SplitTextInstance) => {
      if (
        splitType.includes("chars") &&
        (splitInstance.chars?.length ?? 0) > 0
      ) {
        targets = splitInstance.chars ?? [];
        return;
      }
      if (splitType.includes("words") && splitInstance.words.length > 0) {
        targets = splitInstance.words;
        return;
      }
      if (splitType.includes("lines") && splitInstance.lines.length > 0) {
        targets = splitInstance.lines;
        return;
      }
      targets =
        splitInstance.chars ?? splitInstance.words ?? splitInstance.lines ?? [];
    };

    const splitInstance = new SplitTextConstructor(element, {
      type: splitType,
      smartWrap: true,
      autoSplit: splitType === "lines",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
      reduceWhiteSpace: false,
      onSplit: (instance: SplitTextInstance) => {
        assignTargets(instance);
        return gsap.fromTo(
          targets,
          { ...from },
          {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            scrollTrigger: {
              trigger: element,
              start,
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4,
            },
            onComplete: () => {
              animationCompletedReference.current = true;
              onCompleteReference.current?.();
            },
            willChange: "transform, opacity",
            force3D: true,
          },
        );
      },
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
        // Ignore revert failures from interrupted animations.
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
    rootMargin,
  ]);

  const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;
  const style: CSSProperties = {
    textAlign,
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };
  const Tag: ElementType = tag;
  const setElementReference = useCallback((node: HTMLElement | null) => {
    elementReference.current = node;
  }, []);

  return (
    <Tag ref={setElementReference} style={style} className={classes}>
      {text}
    </Tag>
  );
}
