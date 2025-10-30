import "./item-errors.css";
import { observer } from "mobx-react-lite";
import {
  IDisplayNode,
  INonRepeatingGroupNode,
  IQuestionNode,
  IRepeatingGroupNode,
} from "../../stores/types.ts";
import { getItemErrorId } from "../../utils.ts";

interface ItemErrorsProps {
  item:
    | IQuestionNode
    | IRepeatingGroupNode
    | INonRepeatingGroupNode
    | IDisplayNode;
}

export const ItemErrors = observer(function ItemErrors({
  item,
}: ItemErrorsProps) {
  if (!item.hasErrors) return null;

  const messages = item.issues
    .map((issue) => issue.diagnostics?.trim() || issue.details?.text?.trim())
    .filter((message): message is string => Boolean(message));

  if (messages.length === 0) {
    return null;
  }

  return (
    <ul id={getItemErrorId(item)} className="af-item-errors" role="alert">
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );
});
