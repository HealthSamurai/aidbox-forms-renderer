import type { PageNavigationProps } from "@aidbox-forms/theme";

export function PageNavigation({
  onPrev,
  onNext,
  disablePrev,
  disableNext,
  current,
  total,
}: PageNavigationProps) {
  return (
    <div className="nhsuk-button-group">
      <button
        className="nhsuk-button nhsuk-button--secondary"
        type="button"
        onClick={onPrev}
        disabled={disablePrev}
      >
        Previous
      </button>
      <span className="nhsuk-hint">
        {current} / {total}
      </span>
      <button
        className="nhsuk-button nhsuk-button--secondary"
        type="button"
        onClick={onNext}
        disabled={disableNext}
      >
        Next
      </button>
    </div>
  );
}
