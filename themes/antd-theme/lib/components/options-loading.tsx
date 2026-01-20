import type { OptionsLoadingProperties } from "@formbox/theme";
import { LoadingSpinner } from "./loading-spinner.tsx";

export function OptionsLoading({ isLoading }: OptionsLoadingProperties) {
  return isLoading ? <LoadingSpinner /> : undefined;
}
