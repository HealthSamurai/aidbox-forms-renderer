import { observer } from "mobx-react-lite";
import type { OperationOutcomeIssue } from "fhir/r5";
import { getIssueMessage } from "../../utils.ts";
import { useTheme } from "../../ui/theme.tsx";

export const FormErrors = observer(function FormErrors({
  issues,
}: {
  issues: OperationOutcomeIssue[];
}) {
  const { FormErrors: ThemedFormErrors } = useTheme();
  const messages = issues
    .map((issue) => getIssueMessage(issue))
    .filter((message): message is string => Boolean(message));

  return <ThemedFormErrors messages={messages} />;
});
