import type { LegalProperties } from "@aidbox-forms/theme";
import { InlineText } from "./utilities.tsx";

export function Legal({ children }: LegalProperties) {
  return <InlineText dim>{children}</InlineText>;
}
