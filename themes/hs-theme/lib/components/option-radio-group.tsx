import { styled } from "@linaria/react";
import { optionStatusClass } from "./option-status.ts";

export type OptionRadioGroupProps = {
  options: ReadonlyArray<{ key: string; label: string; disabled?: boolean }>;
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
      <RadioGroup
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedById}
        aria-busy={isLoading || undefined}
      >
        {legacyOptionLabel && legacyOptionKey ? (
          <RadioOption>
            <input
              type="radio"
              name={inputId}
              value={legacyOptionKey}
              checked={selectValue === legacyOptionKey}
              disabled
              readOnly
            />
            {legacyOptionLabel}
          </RadioOption>
        ) : null}
        {options.map((entry) => (
          <RadioOption key={entry.key}>
            <input
              type="radio"
              name={inputId}
              value={entry.key}
              checked={selectValue === entry.key}
              disabled={readOnly || entry.disabled}
              onChange={(event) => onChange(event.target.value)}
            />
            {entry.label}
          </RadioOption>
        ))}
      </RadioGroup>
      {isLoading ? (
        <div className={optionStatusClass} role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
    </>
  );
}

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const RadioOption = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;
