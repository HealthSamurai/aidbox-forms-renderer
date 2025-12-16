import type { ComponentType, ReactNode } from "react";

export type GridTableColumn = {
  key: string;
  label: ReactNode;
};

export type GridTableCell = {
  key: string;
  content: ReactNode;
};

export type GridTableRow = {
  key: string;
  label: ReactNode;
  cells: GridTableCell[];
};

export type GridTableProps = {
  columns: GridTableColumn[];
  rows: GridTableRow[];
  empty?: ReactNode;
};

export type GridTableComponent = ComponentType<GridTableProps>;
