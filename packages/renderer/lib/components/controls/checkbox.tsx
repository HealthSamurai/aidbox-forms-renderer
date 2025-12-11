export function Checkbox({
  id,
  checked,
  onChange,
  disabled,
  label,
  ariaLabelledBy,
  ariaDescribedBy,
}: {
  id?: string | undefined;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean | undefined;
  label?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
}) {
  return (
    <label className="af-checkbox" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      />
      {label ? <span>{label}</span> : null}
    </label>
  );
}
