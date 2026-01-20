import type { NumberInputProperties } from "@formbox/theme";
import { hasErrorId } from "../utils/aria.ts";

export function NumberInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  step,
  min,
  max,
  ariaLabelledBy,
  ariaDescribedBy,
  unitLabel,
}: NumberInputProperties) {
  const described = [ariaDescribedBy].filter(Boolean).join(" ").trim();
  const describedBy = described.length > 0 ? described : undefined;
  const className = hasErrorId(describedBy)
    ? "nhsuk-input nhsuk-input--error"
    : "nhsuk-input";

  if (unitLabel) {
    const unitId = id ? `${id}-unit` : undefined;

    return (
      <div className="nhsuk-input-wrapper nhsuk-u-width-full">
        <input
          id={id}
          className={className}
          type="number"
          value={value ?? ""}
          onChange={(event) => {
            const raw = event.target.value;
            onChange(raw === "" ? undefined : Number(raw));
          }}
          disabled={disabled}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={
            [describedBy, unitId].filter(Boolean).join(" ") || undefined
          }
        />
        <span className="nhsuk-input__suffix" id={unitId}>
          {unitLabel}
        </span>
      </div>
    );
  }

  return (
    <input
      id={id}
      className={className}
      type="number"
      value={value ?? ""}
      onChange={(event) => {
        const raw = event.target.value;
        onChange(raw === "" ? undefined : Number(raw));
      }}
      disabled={disabled}
      placeholder={placeholder}
      step={step}
      min={min}
      max={max}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={describedBy}
    />
  );
}
