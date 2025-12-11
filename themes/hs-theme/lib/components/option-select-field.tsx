import "./option-status.css";
import "./text-input.css";

type OptionSelectFieldProps = {
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

export function OptionSelectField({
  options,
  selectValue,
  legacyOption,
  onChange,
  inputId,
  labelId,
  describedById,
  readOnly,
  isLoading = false,
}: OptionSelectFieldProps) {
  return (
    <div
      className="af-option-select"
      data-loading={isLoading ? "true" : undefined}
    >
      <select
        id={inputId}
        className="af-input"
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
        <div className="af-option-status" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </div>
  );
}
