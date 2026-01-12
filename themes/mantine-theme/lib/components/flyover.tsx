import { ActionIcon, Tooltip, VisuallyHidden } from "@mantine/core";
import type { FlyoverProperties } from "@aidbox-forms/theme";

export function Flyover({ id, children, ariaLabel }: FlyoverProperties) {
  const ariaLabelProps =
    ariaLabel == undefined ? {} : { "aria-label": ariaLabel };

  return (
    <Tooltip label={children} withArrow>
      <span>
        <ActionIcon
          variant="subtle"
          size="sm"
          aria-describedby={id}
          {...ariaLabelProps}
        >
          i
        </ActionIcon>
        <VisuallyHidden id={id}>{children}</VisuallyHidden>
      </span>
    </Tooltip>
  );
}
