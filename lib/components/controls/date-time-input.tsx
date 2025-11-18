import "./text-input.css";
import { TextInput } from "./text-input.tsx";
import { ComponentProps } from "react";

export function DateTimeInput(
  props: Omit<ComponentProps<typeof TextInput>, "onChange"> & {
    onChange: (v: string) => void;
  },
) {
  return (
    <input
      id={props.id}
      className="af-input"
      type="datetime-local"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      disabled={props.disabled}
      placeholder={props.placeholder}
      aria-labelledby={props.ariaLabelledBy}
      aria-describedby={props.ariaDescribedBy}
    />
  );
}
