import type { OptionsLoadingProperties } from "@aidbox-forms/theme";
import { InlineText } from "./utilities.tsx";

export function OptionsLoading({ isLoading }: OptionsLoadingProperties) {
  return isLoading ? <InlineText dim>Loading options…</InlineText> : undefined;
}
