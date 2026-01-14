import type { LinkProperties } from "@aidbox-forms/theme";
import { toPlainText } from "./utilities.tsx";

export function Link({ href, children }: LinkProperties) {
  const label = toPlainText(children);

  return (
    <text>
      <u>{label}</u> <span fg="#666666">({href})</span>
    </text>
  );
}
