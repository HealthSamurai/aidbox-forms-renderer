import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { NodesList } from "../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";
import { TableQuestionDetails } from "../components/selection-table.tsx";
import { NodeHeader } from "../../../form/node-header.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { JSX } from "react";

export const VerticalTableRenderer = observer(function VerticalTableRenderer({
  node,
}: GroupControlProps) {
  const { GroupActions, GridTable, EmptyState, RadioButtonList, CheckboxList } =
    useTheme();
  const store = node.tableStore;

  let content: JSX.Element;
  if (store.questions.length === 0) {
    content = <EmptyState>No choice questions available.</EmptyState>;
  } else if (store.columns.length === 0) {
    content = (
      <EmptyState>No answer options available for table layout.</EmptyState>
    );
  } else {
    const detailBlocks = store.detailQuestions
      .map((question) => (
        <TableQuestionDetails
          key={`${question.token}-details`}
          question={question}
        />
      ))
      .filter(Boolean);

    const rows = store.rowStates.map((row) => ({
      token: row.token,
      label: <NodeHeader node={row.question} />,
      cells: row.cells.map((cell) => {
        if (!cell.entry || !cell.toggleSelection) {
          return {
            token: `${row.token}-${cell.token}`,
            content: cell.placeholder ?? "—",
          };
        }

        if (row.question.repeats) {
          return {
            token: `${row.token}-${cell.token}`,
            content: (
              <CheckboxList
                options={[
                  {
                    token: cell.token,
                    label: cell.entry.label,
                    disabled: cell.disabled,
                  },
                ]}
                tokens={row.selectedTokens}
                onChange={(token) => {
                  if (token === cell.token) {
                    cell.toggleSelection?.();
                  }
                }}
                id={row.id}
                ariaLabelledBy={row.ariaLabelledBy}
                ariaDescribedBy={row.ariaDescribedBy}
                disabled={row.question.readOnly}
              />
            ),
          };
        }

        return {
          token: `${row.token}-${cell.token}`,
          content: (
            <RadioButtonList
              options={[
                {
                  token: cell.token,
                  label: cell.entry.label,
                  disabled: cell.disabled,
                },
              ]}
              token={row.selectedToken}
              legacyOption={null}
              onChange={(token) => {
                if (token === cell.token) {
                  cell.toggleSelection?.();
                }
              }}
              id={row.id}
              ariaLabelledBy={row.ariaLabelledBy}
              ariaDescribedBy={row.ariaDescribedBy}
              disabled={row.question.readOnly}
            />
          ),
        };
      }),
    }));

    content = (
      <>
        <GridTable columns={store.columns} rows={rows} />
        {detailBlocks.length > 0 ? detailBlocks : null}
      </>
    );
  }

  return (
    <GroupScaffold node={node} dataControl="table">
      {content}
      {store.others.length > 0 ? (
        <GroupActions>
          <NodesList nodes={store.others} />
        </GroupActions>
      ) : null}
    </GroupScaffold>
  );
});
