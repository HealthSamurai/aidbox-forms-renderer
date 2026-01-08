import { observer } from "mobx-react-lite";
import type { GroupWrapperControlProps } from "../../../../types.ts";
import { Node } from "../../../form/node.tsx";
import { GroupWrapperScaffold } from "../group-wrapper-scaffold.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { strings } from "../../../../strings.ts";

export const GridTableRenderer = observer(function GridTableRenderer({
  wrapper,
}: GroupWrapperControlProps) {
  const { GroupRemoveButton, GridTable, EmptyState } = useTheme();
  const store = wrapper.gridTableStore;
  const gridColumns = store.gridColumns;
  const rows = store.rows.map((row) => ({
    token: row.token,
    label: row.label,
    cells: row.cells.map((cell) => {
      if (cell.action === "remove") {
        return {
          token: cell.token,
          content: (
            <GroupRemoveButton
              onClick={() => wrapper.removeNode(row.node)}
              disabled={!wrapper.canRemove}
              text={strings.group.removeSection}
            />
          ),
        };
      }

      return {
        token: cell.token,
        content: cell.question ? <Node node={cell.question} /> : null,
      };
    }),
  }));

  return (
    <GroupWrapperScaffold wrapper={wrapper}>
      {rows.length === 0 ? (
        <GridTable
          columns={gridColumns}
          rows={[]}
          empty={<EmptyState>{strings.group.noNodesYet}</EmptyState>}
        />
      ) : (
        <GridTable columns={gridColumns} rows={rows} />
      )}
    </GroupWrapperScaffold>
  );
});
