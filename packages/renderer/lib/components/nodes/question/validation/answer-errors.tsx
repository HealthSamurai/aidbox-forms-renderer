import { observer } from "mobx-react-lite";
import type { IAnswer } from "../../../../types.ts";
import { getAnswerErrorId, getIssueMessage } from "../../../../utilities.ts";
import { useTheme } from "../../../../ui/theme.tsx";

export const AnswerErrors = observer(function AnswerErrors({
  answer,
}: {
  answer: IAnswer;
}) {
  const { Errors: ThemedErrors } = useTheme();
  const id = getAnswerErrorId(answer);
  if (!id) return;

  const messages = answer.issues
    .map((issue) => getIssueMessage(issue))
    .filter((message): message is string => message !== undefined);

  if (messages.length === 0) return;

  return <ThemedErrors id={id} messages={messages} />;
});
