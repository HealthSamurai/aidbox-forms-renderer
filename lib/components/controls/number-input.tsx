import { useId } from "react";
import "./number-input.css";

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
}: {
  id?: string | undefined;
  value: number | null;
  onChange: (v: number | null) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  step?: number | "any";
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  unitLabel?: string | undefined;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const unitId = unitLabel ? `${inputId}-unit` : undefined;
  const describedByValues = [ariaDescribedBy, unitId].filter(
    Boolean,
  ) as string[];
  const describedBy =
    describedByValues.length > 0 ? describedByValues.join(" ") : undefined;

  const input = (
    <input
      id={inputId}
      className="af-input af-number-input-field"
      type="number"
      value={value ?? ""}
      onChange={(e) => {
        const t = e.target.value;
        onChange(t === "" ? null : Number(t));
      }}
      disabled={disabled}
      placeholder={placeholder}
      step={step}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={describedBy}
    />
  );

  const frameClasses = ["af-number-input-frame"];
  if (!unitLabel) {
    frameClasses.push("af-number-input-frame--solo");
  }

  return (
    <div className="af-number-input" data-has-unit={unitLabel ? "true" : "false"}>
      <div className={frameClasses.join(" ")}>
        {input}
        {unitLabel && (
          <span id={unitId} className="af-number-unit">
            {unitLabel}
          </span>
        )}
      </div>
    </div>
  );
}
