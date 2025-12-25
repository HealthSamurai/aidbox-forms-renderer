import type { AnswerListProps } from "@aidbox-forms/theme";

export function AnswerList({ children, toolbar }: AnswerListProps) {
  return (
    <div className="nhsuk-form-group">
      <div>{children}</div>
      {toolbar ? (
        <div className="nhsuk-button-group" style={{ marginTop: "0.5rem" }}>
          {toolbar}
        </div>
      ) : null}
    </div>
  );
}
