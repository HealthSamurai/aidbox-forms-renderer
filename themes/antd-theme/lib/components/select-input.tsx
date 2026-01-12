import type { SelectInputProperties } from "@aidbox-forms/theme";
import { Select } from "antd";
import type { ReactNode } from "react";

export function SelectInput({
  options,
  selectedOption,
  onChange,
  onSearch,
  specifyOtherOption,
  customOptionForm,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled = false,
  isLoading = false,
  placeholder,
}: SelectInputProperties) {
  const entries = specifyOtherOption
    ? [...options, specifyOtherOption]
    : options;
  const selectedToken = selectedOption?.token;
  const allowClear = !disabled && !isLoading;

  const mappedOptions = entries.map((option) => ({
    label: option.label as ReactNode,
    value: option.token,
    disabled: option.disabled,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Select
        id={id}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        value={selectedToken}
        options={mappedOptions}
        onChange={(nextValue) => {
          if (nextValue == null || nextValue === "") {
            onChange();
            return;
          }
          onChange(String(nextValue));
        }}
        onSearch={onSearch}
        showSearch={Boolean(onSearch)}
        filterOption={onSearch ? false : undefined}
        allowClear={allowClear}
        disabled={disabled}
        loading={isLoading}
        placeholder={placeholder}
        style={{ width: "100%" }}
      />
      {customOptionForm}
    </div>
  );
}
