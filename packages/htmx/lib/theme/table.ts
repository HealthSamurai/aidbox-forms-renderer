import { useStrings } from "@formbox/renderer";
import type { TableProperties } from "@formbox/theme";

import { type TableTemplateProperties } from "../template.ts";
import { tableColumn, tableRow } from "../template.ts";
import { renderTemplate } from "../theme-runtime.ts";
import { useHtml, useHtmxTheme } from "../theme-runtime.ts";

export function Table(properties: TableProperties) {
  const { templates } = useHtmxTheme();
  const renderHtml = useHtml();
  const strings = useStrings();
  const rows = properties.rows.map((row) => tableRow(row, renderHtml, strings));
  return renderTemplate(templates.Table, {
    columns: properties.columns.map((column) =>
      tableColumn(column, renderHtml),
    ),
    rows,
    hasRowHeader: rows.some(
      (row) => row.content || row.errors || row.removeAction,
    ),
  } satisfies TableTemplateProperties);
}
