import type { GroupWrapperScaffoldItemProps } from "@aidbox-forms/theme";

export function GroupWrapperScaffoldItem({
  children,
  errors,
  toolbar,
}: GroupWrapperScaffoldItemProps) {
  return (
    <div
      className="nhsuk-form-group"
      style={{
        borderTop: "1px solid #d8dde0",
        paddingTop: "1rem",
        marginTop: "1rem",
      }}
    >
      <div className="nhsuk-form-group__control">{children}</div>
      {errors}
      {toolbar ? (
        <div className="nhsuk-button-group nhsuk-u-margin-top-2">{toolbar}</div>
      ) : null}
    </div>
  );
}
