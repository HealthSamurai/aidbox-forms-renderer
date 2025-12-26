import { styled } from "@linaria/react";
import type { SelectInputProps } from "@aidbox-forms/theme";
import { optionStatusClass } from "./option-status.ts";
import { inputClass } from "./tokens.ts";

export function SelectInput({
  options,
  token,
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
          value={token}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-busy={isLoading || undefined}
        >
          <option value="">Select an option</option>
          {legacyOption ? (
            <option
              key={legacyOption.token}
              value={legacyOption.token}
              disabled
            >
              {legacyOption.label}
            </option>
          ) : null}
          {options.map((entry) => (
            <option
              key={entry.token}
              value={entry.token}
              disabled={entry.disabled}
            >
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
