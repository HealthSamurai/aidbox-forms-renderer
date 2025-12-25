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
          key={`${question.key}-details`}
          question={question}
        />
      ))
      .filter(Boolean);

    const rows = store.rowStates.map((row) => ({
      key: row.key,
      label: <NodeHeader node={row.question} />,
      cells: row.cells.map((cell) => {
        if (!cell.entry || !cell.toggleSelection) {
          return {
            key: `${row.key}-${cell.key}`,
            content: cell.placeholder ?? "—",
          };
        }

        if (row.question.repeats) {
          return {
            key: `${row.key}-${cell.key}`,
            content: (
              <CheckboxList
                options={[
                  {
                    key: cell.key,
                    label: cell.entry.label,
                    value: cell.entry.value,
                    disabled: cell.disabled,
                  },
                ]}
                value={row.selectedKeys}
                onChange={(key) => {
                  if (key === cell.key) {
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
          key: `${row.key}-${cell.key}`,
          content: (
            <RadioButtonList
              options={[
                {
                  key: cell.key,
                  label: cell.entry.label,
                  disabled: cell.disabled,
                },
              ]}
              value={row.selectedKey}
              legacyOption={null}
              onChange={(key) => {
                if (key === cell.key) {
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
        <GridTable
          columns={store.columns.map((column) => ({
            key: column.key,
            label: column.label,
          }))}
          rows={rows}
        />
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
