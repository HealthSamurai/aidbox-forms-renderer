import type { TableProperties } from "@aidbox-forms/theme";
import type { ReactElement, ReactNode } from "react";
import { styled } from "@linaria/react";
import { Trash } from "../icons/trash.tsx";
import { IconButton } from "./icon-button.tsx";
import { LoadingSpinner } from "./loading-spinner.tsx";

export function Table({
  columns,
  rows,
}: TableProperties): ReactElement | undefined {
  if (rows.length === 0 || columns.length === 0) {
    return <Empty>Nothing to display.</Empty>;
  }

  const hasRowHeader = rows.some((row) => row.content != undefined);
  const hasRowAction = rows.some((row) => row.onRemove != undefined);

  return (
    <Wrapper>
      <TableElement>
        <thead>
          <tr>
            {hasRowHeader && <Header scope="col" aria-hidden="true" />}
            {columns.map((column) => (
              <Header key={column.token} scope="col">
                {renderHeaderContent(column.content, column)}
              </Header>
            ))}
            {hasRowAction && <Header scope="col" aria-hidden="true" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.token}>
              {hasRowHeader && (
                <RowHeader scope="row">
                  {renderHeaderContent(row.content, row)}
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
      </TableElement>
    </Wrapper>
  );
}

type TableMeta = {
  isLoading?: boolean | undefined;
  errors?: ReactNode | undefined;
};

function renderHeaderContent(content: ReactNode, meta: TableMeta) {
  if (!meta.isLoading && !meta.errors) {
    return content;
  }

  return (
    <HeaderContent>
      <HeaderRow>
        {content}
        {meta.isLoading && <LoadingSpinner />}
      </HeaderRow>
      {meta.errors ? <HeaderErrors>{meta.errors}</HeaderErrors> : undefined}
    </HeaderContent>
  );
}

const Wrapper = styled.div`
  overflow-x: auto;
`;

const TableElement = styled.table`
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

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
`;

const HeaderRow = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
`;

const HeaderErrors = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Empty = styled.p`
  font-style: italic;
  color: #94a3b8;
`;
