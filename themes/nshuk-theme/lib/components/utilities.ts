import { useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

function getHorizontalDistance(a: DOMRect, b: DOMRect) {
  if (a.right < b.left) return b.left - a.right;
  if (b.right < a.left) return a.left - b.right;
  return 0;
}

export function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function useIsWithinGap(
  containerReference: RefObject<HTMLElement | null>,
  primaryReference: RefObject<HTMLElement | null>,
  secondaryReference: RefObject<HTMLElement | null>,
  minGap: number,
  dependencies: readonly unknown[] = [],
) {
  const [isClose, setIsClose] = useState(false);

  useLayoutEffect(() => {
    const updateLabelVisibility = () => {
      const primaryElement = primaryReference.current;
      const secondaryElement = secondaryReference.current;
      if (primaryElement == undefined || secondaryElement == undefined) return;

      const primaryRect = primaryElement.getBoundingClientRect();
      const secondaryRect = secondaryElement.getBoundingClientRect();
      const nextClose =
        getHorizontalDistance(primaryRect, secondaryRect) < minGap;

      setIsClose(nextClose);
    };

    const scheduleUpdate =
      typeof globalThis.requestAnimationFrame === "function"
        ? globalThis.requestAnimationFrame
        : (callback: FrameRequestCallback) =>
            globalThis.setTimeout(callback, 0);
    const cancelScheduledUpdate =
      typeof globalThis.cancelAnimationFrame === "function"
        ? globalThis.cancelAnimationFrame
        : (id: number) => {
            globalThis.clearTimeout(id);
          };

    const scheduledId = scheduleUpdate(() => updateLabelVisibility());

    const containerElement = containerReference.current;
    if (containerElement == undefined) {
      return () => {
        cancelScheduledUpdate(scheduledId);
      };
    }
    if (typeof ResizeObserver === "undefined") {
      const handleResize = () => updateLabelVisibility();
      globalThis.addEventListener("resize", handleResize);
      return () => {
        cancelScheduledUpdate(scheduledId);
        globalThis.removeEventListener("resize", handleResize);
      };
    }
    const observer = new ResizeObserver(() => updateLabelVisibility());
    observer.observe(containerElement);
    return () => {
      cancelScheduledUpdate(scheduledId);
      observer.disconnect();
    };
  }, [
    containerReference,
    minGap,
    primaryReference,
    secondaryReference,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...dependencies,
  ]);

  return isClose;
}
