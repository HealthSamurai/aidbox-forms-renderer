import { observer } from "mobx-react-lite";
import type { IAnswerInstance } from "../../stores/types.ts";
import { getAnswerErrorId } from "../../utils.ts";

type AnswerErrorsProps = {
  answer: IAnswerInstance<unknown>;
};

export const AnswerErrors = observer(function AnswerErrors({
  answer,
}: AnswerErrorsProps) {
  if (answer.issues.length === 0) {
    return null;
  }

  const messages = answer.issues
    .map((issue) => issue.diagnostics?.trim() || issue.details?.text?.trim())
    .filter((message): message is string => Boolean(message));

  if (messages.length === 0) {
    return null;
  }

  return (
    <ul id={getAnswerErrorId(answer)} className="af-answer-errors" role="alert">
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );
});
