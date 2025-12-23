import type { GroupBodyProps } from "@aidbox-forms/theme";
import classNames from "classnames";

export function GroupBody({
  linkId,
  legend,
  children,
  dataControl,
}: GroupBodyProps) {
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
      {legend ? (
        <legend className="nhsuk-fieldset__legend nhsuk-fieldset__legend--m">
          {legend}
        </legend>
      ) : null}
      <div className="nhsuk-fieldset__content nhsuk-u-margin-top-2">
        {children}
      </div>
    </fieldset>
  );
}
