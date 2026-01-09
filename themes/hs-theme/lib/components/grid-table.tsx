import type { GridTableProps } from "@aidbox-forms/theme";
import type { ReactElement } from "react";
import { styled } from "@linaria/react";
import { Trash } from "../icons/trash.tsx";
import { IconButton } from "./icon-button.tsx";

export function GridTable({
  columns,
  rows,
  empty,
}: GridTableProps): ReactElement | null {
  if (rows.length === 0 || columns.length === 0) {
    return empty ? <>{empty}</> : <Empty>Nothing to display.</Empty>;
  }

  const hasRowHeader = rows.some((row) => row.label != null);
  const hasRowAction = rows.some((row) => row.onRemove != null);

  return (
    <Wrapper>
      <Table>
        <thead>
          <tr>
            {hasRowHeader && <Header scope="col" aria-hidden="true" />}
            {columns.map((column) => (
              <Header key={column.token} scope="col" id={column.labelId}>
                {column.label}
              </Header>
            ))}
            {hasRowAction && <Header scope="col" aria-hidden="true" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.token}>
              {hasRowHeader && (
                <RowHeader scope="row" id={row.labelId}>
                  {row.label}
                </RowHeader>
              )}
              {row.cells.map((cell) => (
                <Cell key={cell.token}>{cell.content}</Cell>
              ))}
              {hasRowAction && (
                <Cell>
                  {row.onRemove && (
                    <IconButton
                      icon={<Trash />}
                      onClick={row.onRemove}
                      disabled={row.canRemove === false}
                      label={row.removeLabel ?? "Remove"}
                    />
                  )}
                </Cell>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Header = styled.th`
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  text-align: left;
  font-weight: normal;
`;

const RowHeader = styled.th`
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  text-align: left;
  font-weight: normal;
  min-width: 160px;
`;

const Cell = styled.td`
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  vertical-align: top;
`;

const Empty = styled.p`
  font-style: italic;
  color: #94a3b8;
`;
