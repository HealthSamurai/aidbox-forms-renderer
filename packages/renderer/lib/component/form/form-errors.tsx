import { observer } from "mobx-react-lite";
import type { OperationOutcomeIssue } from "fhir/r5";
import { buildId, getIssueMessage } from "../../utilities.ts";
import { useTheme } from "../../ui/theme.tsx";

export const FormErrors = observer(function FormErrors({
  issues,
}: {
  issues: OperationOutcomeIssue[];
}) {
  const { Errors: ThemedErrors } = useTheme();
  const messages = issues
    .map((issue) => getIssueMessage(issue))
    .filter((message): message is string => message !== undefined);

  return <ThemedErrors id={buildId("form", "errors")} messages={messages} />;
});
