import type { AnswerRowProps } from "@aidbox-forms/theme";

export function AnswerRow({ control, toolbar, children }: AnswerRowProps) {
  return (
    <div className="nhsuk-form-group">
      <div>{control}</div>
      {toolbar ? (
        <div className="nhsuk-button-group" style={{ marginTop: "0.25rem" }}>
          {toolbar}
        </div>
      ) : null}
      {children ? <div style={{ marginLeft: "0.5rem" }}>{children}</div> : null}
    </div>
  );
}
