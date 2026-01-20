import {
  Box,
  Button,
  Group,
  Loader,
  Table as MantineTable,
  Text,
} from "@mantine/core";
import type { TableProperties } from "@formbox/theme";
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
        {meta.isLoading ? <Loader size="xs" /> : undefined}
      </Group>
      {meta.errors ? <Box mt={4}>{meta.errors}</Box> : undefined}
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
        <MantineTable.Thead>
          <MantineTable.Tr>
            {hasRowHeader ? <MantineTable.Th aria-hidden="true" /> : undefined}
            {columns.map((column) => (
              <MantineTable.Th key={column.token} scope="col">
                {renderHeaderContent(column.content, column)}
              </MantineTable.Th>
            ))}
            {hasRowAction ? <MantineTable.Th aria-hidden="true" /> : undefined}
          </MantineTable.Tr>
        </MantineTable.Thead>
        <MantineTable.Tbody>
          {rows.map((row) => (
            <MantineTable.Tr key={row.token}>
              {hasRowHeader ? (
                <MantineTable.Th scope="row" style={{ minWidth: 160 }}>
                  {renderHeaderContent(row.content, row)}
                </MantineTable.Th>
              ) : undefined}
              {row.cells.map((cell) => (
                <MantineTable.Td key={cell.token}>
                  {cell.content}
                </MantineTable.Td>
              ))}
              {hasRowAction ? (
                <MantineTable.Td>
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
                  ) : undefined}
                </MantineTable.Td>
              ) : undefined}
            </MantineTable.Tr>
          ))}
        </MantineTable.Tbody>
      </MantineTable>
    </Box>
  );
}
