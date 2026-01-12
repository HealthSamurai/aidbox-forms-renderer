import {
  Box,
  Button,
  Group,
  Loader,
  Table as MantineTable,
  Text,
} from "@mantine/core";
import type { TableProperties } from "@aidbox-forms/theme";
import type { ReactNode } from "react";

type TableMeta = {
  isLoading?: boolean | undefined;
  errors?: ReactNode | undefined;
};

function renderHeaderContent(content: ReactNode, meta: TableMeta) {
  if (!meta.isLoading && !meta.errors) {
    return content;
  }

  return (
    <Box>
      <Group gap={6} align="center" wrap="wrap">
        {content}
        {meta.isLoading ? <Loader size="xs" /> : null}
      </Group>
      {meta.errors ? <Box mt={4}>{meta.errors}</Box> : null}
    </Box>
  );
}

export function Table({ columns, rows }: TableProperties) {
  if (rows.length === 0 || columns.length === 0) {
    return (
      <Text size="sm" c="dimmed" style={{ fontStyle: "italic" }}>
        Nothing to display.
      </Text>
    );
  }

  const hasRowHeader = rows.some((row) => row.content != undefined);
  const hasRowAction = rows.some((row) => row.onRemove != undefined);

  return (
    <Box style={{ overflowX: "auto" }}>
      <MantineTable withTableBorder withColumnBorders highlightOnHover>
        <thead>
          <tr>
            {hasRowHeader ? <th aria-hidden="true" /> : null}
            {columns.map((column) => (
              <th key={column.token}>
                {renderHeaderContent(column.content, column)}
              </th>
            ))}
            {hasRowAction ? <th aria-hidden="true" /> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.token}>
              {hasRowHeader ? (
                <th style={{ minWidth: 160 }}>
                  {renderHeaderContent(row.content, row)}
                </th>
              ) : null}
              {row.cells.map((cell) => (
                <td key={cell.token}>{cell.content}</td>
              ))}
              {hasRowAction ? (
                <td>
                  {row.onRemove ? (
                    <Button
                      type="button"
                      variant="subtle"
                      color="red"
                      onClick={row.onRemove}
                      disabled={row.canRemove === false}
                    >
                      {row.removeLabel ?? "Remove"}
                    </Button>
                  ) : null}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </MantineTable>
    </Box>
  );
}
