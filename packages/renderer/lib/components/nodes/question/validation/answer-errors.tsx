import { observer } from "mobx-react-lite";
import type { IAnswerInstance } from "../../../../types.ts";
import { getAnswerErrorId } from "../../../../utils.ts";
import { useTheme } from "../../../../ui/theme.tsx";

export const AnswerErrors = observer(function AnswerErrors({
  answer,
}: {
  answer: IAnswerInstance;
}) {
  const { NodeErrors } = useTheme();

  if (answer.issues.length === 0) {
    return null;
  }

  const messages = answer.issues
    .map((issue) => issue.details?.text ?? issue.diagnostics)
    .filter((message): message is string => Boolean(message));

  if (messages.length === 0) {
    return null;
  }

  return <NodeErrors id={getAnswerErrorId(answer)} messages={messages} />;
});
