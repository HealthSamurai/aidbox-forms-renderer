import { observer } from "mobx-react-lite";
import { INode } from "../../types.ts";
import { getIssueMessage, getNodeErrorId } from "../../utilities.ts";
import { useTheme } from "../../ui/theme.tsx";

export const NodeErrors = observer(function NodeErrors({
  node,
}: {
  node: INode;
}) {
  const { Errors: ThemedErrors } = useTheme();
  const id = getNodeErrorId(node);
  if (!id) return;

  const messages = node.issues
    .map((issue) => getIssueMessage(issue))
    .filter((message): message is string => message !== undefined);

  if (messages.length === 0) return;

  return <ThemedErrors id={id} messages={messages} />;
});
