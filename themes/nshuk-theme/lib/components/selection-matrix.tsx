import type { SelectionMatrixProps } from "@aidbox-forms/theme";
import type { ReactElement } from "react";
import classNames from "classnames";

export function SelectionMatrix({
  orientation,
  columns,
  rows,
  detailsGrid,
  empty,
}: SelectionMatrixProps): ReactElement | null {
  if (rows.length === 0 || columns.length === 0) {
    return empty ? (
      <>{empty}</>
    ) : (
      <p className="nhsuk-body-s nhsuk-u-secondary-text">Nothing to display.</p>
    );
  }

  const showQuestionHeader = orientation === "vertical";

  return (
    <div className="nhsuk-u-margin-top-2">
      <table className="nhsuk-table nhsuk-table-responsive">
        <thead className="nhsuk-table__head">
          <tr className="nhsuk-table__row">
            {showQuestionHeader ? (
              <th scope="col" className="nhsuk-table__header">
                Question
              </th>
            ) : null}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                id={column.headerId}
                className="nhsuk-table__header"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="nhsuk-table__body">
          {rows.map((row) => (
            <tr
              key={row.key}
              className="nhsuk-table__row"
              data-loading={row.loading || undefined}
            >
              {showQuestionHeader ? (
                <th scope="row" className="nhsuk-table__header">
                  {row.header}
                </th>
              ) : null}
              {row.cells.map((cell) => (
                <td
                  key={cell.key}
                  className={classNames("nhsuk-table__cell", {
                    "nhsuk-u-bg-light-grey":
                      cell.selected ?? cell.control?.checked,
                    "nhsuk-u-secondary-text":
                      cell.disabled ?? cell.control?.disabled,
                  })}
                  data-selected={
                    (cell.selected ?? cell.control?.checked) || undefined
                  }
                  data-disabled={
                    (cell.disabled ?? cell.control?.disabled) || undefined
                  }
                >
                  {cell.control ? (
                    <input
                      id={cell.control.id}
                      name={cell.control.name}
                      type={cell.control.type}
                      checked={cell.control.checked}
                      disabled={cell.control.disabled}
                      onChange={cell.control.onChange}
                      aria-labelledby={cell.control.labelledBy}
                      aria-describedby={cell.control.describedBy}
                      aria-label={cell.control.ariaLabel}
                    />
                  ) : (
                    (cell.placeholder ?? "—")
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {orientation === "vertical"
        ? rows.map((row) =>
            row.details ? (
              <div
                key={`${row.key}-details`}
                className="nhsuk-u-margin-top-2 nhsuk-u-padding-2 nhsuk-u-bg-light-grey"
              >
                {row.details}
              </div>
            ) : null,
          )
        : null}
      {orientation === "horizontal" && detailsGrid ? (
        <div className="nhsuk-grid-row nhsuk-u-margin-top-2">{detailsGrid}</div>
      ) : null}
    </div>
  );
}
