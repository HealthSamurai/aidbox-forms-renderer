import type { RadioButtonListProperties } from "@aidbox-forms/theme";
import { Radio, Space } from "antd";
import { LoadingSpinner } from "./loading-spinner.tsx";

export function RadioButtonList({
  options,
  selectedOption,
  onChange,
  specifyOtherOption,
  customOptionForm,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled = false,
  isLoading = false,
}: RadioButtonListProperties) {
  const entries = specifyOtherOption
    ? [...options, specifyOtherOption]
    : options;
  const selectedToken = selectedOption?.token;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Radio.Group
        id={id}
        value={selectedToken}
        onChange={(event) => onChange(String(event.target.value))}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
      >
        <Space direction="vertical" size="small">
          {entries.map((entry) => (
            <Radio
              key={entry.token}
              value={entry.token}
              disabled={disabled || entry.disabled === true}
            >
              {entry.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      {isLoading && <LoadingSpinner />}
      {customOptionForm}
    </div>
  );
}
