import { observer } from "mobx-react-lite";
import type {
  GroupControlProps,
  OptionAxisItem,
  QuestionAxisItem,
} from "../../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { NodeHeader } from "../../../form/node-header.tsx";
import { NodeErrors } from "../../../form/node-errors.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { ValueDisplay } from "../../question/fhir/value-display.tsx";
import { SelectionTableCell } from "../components/selection-table-cell.tsx";
import { strings } from "../../../../strings.ts";
import { buildId } from "../../../../utils.ts";

export const SelectionTableRenderer = observer(function SelectionTableRenderer({
  node,
}: GroupControlProps) {
  const { GridTable, EmptyState, OptionsLoading } = useTheme();

  if (node.tableStore.questions.length === 0) {
    return (
      <GroupScaffold node={node} dataControl={node.control}>
        <EmptyState>
          {node.control === "htable"
            ? strings.table.noChoiceQuestionsHorizontal
            : strings.table.noChoiceQuestions}
        </EmptyState>
      </GroupScaffold>
    );
  }

  if (node.tableStore.optionAxis.length === 0) {
    return (
      <GroupScaffold node={node} dataControl={node.control}>
        <EmptyState>
          {node.control === "htable"
            ? strings.table.noAnswerOptionsHorizontal
            : strings.table.noAnswerOptions}
        </EmptyState>
      </GroupScaffold>
    );
  }

  const renderQuestionHeader = (entry: QuestionAxisItem) => (
    <>
      <NodeHeader node={entry.question} as="text" />
      {entry.question.answerOption.isLoading ? (
        <OptionsLoading isLoading />
      ) : null}
      {entry.question.hasErrors ? <NodeErrors node={entry.question} /> : null}
    </>
  );

  const renderOptionLabel = (option: OptionAxisItem) => (
    <ValueDisplay type={option.type} value={option.value} />
  );

  return (
    <GroupScaffold node={node} dataControl={node.control}>
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
    </GroupScaffold>
  );
});
