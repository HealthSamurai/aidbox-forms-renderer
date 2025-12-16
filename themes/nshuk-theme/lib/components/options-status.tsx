import type { OptionsStatusProps } from "@aidbox-forms/theme";

export function OptionsStatus({ loading, error }: OptionsStatusProps) {
  if (loading) {
    return (
      <div className="nhsuk-hint" role="status">
        Loading options…
      </div>
    );
  }
  if (error) {
    return (
      <div className="nhsuk-error-message" role="alert">
        Failed to load options: {error}
      </div>
    );
  }
  return null;
}
