import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { NodeErrors } from "../../../form/node-errors.tsx";
import { NodesList } from "../../../form/node-list.tsx";
import { AnswerErrors } from "../../question/validation/answer-errors.tsx";
import { useTheme } from "../../../../ui/theme.tsx";

export const TableQuestionDetails = observer(function TableQuestionDetails({
  question,
}: {
  question: IQuestionNode;
}) {
  const { NodeList, OptionsState } = useTheme();
  const showStatus =
    question.options.loading || Boolean(question.options.error);
  const answers = question.repeats
    ? question.answers
    : question.answers.slice(0, 1);
  const hasAnswerChildren = answers.some((answer) => answer.nodes.length > 0);
  const hasAnswerIssues = answers.some((answer) => answer.issues.length > 0);

  if (
    !showStatus &&
    !question.hasErrors &&
    !hasAnswerChildren &&
    !hasAnswerIssues
  ) {
    return null;
  }

  const details = [
    showStatus ? (
      <OptionsState
        key={`${question.token}-status`}
        isLoading={question.options.loading}
        error={question.options.error ?? undefined}
      />
    ) : null,
    <NodeErrors key={`${question.token}-errors`} node={question} />,
    ...answers
      .filter((answer) => answer.nodes.length > 0)
      .map((answer) => (
        <NodesList key={`${answer.token}-children`} nodes={answer.nodes} />
      )),
    ...answers
      .filter((answer) => answer.issues.length > 0)
      .map((answer) => (
        <AnswerErrors key={`${answer.token}-issues`} answer={answer} />
      )),
  ].filter(Boolean);

  if (details.length === 0) {
    return null;
  }

  return <NodeList>{details}</NodeList>;
});
