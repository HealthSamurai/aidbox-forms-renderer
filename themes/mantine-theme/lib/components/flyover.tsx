import { ActionIcon, Tooltip, VisuallyHidden } from "@mantine/core";
import type { FlyoverProperties } from "@formbox/theme";

export function Flyover({ id, children, ariaLabel }: FlyoverProperties) {
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
          i
        </ActionIcon>
        <VisuallyHidden id={id}>{children}</VisuallyHidden>
      </span>
    </Tooltip>
  );
}
