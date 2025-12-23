import type { GroupWrapperScaffoldProps } from "@aidbox-forms/theme";
import classNames from "classnames";

export function GroupWrapperScaffold({
  linkId,
  header,
  items,
  toolbar,
}: GroupWrapperScaffoldProps) {
  return (
    <fieldset
      className={classNames(
        "nhsuk-fieldset",
        "nhsuk-u-margin-bottom-5",
        "nhsuk-u-padding-4",
      )}
      data-linkid={linkId}
      style={{
        border: "1px solid #d8dde0",
        borderRadius: "4px",
      }}
    >
      {header ? <div className="nhsuk-u-margin-bottom-2">{header}</div> : null}
      <div className="nhsuk-fieldset__content nhsuk-u-margin-top-2">
        {items}
      </div>
      {toolbar ? (
        <div className="nhsuk-button-group nhsuk-u-margin-top-3">{toolbar}</div>
      ) : null}
    </fieldset>
  );
}
