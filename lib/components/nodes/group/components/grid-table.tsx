import "./grid-table.css";
import { observer } from "mobx-react-lite";
import type { IGroupNode, IQuestionNode } from "../../../../types.ts";
import { Node } from "../../../form/node.tsx";
import { isQuestionNode } from "../../../../stores/nodes/questions/question-store.ts";

export const GroupGridTable = observer(function GroupGridTable({
  rows,
}: {
  rows: IGroupNode[];
}) {
  if (rows.length === 0) {
    return <p className="af-grid-table__empty">No grid rows to display.</p>;
  }

  const visibleRows = rows.filter((row) => !row.hidden);
  if (visibleRows.length === 0) {
    return (
      <p className="af-grid-table__empty">All rows are currently hidden.</p>
    );
  }

  const columns = buildColumns(visibleRows);
  if (columns.length === 0) {
    return (
      <p className="af-grid-table__empty">
        Grid rows have no questions to render.
      </p>
    );
  }

  return (
    <div className="af-grid-table">
      <table className="af-grid-table__table">
        <thead>
          <tr>
            <th scope="col" className="af-grid-table__row-header">
              Row
            </th>
            {columns.map((column) => (
              <th key={column.linkId} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <GridTableRow key={row.key} row={row} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

type GridColumn = {
  linkId: string;
  label: string;
};

const GridTableRow = observer(function GridTableRow({
  row,
  columns,
}: {
  row: IGroupNode;
  columns: GridColumn[];
}) {
  const questions = getRowQuestions(row);
  const questionMap = new Map<string, IQuestionNode>(
    questions.map((question) => [question.linkId, question]),
  );
  const label = row.text ?? row.linkId ?? "Row";

  return (
    <tr>
      <th scope="row" className="af-grid-table__row-label">
        {label}
      </th>
      {columns.map((column) => {
        const question = questionMap.get(column.linkId);
        return (
          <td key={`${row.key}-${column.linkId}`}>
            {question ? (
              <div className="af-grid-table__cell">
                <Node node={question} />
              </div>
            ) : (
              <div className="af-grid-table__cell af-grid-table__cell--empty">
                —
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
});

function buildColumns(rows: IGroupNode[]): GridColumn[] {
  const seen = new Set<string>();
  const columns: GridColumn[] = [];

  rows.forEach((row) => {
    getRowQuestions(row).forEach((question) => {
      if (!seen.has(question.linkId)) {
        seen.add(question.linkId);
        columns.push({
          linkId: question.linkId,
          label: question.text ?? question.linkId,
        });
      }
    });
  });

  return columns;
}

function getRowQuestions(row: IGroupNode): IQuestionNode[] {
  return row.nodes
    .filter(isQuestionNode)
    .filter((question) => !question.hidden);
}
