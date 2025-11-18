import "./node-errors.css";
import { observer } from "mobx-react-lite";
import { INode } from "../../types.ts";
import { getNodeErrorId } from "../../utils.ts";

export const NodeErrors = observer(function NodeErrors({
  node,
}: {
  node: INode;
}) {
  if (!node.hasErrors) return null;

  const messages = node.issues
    .map((issue) => issue.diagnostics?.trim() || issue.details?.text?.trim())
    .filter((message): message is string => Boolean(message));

  if (messages.length === 0) {
    return null;
  }

  return (
    <ul id={getNodeErrorId(node)} className="af-node-errors" role="alert">
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );
});
