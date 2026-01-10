import { observer } from "mobx-react-lite";
import type { IGroupList } from "../../../../types.ts";
import { Node } from "../../../form/node.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { strings } from "../../../../strings.ts";

export const GridTableRenderer = observer(function GridTableRenderer({
  list,
}: {
  list: IGroupList;
}) {
  const { GridTable, EmptyState } = useTheme();
  const store = list.gridTableStore;

  const rows = store.rows.map((row) => ({
    token: row.token,
    label: row.label,
    onRemove: () => list.removeNode(row.node),
    canRemove: list.canRemove,
    removeLabel: strings.group.removeSection,
    cells: row.cells.map((cell) => ({
      token: cell.token,
      content: cell.question ? <Node node={cell.question} /> : undefined,
    })),
  }));

  return rows.length === 0 ? (
    <GridTable
      columns={store.columns}
      rows={[]}
      empty={<EmptyState>{strings.group.noNodesYet}</EmptyState>}
    />
  ) : (
    <GridTable columns={store.columns} rows={rows} />
  );
});
