import { styled } from "@linaria/react";
import type { GroupScaffoldProperties } from "@aidbox-forms/theme";

export function GroupScaffold({
  header,
  children,
  errors,
  onRemove,
  canRemove,
  removeLabel,
}: GroupScaffoldProperties) {
  return (
    <div className="nhsuk-form-group">
      {header}
      {children}
      {errors}
      {onRemove && (
        <div className="nhsuk-button-group">
          <button
            type="button"
            onClick={onRemove}
            disabled={canRemove === false}
            className="nhsuk-button nhsuk-button--secondary nhsuk-button--small"
          >
            {removeLabel ?? "Remove"}
          </button>
        </div>
      )}
    </div>
  );
}
