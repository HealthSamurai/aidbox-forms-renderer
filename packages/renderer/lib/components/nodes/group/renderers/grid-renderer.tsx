import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { Node } from "../../../form/node.tsx";
import { JSX } from "react";

export const GridRenderer = observer(function GridRenderer({
  node,
}: GroupControlProps) {
  const { EmptyState, GridTable } = useTheme();
  const store = node.gridStore;
  const emptyMessage = store.emptyMessage;
  let children: JSX.Element;

  if (emptyMessage) {
    children = <EmptyState>{emptyMessage}</EmptyState>;
  } else {
    children = (
      <GridTable
        columns={store.columns.map((column) => ({
          key: column.key,
          label: column.label,
        }))}
        rows={store.rows.map((row) => ({
          key: row.key,
          label: row.label,
          cells: row.cells.map((cell) => ({
            key: cell.key,
            content: cell.question ? <Node node={cell.question} /> : "—",
          })),
        }))}
      />
    );
  }

  return (
    <GroupScaffold node={node} dataControl="grid">
      {children}
    </GroupScaffold>
  );
});
