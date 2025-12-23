import { optionStatusClass } from "./option-status.ts";
import { inputClass } from "./tokens.ts";

type SelectFieldProps = {
  options: ReadonlyArray<{ key: string; label: string; disabled?: boolean }>;
  selectValue: string;
  legacyOption: { key: string; label: string } | null;
  onChange: (value: string) => void;
  inputId: string;
  labelId: string;
  describedById: string | undefined;
  readOnly: boolean;
  isLoading?: boolean;
};

export function SelectField({
  options,
  selectValue,
  legacyOption,
  onChange,
  inputId,
  labelId,
  describedById,
  readOnly,
  isLoading = false,
}: SelectFieldProps) {
  return (
    <div data-loading={isLoading ? "true" : undefined}>
      <select
        id={inputId}
        className={inputClass}
        value={selectValue}
        onChange={(event) => onChange(event.target.value)}
        disabled={readOnly}
        aria-labelledby={labelId}
        aria-describedby={describedById}
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
      {isLoading ? (
        <div className={optionStatusClass} role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}
