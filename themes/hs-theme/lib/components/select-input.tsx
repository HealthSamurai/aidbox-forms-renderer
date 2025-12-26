import { styled } from "@linaria/react";
import type { OptionItem } from "@aidbox-forms/theme";
import { optionStatusClass } from "./option-status.ts";
import { inputClass } from "./tokens.ts";

type SelectInputProps = {
  options: readonly OptionItem[];
  value: string;
  legacyOption: { key: string; label: string } | null;
  onChange: (value: string) => void;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled: boolean;
  isLoading?: boolean;
  onClear?: (() => void) | undefined;
  clearLabel?: string | undefined;
};

export function SelectInput({
  options,
  value,
  legacyOption,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  isLoading = false,
  onClear,
  clearLabel,
}: SelectInputProps) {
  return (
    <div data-loading={isLoading ? "true" : undefined}>
      <FieldRow>
        <select
          id={id}
          className={inputClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-busy={isLoading || undefined}
        >
          <option value="">Select an option</option>
          {legacyOption ? (
            <option key={legacyOption.key} value={legacyOption.key} disabled>
              {legacyOption.label}
            </option>
          ) : null}
          {options.map((entry) => (
            <option key={entry.key} value={entry.key} disabled={entry.disabled}>
              {entry.label}
            </option>
          ))}
        </select>
        {onClear ? (
          <ClearButton type="button" onClick={onClear} disabled={disabled}>
            {clearLabel ?? "Clear"}
          </ClearButton>
        ) : null}
      </FieldRow>
      {isLoading ? (
        <div className={optionStatusClass} role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}

const FieldRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ClearButton = styled.button`
  border: none;
  background: #edf2f7;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
