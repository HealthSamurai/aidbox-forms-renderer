import type { PageStatusProps } from "@aidbox-forms/theme";

export function PageStatus({ current, total }: PageStatusProps) {
  return (
    <div className="nhsuk-hint" role="status" aria-live="polite">
      Page {current} of {total}
    </div>
  );
}
