import { observer } from "mobx-react-lite";
import type { GroupWrapperControlProps } from "../../../../types.ts";
import { Node } from "../../../form/node.tsx";
import { GroupWrapperScaffold } from "../group-wrapper-scaffold.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { strings } from "../../../../strings.ts";

export const GridTableRenderer = observer(function GridTableRenderer({
  wrapper,
}: GroupWrapperControlProps) {
  const { GridTable, EmptyState } = useTheme();
  const store = wrapper.gridTableStore;

  const rows = store.rows.map((row) => ({
    token: row.token,
    label: row.label,
    onRemove: () => wrapper.removeNode(row.node),
    canRemove: wrapper.canRemove,
    removeLabel: strings.group.removeSection,
    cells: row.cells.map((cell) => ({
      token: cell.token,
      content: cell.question ? <Node node={cell.question} /> : null,
    })),
  }));

  return (
    <GroupWrapperScaffold wrapper={wrapper}>
      {rows.length === 0 ? (
        <GridTable
          columns={store.columns}
          rows={[]}
          empty={<EmptyState>{strings.group.noNodesYet}</EmptyState>}
        />
      ) : (
        <GridTable columns={store.columns} rows={rows} />
      )}
    </GroupWrapperScaffold>
  );
});
