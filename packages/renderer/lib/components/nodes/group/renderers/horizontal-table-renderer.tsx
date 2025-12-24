import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { NodesList } from "../../../form/node-list.tsx";
import { GroupScaffold } from "../group-scaffold.tsx";
import { TableQuestionDetails } from "../components/selection-table.tsx";
import { NodeHeader } from "../../../form/node-header.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { JSX } from "react";

export const HorizontalTableRenderer = observer(
  function HorizontalTableRenderer({ node }: GroupControlProps) {
    const { GroupActions, GridTable, EmptyState, RadioGroup, CheckboxGroup } =
      useTheme();
    const store = node.tableStore;

    let content: JSX.Element;
    if (store.questions.length === 0) {
      content = (
        <EmptyState>
          No choice questions available for horizontal table.
        </EmptyState>
      );
    } else if (store.columns.length === 0) {
      content = (
        <EmptyState>
          No answer options available for horizontal table layout.
        </EmptyState>
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

      const rows = store.columns.map((column, columnIndex) => ({
        key: column.key,
        label: column.label,
        cells: store.rowStates.map((row) => {
          const cell = row.cells[columnIndex];
          if (!cell || !cell.entry || !cell.toggleSelection) {
            return {
              key: `${row.question.key}-${column.key}`,
              content: cell?.placeholder ?? "—",
            };
          }

          if (row.question.repeats) {
            return {
              key: `${row.question.key}-${column.key}`,
              content: (
                <CheckboxGroup
                  options={[
                    {
                      key: column.key,
                      label: cell.entry.label,
                      value: cell.entry.value,
                      disabled: cell.disabled,
                    },
                  ]}
                  selectedKeys={row.selectedKeys}
                  onToggle={(key) => {
                    if (key === column.key) {
                      cell.toggleSelection?.();
                    }
                  }}
                  inputName={row.inputName}
                  labelId={row.labelId}
                  describedById={row.describedBy}
                  readOnly={row.question.readOnly}
                />
              ),
            };
          }

          return {
            key: `${row.question.key}-${column.key}`,
            content: (
              <RadioGroup
                options={[
                  {
                    key: column.key,
                    label: cell.entry.label,
                    disabled: cell.disabled,
                  },
                ]}
                selectValue={row.selectedKey}
                legacyOptionLabel={undefined}
                legacyOptionKey={undefined}
                onChange={(key) => {
                  if (key === column.key) {
                    cell.toggleSelection?.();
                  }
                }}
                inputId={row.inputName}
                labelId={row.labelId}
                describedById={row.describedBy}
                readOnly={row.question.readOnly}
              />
            ),
          };
        }),
      }));

      content = (
        <>
          <GridTable
            columns={store.rowStates.map((row) => ({
              key: row.key,
              label: <NodeHeader node={row.question} />,
            }))}
            rows={rows}
          />
          {detailBlocks.length > 0 ? detailBlocks : null}
        </>
      );
    }

    return (
      <GroupScaffold node={node} dataControl="htable">
        {content}
        {store.others.length > 0 ? (
          <GroupActions>
            <NodesList nodes={store.others} />
          </GroupActions>
        ) : null}
      </GroupScaffold>
    );
  },
);
