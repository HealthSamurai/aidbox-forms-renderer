import type { OptionsLoadingProperties } from "@aidbox-forms/theme";
import { LoadingSpinner } from "./loading-spinner.tsx";

export function OptionsLoading({ isLoading }: OptionsLoadingProperties) {
  return isLoading ? <LoadingSpinner /> : undefined;
}
