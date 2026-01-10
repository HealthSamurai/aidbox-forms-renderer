import { observer } from "mobx-react-lite";
import type { OperationOutcomeIssue } from "fhir/r5";
import { getIssueMessage } from "../../utilities.ts";
import { useTheme } from "../../ui/theme.tsx";

export const FormErrors = observer(function FormErrors({
  issues,
}: {
  issues: OperationOutcomeIssue[];
}) {
  const { FormErrors: ThemedFormErrors } = useTheme();
  const messages = issues
    .map((issue) => getIssueMessage(issue))
    .filter((message): message is string => message !== undefined);

  return <ThemedFormErrors messages={messages} />;
});
