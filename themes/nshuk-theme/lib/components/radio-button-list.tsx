import { styled } from "@linaria/react";
import type { RadioButtonListProperties } from "@formbox/theme";
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
  disabled,
  isLoading,
}: RadioButtonListProperties) {
  const selectedToken = selectedOption?.token ?? "";
  const makeInputId = (token: string) => `${id}-${token}`;

  const renderOption = (entry: (typeof options)[number]) => {
    const optionId = makeInputId(entry.token);
    return (
      <div key={entry.token} className="nhsuk-radios__item">
        <input
          className="nhsuk-radios__input"
          type="radio"
          name={id}
          id={optionId}
          value={entry.token}
          checked={selectedToken === entry.token}
          disabled={disabled || isLoading || entry.disabled}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={ariaDescribedBy}
        />
        <Label className="nhsuk-label nhsuk-radios__label" htmlFor={optionId}>
          {entry.label}
        </Label>
      </div>
    );
  };

  return (
    <div
      id={id}
      className="nhsuk-radios nhsuk-radios--small nhsuk-u-width-full"
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading || undefined}
    >
      {options.map((option) => renderOption(option))}
      {specifyOtherOption && (
        <>
          {options.length > 0 && (
            <div className="nhsuk-radios__divider">or</div>
          )}
          {renderOption(specifyOtherOption)}
        </>
      )}
      {isLoading && <LoadingSpinner showLabel />}
      {customOptionForm && (
        <div className="nhsuk-u-padding-top-2">{customOptionForm}</div>
      )}
    </div>
  );
}

const Label = styled.label`
  padding-right: 0;

  & > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
