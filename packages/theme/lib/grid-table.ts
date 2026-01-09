import type { ComponentType, ReactNode } from "react";

export type GridTableColumn = {
  token: string;
  label: ReactNode;
  labelId?: string;
};

export type GridTableCell = {
  token: string;
  content?: ReactNode;
};

export type GridTableRow = {
  token: string;
  label: ReactNode;
  labelId?: string;
  cells: GridTableCell[];
  onRemove?: (() => void) | undefined;
  canRemove?: boolean | undefined;
  removeLabel?: string | undefined;
};

export type GridTableProps = {
  columns: GridTableColumn[];
  rows: GridTableRow[];
  empty?: ReactNode;
};

export type GridTableComponent = ComponentType<GridTableProps>;
