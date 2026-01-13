import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../../types.ts";
import { NodeHeader } from "../../node/node-header.tsx";
import { NodeErrors } from "../../node/node-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";
import { ValueDisplay } from "../../question/fhir/value-display.tsx";
import { SelectionTableCell } from "../component/selection-table-cell.tsx";
import { buildId } from "../../../utilities.ts";

export const SelectionTableControl = observer(function SelectionTableControl({
  node,
}: {
  node: IGroupNode;
}) {
  const { Table, Label } = useTheme();

  return node.control === "htable" ? (
    <Table
      columns={node.table.questions.map((question) => ({
        token: question.token,
        content: <NodeHeader node={question} as="text" />,
        isLoading: question.answerOption.select.isLoading,
        errors: question.hasErrors && <NodeErrors node={question} />,
      }))}
      rows={node.table.optionAxis.map((option) => ({
        token: option.token,
        content: (
          <Label id={buildId(node.token, option.token)}>
            <ValueDisplay type={option.answerType} value={option.value} />
          </Label>
        ),
        cells: node.table.questions.map((question) => ({
          token: buildId(question.token, option.token),
          content: (
            <SelectionTableCell
              store={node.table}
              question={question}
              option={option}
              ariaLabelledBy={buildId(node.token, option.token)}
            />
          ),
        })),
      }))}
    />
  ) : (
    <Table
      columns={node.table.optionAxis.map((option) => ({
        token: option.token,
        content: (
          <Label id={buildId(node.token, option.token)}>
            <ValueDisplay type={option.answerType} value={option.value} />
          </Label>
        ),
      }))}
      rows={node.table.questions.map((question) => ({
        token: question.token,
        content: <NodeHeader node={question} as="text" />,
        isLoading: question.answerOption.select.isLoading,
        errors: question.hasErrors && <NodeErrors node={question} />,
        cells: node.table.optionAxis.map((option) => ({
          token: buildId(question.token, option.token),
          content: (
            <SelectionTableCell
              store={node.table}
              question={question}
              option={option}
              ariaLabelledBy={buildId(node.token, option.token)}
            />
          ),
        })),
      }))}
    />
  );
});
