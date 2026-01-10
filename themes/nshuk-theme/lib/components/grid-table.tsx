import type { GridTableProperties } from "@aidbox-forms/theme";
import type { ReactElement } from "react";
import { IconButton } from "./icon-button.tsx";

export function GridTable({
  columns,
  rows,
  empty,
}: GridTableProperties): ReactElement | undefined {
  if (rows.length === 0 || columns.length === 0) {
    return empty ? (
      <>{empty}</>
    ) : (
      <p className="nhsuk-body-s nhsuk-u-secondary-text">Nothing to display.</p>
    );
  }

  const hasRowHeader = rows.some((row) => row.label != undefined);
  const hasRowAction = rows.some((row) => row.onRemove != undefined);

  return (
    <table className="nhsuk-table nhsuk-table-responsive">
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
            <th
              key={column.token}
              scope="col"
              className="nhsuk-table__header"
              id={column.labelId}
            >
              {column.label}
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
              <th scope="row" className="nhsuk-table__header" id={row.labelId}>
                {row.label}
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
                  <IconButton
                    icon="−"
                    onClick={row.onRemove}
                    disabled={row.canRemove === false}
                    label={row.removeLabel ?? "Remove"}
                  />
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
