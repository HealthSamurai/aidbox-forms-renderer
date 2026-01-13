import type { TableProperties } from "@aidbox-forms/theme";
import type { ReactElement, ReactNode } from "react";
import { styled } from "@linaria/react";
import { LoadingSpinner } from "./loading-spinner.tsx";

export function Table({
  columns,
  rows,
}: TableProperties): ReactElement | undefined {
  if (rows.length === 0 || columns.length === 0) {
    return (
      <p className="nhsuk-body-s nhsuk-u-secondary-text">Nothing to display.</p>
    );
  }

  const hasRowHeader = rows.some((row) => row.content != undefined);
  const hasRowAction = rows.some((row) => row.onRemove != undefined);

  return (
    <table className="nhsuk-table">
      <thead className="nhsuk-table__head">
        <tr className="nhsuk-table__row">
          {hasRowHeader && (
            <th
              scope="col"
              className="nhsuk-table__header"
              aria-hidden="true"
            />
          )}
          {columns.map((column) => (
            <th key={column.token} scope="col" className="nhsuk-table__header">
              {renderHeaderContent(column.content, column)}
            </th>
          ))}
          {hasRowAction && (
            <th
              scope="col"
              className="nhsuk-table__header"
              aria-hidden="true"
            />
          )}
        </tr>
      </thead>
      <tbody className="nhsuk-table__body">
        {rows.map((row) => (
          <tr key={row.token} className="nhsuk-table__row">
            {hasRowHeader && (
              <th scope="row" className="nhsuk-table__header">
                {renderHeaderContent(row.content, row)}
              </th>
            )}
            {row.cells.map((cell) => (
              <td key={cell.token} className="nhsuk-table__cell">
                {cell.content}
              </td>
            ))}
            {hasRowAction && (
              <td className="nhsuk-table__cell">
                {row.onRemove && (
                  <button
                    type="button"
                    onClick={row.onRemove}
                    disabled={row.canRemove === false}
                    className="nhsuk-button nhsuk-button--secondary nhsuk-button--small nhsuk-u-margin-bottom-0"
                  >
                    {row.removeLabel ?? "Remove"}
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
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
      {meta.errors ?? undefined}
    </HeaderContent>
  );
}

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--nhsuk-spacing-1);
  align-items: flex-start;
`;

const HeaderRow = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: calc(var(--nhsuk-spacing-1) + var(--nhsuk-border-width-form-element));
`;
