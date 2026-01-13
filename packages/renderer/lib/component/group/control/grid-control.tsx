import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../../types.ts";
import { useTheme } from "../../../ui/theme.tsx";
import { Node } from "../../node/node.tsx";
import { NodeHeader } from "../../node/node-header.tsx";
import { buildId } from "../../../utilities.ts";

export const GridControl = observer(function GridControl({
  node,
}: {
  node: IGroupNode;
}) {
  const { Table } = useTheme();

  return (
    <Table
      columns={node.grid.columns.map((question) => ({
        token: question.linkId,
        content: <NodeHeader node={question} as="text" />,
      }))}
      rows={node.grid.rows.map((row) => ({
        token: row.group.token,
        content: <NodeHeader node={row.group} as="text" />,
        cells: node.grid.columns.map((question, index) => {
          const cellQuestion = row.questions[index];
          return {
            token: buildId(row.group.token, question.linkId),
            content: cellQuestion ? <Node node={cellQuestion} /> : undefined,
          };
        }),
      }))}
    />
  );
});
