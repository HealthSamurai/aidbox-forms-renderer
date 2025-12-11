import "./text-input.css";
import type { HTMLAttributes } from "react";

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
}: {
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
}) {
  return (
    <input
      id={id}
      list={list}
      className="af-input"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      inputMode={inputMode}
    />
  );
}
