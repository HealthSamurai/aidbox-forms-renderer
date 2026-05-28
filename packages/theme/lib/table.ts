import type { ComponentType, ReactNode } from "react";
import type { NodePath } from "./path.ts";

export type TableColumn = {
  token: string;
  content: ReactNode;
  width?: string | undefined;
  errors?: ReactNode | undefined;
  isLoading?: boolean | undefined;
};

export type TableCell = {
  token: string;
  content?: ReactNode;
};

export type TableRow = {
  token: string;
  path?: NodePath | undefined;
  content?: ReactNode | undefined;
  errors?: ReactNode | undefined;
  isLoading?: boolean | undefined;

  cells: TableCell[];
  onRemove?: (() => void) | undefined;
  canRemove?: boolean | undefined;
};

export type TableProperties = {
  columns: TableColumn[];
  rows: TableRow[];
};

export type TableComponent = ComponentType<TableProperties>;
