export function NumberInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  step,
  ariaLabelledBy,
  ariaDescribedBy,
}: {
  id?: string | undefined;
  value: number | null;
  onChange: (v: number | null) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  step?: number | "any";
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
}) {
  return (
    <input
      id={id}
      className="af-input"
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
      aria-describedby={ariaDescribedBy}
    />
  );
}
