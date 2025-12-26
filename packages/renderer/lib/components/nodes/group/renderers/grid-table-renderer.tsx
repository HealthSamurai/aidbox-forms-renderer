import { observer } from "mobx-react-lite";
import type { GroupWrapperControlProps } from "../../../../types.ts";
import { Node } from "../../../form/node.tsx";
import { GroupWrapperScaffold } from "../group-wrapper-scaffold.tsx";
import { useTheme } from "../../../../ui/theme.tsx";

export const GridTableRenderer = observer(function GridTableRenderer({
  wrapper,
}: GroupWrapperControlProps) {
  const { GroupRemoveButton, GridTable, EmptyState } = useTheme();
  const store = wrapper.gridTableStore;
  const gridColumns = store.gridColumns;
  const rows = store.rows.map((row) => ({
    key: row.key,
    label: row.label,
    cells: row.cells.map((cell) => {
      if (cell.action === "remove") {
        return {
          key: cell.key,
          content: (
            <GroupRemoveButton
              onClick={() => wrapper.removeNode(row.node)}
              disabled={!wrapper.canRemove}
            />
          ),
        };
      }

      return {
        key: cell.key,
        content: cell.question ? <Node node={cell.question} /> : "—",
      };
    }),
  }));

  return (
    <GroupWrapperScaffold wrapper={wrapper}>
      {rows.length === 0 ? (
        <GridTable
          columns={gridColumns}
          rows={[{ key: "empty", label: "Node", cells: [] }]}
          empty={<EmptyState>No nodes yet.</EmptyState>}
        />
      ) : (
        <GridTable columns={gridColumns} rows={rows} />
      )}
    </GroupWrapperScaffold>
  );
});
