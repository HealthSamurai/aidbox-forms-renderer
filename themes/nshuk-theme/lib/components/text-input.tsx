import type { HTMLAttributes } from "react";

export type TextInputProps = {
  id?: string | undefined;
  type?: string | undefined;
  value: string;
  list?: string | undefined;
  onChange: (v: string) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  inputMode?: HTMLAttributes<Element>["inputMode"] | undefined;
  prefix?: string | undefined;
  suffix?: string | undefined;
  withFormGroup?: boolean | undefined;
};

export function TextInput({
  id,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
  inputMode,
  list,
  prefix,
  suffix,
  withFormGroup = true,
}: TextInputProps) {
  const describedBy =
    ariaDescribedBy && ariaDescribedBy.trim().length > 0
      ? ariaDescribedBy
      : undefined;

  const input = (
    <input
      id={id}
      list={list}
      className="nhsuk-input"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={describedBy}
      inputMode={inputMode}
    />
  );

  const wrappedInput =
    prefix || suffix ? (
      <div className="nhsuk-input__wrapper">
        {prefix ? (
          <div className="nhsuk-input__prefix" aria-hidden="true">
            {prefix}
          </div>
        ) : null}
        {input}
        {suffix ? (
          <div className="nhsuk-input__suffix" aria-hidden="true">
            {suffix}
          </div>
        ) : null}
      </div>
    ) : (
      input
    );

  if (!withFormGroup) {
    return wrappedInput;
  }

  return <div className="nhsuk-form-group">{wrappedInput}</div>;
}
