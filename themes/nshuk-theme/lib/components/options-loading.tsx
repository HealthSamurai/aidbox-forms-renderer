import type { OptionsLoadingProps } from "@aidbox-forms/theme";

export function OptionsLoading({ isLoading }: OptionsLoadingProps) {
  if (isLoading) {
    return (
      <div className="nhsuk-hint" role="status">
        Loading options…
      </div>
    );
  }
  return null;
}
