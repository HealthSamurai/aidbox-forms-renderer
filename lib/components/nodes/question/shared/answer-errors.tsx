import { observer } from "mobx-react-lite";
import { getAnswerErrorId } from "../../../../utils.ts";
import type { IAnswerInstance } from "../../../../types.ts";

export const AnswerErrors = observer(function AnswerErrors({
  answer,
}: {
  answer: IAnswerInstance;
}) {
  if (answer.issues.length === 0) {
    return null;
  }

  return (
    <div className="af-answer-errors" id={getAnswerErrorId(answer)}>
      {answer.issues.map((issue, index) => (
        <div key={index}>{issue.details?.text ?? issue.diagnostics}</div>
      ))}
    </div>
  );
});
