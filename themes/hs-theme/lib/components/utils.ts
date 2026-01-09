import { useCallback, useLayoutEffect, useState } from "react";
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

export function getPrecision(value: number) {
  if (!Number.isFinite(value)) return 0;
  const stringValue = value.toString();
  const scientificIndex = stringValue.indexOf("e-");
  if (scientificIndex !== -1) {
    const exponent = Number(stringValue.slice(scientificIndex + 2));
    return Number.isFinite(exponent) ? exponent : 0;
  }
  const decimalIndex = stringValue.indexOf(".");
  return decimalIndex === -1 ? 0 : stringValue.length - decimalIndex - 1;
}

export function roundToPrecision(value: number, precision: number) {
  if (!Number.isFinite(value)) return value;
  if (precision <= 0) return Math.round(value);
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function useIsWithinGap(
  containerRef: RefObject<HTMLElement | null>,
  primaryRef: RefObject<HTMLElement | null>,
  secondaryRef: RefObject<HTMLElement | null>,
  minGap: number,
) {
  const [isClose, setIsClose] = useState(false);

  const updateLabelVisibility = useCallback(() => {
    const primaryEl = primaryRef.current;
    const secondaryEl = secondaryRef.current;
    if (!primaryEl || !secondaryEl) return;

    const primaryRect = primaryEl.getBoundingClientRect();
    const secondaryRect = secondaryEl.getBoundingClientRect();
    const nextClose =
      getHorizontalDistance(primaryRect, secondaryRect) < minGap;

    setIsClose((prev) => (prev !== nextClose ? nextClose : prev));
  }, [minGap, primaryRef, secondaryRef]);

  useLayoutEffect(() => {
    updateLabelVisibility();
  });

  useLayoutEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    if (typeof ResizeObserver === "undefined") {
      const handleResize = () => updateLabelVisibility();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
    const observer = new ResizeObserver(() => updateLabelVisibility());
    observer.observe(containerEl);
    return () => observer.disconnect();
  }, [containerRef, updateLabelVisibility]);

  return isClose;
}
