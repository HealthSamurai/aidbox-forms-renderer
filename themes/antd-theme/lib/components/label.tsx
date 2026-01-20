import type { LabelProperties } from "@formbox/theme";
import { Space, Typography } from "antd";
import type { CSSProperties } from "react";

export function Label({
  prefix,
  children,
  id,
  htmlFor,
  required,
  help,
  legal,
  flyover,
  as = "label",
}: LabelProperties) {
  const WrapperTag = as === "label" ? "label" : "div";
  const labelProperties = as === "label" ? { htmlFor } : undefined;
  const isEmphasized = as !== "text";
  const isLegend = as === "legend";

  const textStyle: CSSProperties = {
    fontWeight: isEmphasized ? 600 : undefined,
    fontSize: isLegend ? "1.25rem" : undefined,
  };

  return (
    <WrapperTag style={{ display: "block" }} {...labelProperties}>
      <Space align="center" size="small" wrap>
        <Typography.Text id={id} style={textStyle}>
          {prefix && (
            <span style={{ fontWeight: 600, marginRight: "0.25rem" }}>
              {prefix}
            </span>
          )}
          {children}
          {required && (
            <span
              aria-hidden
              style={{ color: "#cf1322", marginLeft: "0.25rem" }}
            >
              *
            </span>
          )}
        </Typography.Text>
        {help}
        {legal}
        {flyover}
      </Space>
    </WrapperTag>
  );
}
