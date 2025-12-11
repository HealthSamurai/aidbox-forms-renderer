import "./text-input.css";
import { ComponentProps } from "react";
import { TextInput } from "./text-input.tsx";

export function DateInput(
  props: Omit<ComponentProps<typeof TextInput>, "onChange"> & {
    onChange: (v: string) => void;
  },
) {
  return (
    <input
      id={props.id}
      className="af-input"
      type="date"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      disabled={props.disabled}
      placeholder={props.placeholder}
      aria-labelledby={props.ariaLabelledBy}
      aria-describedby={props.ariaDescribedBy}
    />
  );
}
