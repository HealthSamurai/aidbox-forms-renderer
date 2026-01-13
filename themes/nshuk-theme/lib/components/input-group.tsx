import { Children } from "react";
import type { InputGroupProperties } from "@aidbox-forms/theme";

export function InputGroup({ children }: InputGroupProperties) {
  const items = Children.toArray(children);
  return <div className="nhsuk-input-wrapper nhsuk-u-width-full">{items}</div>;
}
