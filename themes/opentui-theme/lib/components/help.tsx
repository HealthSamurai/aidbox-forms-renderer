import type { HelpProperties } from "@aidbox-forms/theme";
import { InlineText } from "./utilities.tsx";

export function Help({ children }: HelpProperties) {
  return <InlineText dim>{children}</InlineText>;
}
