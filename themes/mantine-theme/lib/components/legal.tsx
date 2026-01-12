import { ActionIcon, Box, Popover, Text, VisuallyHidden } from "@mantine/core";
import { useState } from "react";
import type { LegalProperties } from "@aidbox-forms/theme";

export function Legal({ id, children, ariaLabel }: LegalProperties) {
  const [opened, setOpened] = useState(false);
  const ariaLabelProps =
    ariaLabel == undefined ? {} : { "aria-label": ariaLabel };

  return (
    <Popover opened={opened} onChange={setOpened} width={320} withArrow>
      <Popover.Target>
        <span>
          <ActionIcon
            variant="subtle"
            color="orange"
            size="sm"
            aria-describedby={id}
            {...ariaLabelProps}
            onClick={() => setOpened((value) => !value)}
          >
            §
          </ActionIcon>
          <VisuallyHidden id={id}>{children}</VisuallyHidden>
        </span>
      </Popover.Target>
      <Popover.Dropdown>
        <Box>
          <Text size="sm">{children}</Text>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}
