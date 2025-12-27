import type { GridTableProps } from "@aidbox-forms/theme";
import type { ReactElement } from "react";

export function GridTable({
  columns,
  rows,
  empty,
}: GridTableProps): ReactElement | null {
  if (rows.length === 0 || columns.length === 0) {
    return empty ? (
      <>{empty}</>
    ) : (
      <p className="nhsuk-body-s nhsuk-u-secondary-text">Nothing to display.</p>
    );
  }

  return (
    <div className="nhsuk-u-margin-top-2">
      <table className="nhsuk-table nhsuk-table-responsive">
        <thead className="nhsuk-table__head">
          <tr className="nhsuk-table__row">
            <th scope="col" className="nhsuk-table__header">
              Row
            </th>
            {columns.map((column) => (
              <th
                key={column.token}
                scope="col"
                className="nhsuk-table__header"
                id={column.labelId}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="nhsuk-table__body">
          {rows.map((row) => (
            <tr key={row.token} className="nhsuk-table__row">
              <th scope="row" className="nhsuk-table__header" id={row.labelId}>
                {row.label}
              </th>
              {row.cells.map((cell) => (
                <td key={cell.token} className="nhsuk-table__cell">
                  {cell.content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
