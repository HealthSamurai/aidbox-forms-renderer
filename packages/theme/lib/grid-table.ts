import type { ComponentType, ReactNode } from "react";

export type GridTableColumn = {
  token: string;
  label: ReactNode;
};

export type GridTableCell = {
  token: string;
  content: ReactNode;
};

export type GridTableRow = {
  token: string;
  label: ReactNode;
  cells: GridTableCell[];
};

export type GridTableProps = {
  columns: GridTableColumn[];
  rows: GridTableRow[];
  empty?: ReactNode;
};

export type GridTableComponent = ComponentType<GridTableProps>;
