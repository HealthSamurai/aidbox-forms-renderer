import type { ComponentType, ReactNode } from "react";

export type TableColumn = {
  token: string;
  content: ReactNode;
  errors?: ReactNode | undefined;
  isLoading?: boolean | undefined;
};

export type TableCell = {
  token: string;
  content?: ReactNode;
};

export type TableRow = {
  token: string;
  content: ReactNode;
  errors?: ReactNode | undefined;
  isLoading?: boolean | undefined;

  cells: TableCell[];
  onRemove?: (() => void) | undefined;
  canRemove?: boolean | undefined;
  removeLabel?: string | undefined;
};

export type TableProperties = {
  columns: TableColumn[];
  rows: TableRow[];
};

export type TableComponent = ComponentType<TableProperties>;
