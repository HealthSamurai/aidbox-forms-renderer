import { ActionIcon, Tooltip, VisuallyHidden } from "@mantine/core";
import type { HelpProperties } from "@aidbox-forms/theme";

export function Help({ id, children, ariaLabel }: HelpProperties) {
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
          ?
        </ActionIcon>
        <VisuallyHidden id={id}>{children}</VisuallyHidden>
      </span>
    </Tooltip>
  );
}
