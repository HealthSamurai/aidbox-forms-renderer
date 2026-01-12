import { ActionIcon, Tooltip, VisuallyHidden } from "@mantine/core";
import type { HelpProperties } from "@aidbox-forms/theme";

export function Help({ id, children, ariaLabel }: HelpProperties) {
  const ariaLabelProperties =
    ariaLabel == undefined ? {} : { "aria-label": ariaLabel };

  return (
    <Tooltip label={children} withArrow>
      <span>
        <ActionIcon
          variant="subtle"
          size="sm"
          aria-describedby={id}
          {...ariaLabelProperties}
        >
          ?
        </ActionIcon>
        <VisuallyHidden id={id}>{children}</VisuallyHidden>
      </span>
    </Tooltip>
  );
}
