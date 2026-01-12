import type { LegalProperties } from "@aidbox-forms/theme";
import { Button, Tooltip } from "antd";

export function Legal({ id, children, ariaLabel }: LegalProperties) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      <Tooltip title={children} placement="top">
        <Button
          type="text"
          size="small"
          shape="circle"
          aria-label={ariaLabel}
          aria-describedby={id}
        >
          i
        </Button>
      </Tooltip>
      <span id={id} className="ab-antd-sr-only">
        {children}
      </span>
    </span>
  );
}
