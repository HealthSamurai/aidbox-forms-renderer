import type { FlyoverProperties } from "@aidbox-forms/theme";
import { InlineText } from "./utilities.tsx";

export function Flyover({ children }: FlyoverProperties) {
  return <InlineText dim>{children}</InlineText>;
}
