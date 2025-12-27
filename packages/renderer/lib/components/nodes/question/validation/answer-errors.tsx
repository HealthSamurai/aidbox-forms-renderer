import { observer } from "mobx-react-lite";
import type { IAnswerInstance } from "../../../../types.ts";
import { getAnswerErrorId, getIssueMessage } from "../../../../utils.ts";
import { useTheme } from "../../../../ui/theme.tsx";

export const AnswerErrors = observer(function AnswerErrors({
  answer,
}: {
  answer: IAnswerInstance;
}) {
  const { Errors: ThemedErrors } = useTheme();

  if (answer.issues.length === 0) {
    return null;
  }

  const messages = answer.issues
    .map((issue) => getIssueMessage(issue))
    .filter((message): message is string => Boolean(message));

  if (messages.length === 0) {
    return null;
  }

  return <ThemedErrors id={getAnswerErrorId(answer)} messages={messages} />;
});
