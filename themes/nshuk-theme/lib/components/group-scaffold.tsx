import type { GroupScaffoldProps } from "@aidbox-forms/theme";
import classNames from "classnames";

export function GroupScaffold({
  linkId,
  header,
  children,
  dataControl,
}: GroupScaffoldProps) {
  return (
    <fieldset
      className={classNames(
        "nhsuk-fieldset",
        "nhsuk-u-margin-bottom-4",
        dataControl === "page" && "nhsuk-u-padding-4",
      )}
      data-linkid={linkId}
      data-item-control={dataControl ?? undefined}
      data-control={dataControl ?? undefined}
      style={{
        border: dataControl ? "2px solid #d8dde0" : "1px solid #d8dde0",
        borderRadius: "4px",
      }}
    >
      {header ? <div className="nhsuk-u-margin-bottom-2">{header}</div> : null}
      <div className="nhsuk-fieldset__content nhsuk-u-margin-top-2">
        {children}
      </div>
    </fieldset>
  );
}
