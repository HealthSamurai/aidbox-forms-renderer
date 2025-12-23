import { observer } from "mobx-react-lite";
import { INode } from "../../types.ts";
import { getNodeErrorId } from "../../utils.ts";
import { useTheme } from "../../ui/theme.tsx";

export const NodeErrors = observer(function NodeErrors({
  node,
}: {
  node: INode;
}) {
  const { Errors: ThemedErrors } = useTheme();

  if (!node.hasErrors) return null;

  const messages = node.issues
    .map((issue) => issue.diagnostics?.trim() || issue.details?.text?.trim())
    .filter((message): message is string => Boolean(message));

  if (messages.length === 0) {
    return null;
  }

  return <ThemedErrors id={getNodeErrorId(node)} messages={messages} />;
});
