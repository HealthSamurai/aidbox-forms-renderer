import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { Node } from "../../../form/node.tsx";
import { JSX } from "react";
import { strings } from "../../../../strings.ts";

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
        columns={store.columns}
        rows={store.rows.map((row) => ({
          token: row.token,
          label: row.label,
          cells: row.cells.map((cell) => ({
            token: cell.token,
            content: cell.question ? (
              <Node node={cell.question} />
            ) : (
              strings.placeholders.emptyCell
            ),
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
