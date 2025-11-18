import "./option-status.css";
import type { AnswerOptionEntry, AnswerType } from "../../../../../../types.ts";

type OptionRadioGroupProps = {
  options: ReadonlyArray<AnswerOptionEntry<AnswerType>>;
  selectValue: string;
  onChange: (value: string) => void;
  legacyOptionLabel: string | undefined;
  legacyOptionKey: string | undefined;
  inputId: string;
  labelId: string;
  describedById: string | undefined;
  readOnly: boolean;
  isLoading?: boolean;
};

export function OptionRadioGroup({
  options,
  selectValue,
  onChange,
  legacyOptionLabel,
  legacyOptionKey,
  inputId,
  labelId,
  describedById,
  readOnly,
  isLoading = false,
}: OptionRadioGroupProps) {
  return (
    <>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedById}
        className="af-radio-group"
        aria-busy={isLoading || undefined}
      >
        {legacyOptionLabel && legacyOptionKey ? (
          <label className="af-radio-option">
            <input
              type="radio"
              name={inputId}
              value={legacyOptionKey}
              checked={selectValue === legacyOptionKey}
              disabled
              readOnly
            />
            {legacyOptionLabel}
          </label>
        ) : null}
        {options.map((entry) => (
          <label key={entry.key} className="af-radio-option">
            <input
              type="radio"
              name={inputId}
              value={entry.key}
              checked={selectValue === entry.key}
              disabled={readOnly || entry.disabled}
              onChange={(event) => onChange(event.target.value)}
            />
            {entry.label}
          </label>
        ))}
      </div>
      {isLoading ? (
        <div className="af-option-status" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </>
  );
}
