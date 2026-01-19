import React, { useRef } from "react";

interface GlareHoverProperties {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children?: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const GlareHover: React.FC<GlareHoverProperties> = ({
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
  style = {},
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

  const overlayReference = useRef<HTMLDivElement | null>(
    undefined as unknown as HTMLDivElement | null,
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

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(${glareAngle}deg,
        hsla(0,0%,0%,0) 60%,
        ${rgba} 70%,
        hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-100% -100%, 0 0",
    pointerEvents: "none",
  };

  return (
    <div
      className={`relative grid place-items-center overflow-hidden border cursor-pointer ${className}`}
      style={{
        width,
        height,
        background,
        borderRadius,
        borderColor,
        ...style,
      }}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      <div ref={overlayReference} style={overlayStyle} />
      {children}
    </div>
  );
};

export default GlareHover;
