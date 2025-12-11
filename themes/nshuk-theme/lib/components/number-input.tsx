import "./number-input.css";
import type { NumberInputProps } from "@aidbox-forms/theme";

export function NumberInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  step,
  ariaLabelledBy,
  ariaDescribedBy,
  unitLabel,
  list,
}: NumberInputProps) {
  const described = [ariaDescribedBy].filter(Boolean).join(" ").trim();
  const describedBy = described.length > 0 ? described : undefined;

  const input = (
    <input
      id={id}
      list={list}
      className="nhsuk-input"
      type="number"
      value={value ?? ""}
      onChange={(event) => {
        const raw = event.target.value;
        onChange(raw === "" ? null : Number(raw));
      }}
      disabled={disabled}
      placeholder={placeholder}
      step={step}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={
        [describedBy, unitLabel ? `${id}-unit` : undefined]
          .filter(Boolean)
          .join(" ") || undefined
      }
    />
  );

  if (!unitLabel) {
    return input;
  }

  return (
    <div className="nhsuk-number-with-unit">
      {input}
      <span
        id={id ? `${id}-unit` : undefined}
        className="nhsuk-unit"
        aria-hidden="true"
      >
        {unitLabel}
      </span>
    </div>
  );
}
