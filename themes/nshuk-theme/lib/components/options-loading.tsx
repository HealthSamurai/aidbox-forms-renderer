import type { OptionsLoadingProperties } from "@aidbox-forms/theme";

export function OptionsLoading({ isLoading }: OptionsLoadingProperties) {
  if (isLoading) {
    return (
      <div className="nhsuk-hint" role="status">
        Loading options…
      </div>
    );
  }
  return;
}
