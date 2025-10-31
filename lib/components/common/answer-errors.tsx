import './answer-errors.css';
import { IAnswerInstance, AnswerValueType, AnswerType } from "lib/stores/types";
import { observer } from "mobx-react-lite";

interface AnswerErrorsProps {
  answer: IAnswerInstance<AnswerValueType<AnswerType>>;
}

export const AnswerErrors = observer(function AnswerErrors({
  answer,
}: AnswerErrorsProps) {


  const messages = answer.issues
    .map((issue) => issue.diagnostics?.trim() || issue.details?.text?.trim())
    .filter((message): message is string => Boolean(message));

  if (messages.length === 0) {
    return null;
  }

  return (
    <ul className="af-answer-errors" role="alert">
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );
});
