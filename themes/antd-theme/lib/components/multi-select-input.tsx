import type { MultiSelectInputProperties } from "@aidbox-forms/theme";
import { Select } from "antd";
import type { ReactNode } from "react";

export function MultiSelectInput({
  options,
  selectedOptions,
  onSelect,
  onDeselect,
  onSearch,
  specifyOtherOption,
  customOptionForm,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled = false,
  isLoading = false,
  placeholder,
}: MultiSelectInputProperties) {
  const entries = specifyOtherOption
    ? [...options, specifyOtherOption]
    : options;
  const selectedTokens = selectedOptions.map((entry) => entry.token);

  const mappedOptions = entries.map((option) => ({
    label: option.label as ReactNode,
    value: option.token,
    disabled: option.disabled,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Select
        id={id}
        mode="multiple"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        value={selectedTokens}
        options={mappedOptions}
        onSelect={(token) => onSelect(String(token))}
        onDeselect={(token) => onDeselect(String(token))}
        onSearch={onSearch}
        showSearch={Boolean(onSearch)}
        filterOption={onSearch ? false : undefined}
        disabled={disabled}
        loading={isLoading}
        placeholder={placeholder}
        style={{ width: "100%" }}
      />
      {customOptionForm}
    </div>
  );
}
