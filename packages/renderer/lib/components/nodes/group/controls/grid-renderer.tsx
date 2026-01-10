import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { Node } from "../../../form/node.tsx";

export const GridRenderer = observer(function GridRenderer({
  node,
}: {
  node: IGroupNode;
}) {
  const { EmptyState, GridTable } = useTheme();

  return node.gridStore.emptyMessage ? (
    <EmptyState>{node.gridStore.emptyMessage}</EmptyState>
  ) : (
    <GridTable
      columns={node.gridStore.columns}
      rows={node.gridStore.rows.map((row) => ({
        token: row.token,
        label: row.label,
        cells: row.cells.map((cell) => ({
          token: cell.token,
          content: cell.question ? <Node node={cell.question} /> : null,
        })),
      }))}
    />
  );
});
