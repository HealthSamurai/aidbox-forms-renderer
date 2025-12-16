import type { AnswerListProps } from "@aidbox-forms/theme";

export function AnswerList({ answers, toolbar }: AnswerListProps) {
  return (
    <div className="nhsuk-form-group">
      <div>{answers}</div>
      {toolbar ? (
        <div className="nhsuk-button-group" style={{ marginTop: "0.5rem" }}>
          {toolbar}
        </div>
      ) : null}
    </div>
  );
}
