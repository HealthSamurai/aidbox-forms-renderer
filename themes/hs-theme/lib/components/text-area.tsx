import "./text-area.css";

export function TextArea({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
}: {
  id?: string | undefined;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
}) {
  return (
    <textarea
      id={id}
      className="af-textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
  );
}
