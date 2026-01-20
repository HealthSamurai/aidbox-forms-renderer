import type { SpinnerInputProperties } from "@formbox/theme";
import { hasErrorId } from "../utils/aria.ts";

export function SpinnerInput({
  id,
  value,
  onChange,
  disabled,
  min,
  max,
  step,
  ariaLabelledBy,
  ariaDescribedBy,
  placeholder,
  unitLabel,
}: SpinnerInputProperties) {
  const unitId = unitLabel ? `${id}-unit` : undefined;
  const describedBy =
    [ariaDescribedBy, unitId].filter(Boolean).join(" ").trim() || undefined;

  return (
    <div className="nhsuk-input-wrapper nhsuk-u-width-full">
      <input
        id={id}
        className={
          hasErrorId(describedBy)
            ? `nhsuk-input nhsuk-input--error`
            : `nhsuk-input`
        }
        type="number"
        value={value ?? ""}
        onChange={(event) => {
          const raw = event.target.value;
          onChange(raw === "" ? undefined : Number(raw));
        }}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy}
      />
      {unitLabel ? (
        <span className="nhsuk-input__suffix" id={unitId}>
          {unitLabel}
        </span>
      ) : undefined}
    </div>
  );
}
