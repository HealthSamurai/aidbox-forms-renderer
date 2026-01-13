import type { GroupListProperties } from "@aidbox-forms/theme";
import { Children } from "react";
import { interpose } from "../utilities.ts";

export function GroupList({
  linkId,
  header,
  children,
  onAdd,
  canAdd,
  addLabel,
}: GroupListProperties) {
  const addText = addLabel ?? "Add";
  return (
    <div data-linkid={linkId}>
      {header}
      {interpose(
        Children.toArray(children),
        <hr className="nhsuk-section-break--m nhsuk-section-break--visible" />,
      )}
      {onAdd && (
        <div className="nhsuk-button-group nhsuk-u-margin-top-4">
          <button
            type="button"
            onClick={onAdd}
            disabled={canAdd === false}
            className="nhsuk-button nhsuk-button--secondary nhsuk-button--small"
          >
            {addText}
          </button>
        </div>
      )}
    </div>
  );
}
