import type { CheckboxListProperties } from "@formbox/theme";
import { Checkbox as AntCheckbox, Space } from "antd";
import { LoadingSpinner } from "./loading-spinner.tsx";

export function CheckboxList({
  options,
  selectedOptions,
  onSelect,
  onDeselect,
  specifyOtherOption,
  customOptionForm,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled = false,
  isLoading = false,
}: CheckboxListProperties) {
  const entries = specifyOtherOption
    ? [...options, specifyOtherOption]
    : options;
  const selectedTokens = new Set(selectedOptions.map((entry) => entry.token));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div
        id={id}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      >
        <Space orientation="vertical" size="small">
          {entries.map((entry) => {
            const isChecked = selectedTokens.has(entry.token);
            return (
              <AntCheckbox
                key={entry.token}
                checked={isChecked}
                disabled={disabled || entry.disabled === true}
                onChange={() => {
                  if (isChecked) {
                    onDeselect(entry.token);
                  } else {
                    onSelect(entry.token);
                  }
                }}
              >
                {entry.label}
              </AntCheckbox>
            );
          })}
        </Space>
      </div>
      {isLoading && <LoadingSpinner />}
      {customOptionForm}
    </div>
  );
}
