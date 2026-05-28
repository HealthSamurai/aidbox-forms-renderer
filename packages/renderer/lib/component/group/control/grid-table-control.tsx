import { observer } from "mobx-react-lite";
import type { IGroupList } from "../../../types.ts";
import { Node } from "../../node/node.tsx";
import { NodeHeader } from "../../node/node-header.tsx";
import { useTheme } from "../../../ui/theme.tsx";
import { buildId } from "../../../utilities.ts";

export const GridTableControl = observer(function GridTableControl({
  list,
}: {
  list: IGroupList;
}) {
  const { Table } = useTheme();

  const columns = list.grid.columns.map((question) => ({
    token: question.linkId,
    content: <NodeHeader node={question} as="text" />,
    width: question.columnWidth,
  }));

  const rows = list.grid.rows.map((row) => ({
    token: row.group.token,
    path: row.group.path,
    onRemove: () => list.removeNode(row.group),
    canRemove: list.canRemove,
    cells: columns.map((column, index) => {
      const cellQuestion = row.questions[index];
      return {
        token: buildId(row.group.token, column.token),
        content: cellQuestion ? <Node node={cellQuestion} /> : undefined,
      };
    }),
  }));

  return <Table columns={columns} rows={rows} />;
});
