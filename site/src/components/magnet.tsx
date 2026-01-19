import React, { useEffect, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

interface MagnetProperties extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const Magnet: React.FC<MagnetProperties> = ({
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
  const magnetReference = useRef<HTMLDivElement | null>(
    undefined as unknown as HTMLDivElement | null,
  );

  useEffect(() => {
    if (disabled) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
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
  const transitionStyle = resolvedIsActive
    ? activeTransition
    : inactiveTransition;

  return (
    <div
      ref={magnetReference}
      className={wrapperClassName}
      style={{ position: "relative", display: "inline-block" }}
      {...properties}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${resolvedPosition.x}px, ${resolvedPosition.y}px, 0)`,
          transition: transitionStyle,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
