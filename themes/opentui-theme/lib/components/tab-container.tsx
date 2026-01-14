import type { TabContainerProperties } from "@aidbox-forms/theme";
import type { SelectOption } from "@opentui/core";
import { useMemo } from "react";
import { useFocusable } from "./focus-provider.tsx";
import { toPlainText } from "./utilities.tsx";

export function TabContainer({
  header,
  items,
  value,
  onChange,
  errors,
  linkId,
}: TabContainerProperties) {
  const controlId = `${linkId}-tabs`;
  const { focused } = useFocusable(controlId, true);

  const options = useMemo<SelectOption[]>(() => {
    return items.map((item) => ({
      name: toPlainText(item.label) || item.token,
      description: "",
      value: item.token,
    }));
  }, [items]);

  const selectedIndex = Math.min(
    Math.max(value, 0),
    Math.max(items.length - 1, 0),
  );

  return (
    <box id={linkId} flexDirection="column" style={{ gap: 1 }}>
      {header}
      <box style={{ border: true, height: 6, paddingLeft: 1, paddingRight: 1 }}>
        <select
          options={options}
          selectedIndex={selectedIndex}
          showDescription={false}
          showScrollIndicator
          wrapSelection
          focused={focused}
          onSelect={(index) => {
            onChange(index);
          }}
        />
      </box>
      {errors}
      {items[selectedIndex]?.content}
    </box>
  );
}
