import { useId } from "react";
import "./radio-group.css";

export interface RadioOption {
  label: string;
  value: boolean;
}

export function RadioGroup({
  name,
  value,
  options,
  onChange,
  disabled,
  ariaLabelledBy,
  ariaDescribedBy,
}: {
  name?: string | undefined;
  value: boolean | null;
  options: RadioOption[];
  onChange: (next: boolean) => void;
  disabled?: boolean | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
}) {
  const fallbackName = useId();
  const groupName = name ?? fallbackName;

  return (
    <div
      className="af-radio-group"
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      {options.map((option, index) => {
        const optionId = `${groupName}-${index}`;
        return (
          <label key={optionId} className="af-radio-option" htmlFor={optionId}>
            <input
              id={optionId}
              type="radio"
              name={groupName}
              value={String(option.value)}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={disabled}
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
