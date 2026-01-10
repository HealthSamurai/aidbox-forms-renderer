import { observer } from "mobx-react-lite";
import type {
  IGroupNode,
  OptionAxisItem,
  QuestionAxisItem,
} from "../../../../types.ts";
import { NodeHeader } from "../../../form/node-header.tsx";
import { NodeErrors } from "../../../form/node-errors.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { ValueDisplay } from "../../question/fhir/value-display.tsx";
import { SelectionTableCell } from "../components/selection-table-cell.tsx";
import { strings } from "../../../../strings.ts";
import { buildId } from "../../../../utilities.ts";

export const SelectionTableRenderer = observer(function SelectionTableRenderer({
  node,
}: {
  node: IGroupNode;
}) {
  const { GridTable, EmptyState, OptionsLoading } = useTheme();

  if (node.tableStore.questions.length === 0) {
    return (
      <EmptyState>
        {node.control === "htable"
          ? strings.table.noChoiceQuestionsHorizontal
          : strings.table.noChoiceQuestions}
      </EmptyState>
    );
  }

  if (node.tableStore.optionAxis.length === 0) {
    return (
      <EmptyState>
        {node.control === "htable"
          ? strings.table.noAnswerOptionsHorizontal
          : strings.table.noAnswerOptions}
      </EmptyState>
    );
  }

  const renderQuestionHeader = (entry: QuestionAxisItem) => (
    <>
      <NodeHeader node={entry.question} as="text" />
      {entry.question.answerOption.isLoading ? (
        <OptionsLoading isLoading />
      ) : undefined}
      {entry.question.hasErrors && <NodeErrors node={entry.question} />}
    </>
  );

  const renderOptionLabel = (option: OptionAxisItem) => (
    <ValueDisplay type={option.type} value={option.value} />
  );

  return (
    <GridTable
      columns={
        node.control === "htable"
          ? node.tableStore.questionAxis.map((entry) => ({
              token: entry.token,
              label: renderQuestionHeader(entry),
            }))
          : node.tableStore.optionAxis.map((option) => ({
              token: option.token,
              label: renderOptionLabel(option),
              labelId: buildId(node.token, option.token),
            }))
      }
      rows={
        node.control === "htable"
          ? node.tableStore.optionAxis.map((option) => ({
              token: option.token,
              label: renderOptionLabel(option),
              labelId: buildId(node.token, option.token),
              cells: node.tableStore.questionAxis.map((entry) => ({
                token: buildId(entry.token, option.token),
                content: (
                  <SelectionTableCell
                    store={node.tableStore}
                    questionAxis={entry}
                    option={option}
                    optionLabelId={buildId(node.token, option.token)}
                  />
                ),
              })),
            }))
          : node.tableStore.questionAxis.map((entry) => ({
              token: entry.token,
              label: renderQuestionHeader(entry),
              cells: node.tableStore.optionAxis.map((option) => ({
                token: buildId(entry.token, option.token),
                content: (
                  <SelectionTableCell
                    store={node.tableStore}
                    questionAxis={entry}
                    option={option}
                    optionLabelId={buildId(node.token, option.token)}
                  />
                ),
              })),
            }))
      }
    />
  );
});
