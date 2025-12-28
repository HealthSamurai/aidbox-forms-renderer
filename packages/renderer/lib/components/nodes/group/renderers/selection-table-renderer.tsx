import { observer } from "mobx-react-lite";
import type {
  GroupControlProps,
  IQuestionNode,
  OptionAxisItem,
  QuestionAxisItem,
} from "../../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { NodeHeader } from "../../../form/node-header.tsx";
import { NodeErrors } from "../../../form/node-errors.tsx";
import { NodesList } from "../../../form/node-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { JSX, ReactNode } from "react";
import { ValueDisplay } from "../../question/fhir/value-display.tsx";
import { sanitizeForId } from "../../../../utils.ts";
import { SelectionTableCell } from "../components/selection-table-cell.tsx";
import { AnswerErrors } from "../../question/validation/answer-errors.tsx";
import { strings } from "../../../../strings.ts";

export const SelectionTableRenderer = observer(function SelectionTableRenderer({
  node,
}: GroupControlProps) {
  const {
    GridTable,
    EmptyState,
    RadioButton,
    Checkbox,
    OptionsLoading,
    NodeList,
  } = useTheme();
  const store = node.tableStore;
  const optionAxis = store.optionAxis;
  const questionAxis = store.questionAxis;
  const isHorizontal = node.control === "htable";

  let content: JSX.Element;
  if (store.questions.length === 0) {
    const message = isHorizontal
      ? strings.table.noChoiceQuestionsHorizontal
      : strings.table.noChoiceQuestions;
    content = <EmptyState>{message}</EmptyState>;
  } else if (optionAxis.length === 0) {
    const message = isHorizontal
      ? strings.table.noAnswerOptionsHorizontal
      : strings.table.noAnswerOptions;
    content = <EmptyState>{message}</EmptyState>;
  } else {
    const renderQuestionHeader = (entry: QuestionAxisItem) => {
      const question = entry.question;
      const extras: ReactNode[] = [];
      if (question.options.loading) {
        extras.push(
          <OptionsLoading key={`${question.token}-options`} isLoading />,
        );
      }
      if (question.hasErrors) {
        extras.push(
          <NodeErrors key={`${question.token}-errors`} node={question} />,
        );
      }
      if (extras.length === 0) {
        return <NodeHeader node={question} />;
      }
      return (
        <>
          <NodeHeader node={question} />
          {extras}
        </>
      );
    };

    const renderQuestionDetails = (
      question: IQuestionNode,
    ): ReactNode | null => {
      const answers = question.repeats
        ? question.answers
        : question.answers.slice(0, 1);
      const hasAnswerChildren = answers.some(
        (answer) => answer.nodes.length > 0,
      );
      const hasAnswerIssues = answers.some(
        (answer) => answer.issues.length > 0,
      );

      if (!hasAnswerChildren && !hasAnswerIssues) {
        return null;
      }

      const details = [
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

      return <NodeList key={`${question.token}-details`}>{details}</NodeList>;
    };

    const detailBlocks = store.detailQuestions
      .map((question) => renderQuestionDetails(question))
      .filter(Boolean);

    const optionLabelIds = new Map(
      optionAxis.map((option) => [
        option.token,
        sanitizeForId(`${node.token}-${option.token}`),
      ]),
    );
    const groupNames = new Map(
      questionAxis.map((entry) => [
        entry.token,
        sanitizeForId(`${entry.token}-table`),
      ]),
    );

    const getOptionLabelId = (token: string) =>
      optionLabelIds.get(token) ?? sanitizeForId(`${node.token}-${token}`);
    const getGroupName = (token: string) =>
      groupNames.get(token) ?? sanitizeForId(`${token}-table`);
    const renderOptionLabel = (option: OptionAxisItem) => (
      <ValueDisplay type={option.type} value={option.value} />
    );

    const columns = isHorizontal
      ? questionAxis.map((entry) => ({
          token: entry.token,
          label: renderQuestionHeader(entry),
        }))
      : optionAxis.map((option) => ({
          token: option.token,
          label: renderOptionLabel(option),
          labelId: getOptionLabelId(option.token),
        }));

    const rows = isHorizontal
      ? optionAxis.map((option) => {
          const optionLabelId = getOptionLabelId(option.token);
          return {
            token: option.token,
            label: renderOptionLabel(option),
            labelId: optionLabelId,
            cells: questionAxis.map((entry) => {
              const groupName = getGroupName(entry.token);
              return {
                token: `${entry.token}-${option.token}`,
                content: (
                  <SelectionTableCell
                    store={store}
                    questionAxis={entry}
                    option={option}
                    optionLabelId={optionLabelId}
                    groupName={groupName}
                    Checkbox={Checkbox}
                    RadioButton={RadioButton}
                  />
                ),
              };
            }),
          };
        })
      : questionAxis.map((entry) => {
          const groupName = getGroupName(entry.token);
          return {
            token: entry.token,
            label: renderQuestionHeader(entry),
            cells: optionAxis.map((option) => {
              const optionLabelId = getOptionLabelId(option.token);
              return {
                token: `${entry.token}-${option.token}`,
                content: (
                  <SelectionTableCell
                    store={store}
                    questionAxis={entry}
                    option={option}
                    optionLabelId={optionLabelId}
                    groupName={groupName}
                    Checkbox={Checkbox}
                    RadioButton={RadioButton}
                  />
                ),
              };
            }),
          };
        });

    content = (
      <>
        <GridTable columns={columns} rows={rows} />
        {detailBlocks.length > 0 ? detailBlocks : null}
      </>
    );
  }

  return (
    <GroupScaffold node={node} dataControl={isHorizontal ? "htable" : "table"}>
      {content}
    </GroupScaffold>
  );
});
