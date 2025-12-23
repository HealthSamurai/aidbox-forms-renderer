import { observer } from "mobx-react-lite";
import type {
  GroupControlProps,
  IGroupNode,
  IQuestionNode,
} from "../../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { isGroupNode } from "../../../../stores/nodes/groups/group-store.ts";
import { Node } from "../../../form/node.tsx";
import { isQuestionNode } from "../../../../stores/nodes/questions/question-store.ts";

export const GridRenderer = observer(function GridRenderer({
  node,
}: GroupControlProps) {
  const { EmptyState, GridTable } = useTheme();
  const rowGroups = node.nodes.filter(isGroupNode);

  const children = (() => {
    if (rowGroups.length === 0) {
      return <EmptyState>No row groups configured for this grid.</EmptyState>;
    }

    const visibleRows = rowGroups.filter((row) => !row.hidden);
    if (visibleRows.length === 0) {
      return <EmptyState>All rows are currently hidden.</EmptyState>;
    }

    const columns = buildColumns(visibleRows);
    if (columns.length === 0) {
      return <EmptyState>Grid rows have no questions to render.</EmptyState>;
    }

    const rowsData = visibleRows.map((row) => {
      const questions = getRowQuestions(row);
      const questionMap = new Map<string, IQuestionNode>(
        questions.map((question) => [question.linkId, question]),
      );
      const label = row.text ?? row.linkId ?? "Row";

      return {
        key: row.key,
        label,
        cells: columns.map((column) => {
          const question = questionMap.get(column.linkId);
          const content = question ? <Node node={question} /> : "—";
          return { key: `${row.key}-${column.linkId}`, content };
        }),
      };
    });

    return (
      <GridTable
        columns={columns.map((column) => ({
          key: column.linkId,
          label: column.label,
        }))}
        rows={rowsData}
      />
    );
  })();

  return (
    <GroupScaffold node={node} dataControl="grid">
      {children}
    </GroupScaffold>
  );
});

type GridColumn = {
  linkId: string;
  label: string;
};

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
