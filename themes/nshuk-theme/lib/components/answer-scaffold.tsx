import type { AnswerScaffoldProps } from "@aidbox-forms/theme";

export function AnswerScaffold({
  control,
  toolbar,
  children,
}: AnswerScaffoldProps) {
  return (
    <div className="nhsuk-form-group">
      {control}
      {toolbar ? (
        <div className="nhsuk-button-group" style={{ marginTop: "0.25rem" }}>
          {toolbar}
        </div>
      ) : null}
      {children ? <div style={{ marginLeft: "0.5rem" }}>{children}</div> : null}
    </div>
  );
}
