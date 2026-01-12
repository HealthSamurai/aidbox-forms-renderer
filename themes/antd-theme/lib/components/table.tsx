import type { TableProperties } from "@aidbox-forms/theme";
import type { ReactNode } from "react";
import { Button, Empty, Space } from "antd";
import { LoadingSpinner } from "./loading-spinner.tsx";

export function Table({ columns, rows }: TableProperties) {
  if (rows.length === 0 || columns.length === 0) {
    return <Empty description="Nothing to display." />;
  }

  const hasRowHeader = rows.some((row) => row.content != undefined);
  const hasRowAction = rows.some((row) => row.onRemove != undefined);

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="ab-antd-table">
        <thead>
          <tr>
            {hasRowHeader && <th aria-hidden="true" />}
            {columns.map((column) => (
              <th key={column.token}>
                {renderHeaderContent(column.content, column)}
              </th>
            ))}
            {hasRowAction && <th aria-hidden="true" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.token}>
              {hasRowHeader && (
                <th scope="row" className="ab-antd-table-row-header">
                  {renderHeaderContent(row.content, row)}
                </th>
              )}
              {row.cells.map((cell) => (
                <td key={cell.token}>{cell.content}</td>
              ))}
              {hasRowAction && (
                <td>
                  {row.onRemove && (
                    <Button
                      type="text"
                      danger
                      onClick={row.onRemove}
                      disabled={row.canRemove === false}
                    >
                      {row.removeLabel ?? "Remove"}
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
    <Space direction="vertical" size="small">
      <Space align="center" size="small">
        {content}
        {meta.isLoading && <LoadingSpinner />}
      </Space>
      {meta.errors}
    </Space>
  );
}
