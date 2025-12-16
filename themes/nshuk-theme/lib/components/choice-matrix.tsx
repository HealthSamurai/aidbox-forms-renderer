import type { ChoiceMatrixProps } from "@aidbox-forms/theme";
import type { ReactElement } from "react";
import classNames from "classnames";

export function ChoiceMatrix({
  orientation,
  columns,
  rows,
  detailsGrid,
  empty,
}: ChoiceMatrixProps): ReactElement | null {
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
                    "nhsuk-u-bg-light-grey": cell.selected,
                    "nhsuk-u-secondary-text": cell.disabled,
                  })}
                  data-selected={cell.selected || undefined}
                  data-disabled={cell.disabled || undefined}
                >
                  {cell.content}
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
