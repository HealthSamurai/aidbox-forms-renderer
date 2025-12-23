import type { ComponentType, ReactNode } from "react";

export type SelectionMatrixColumn = {
  key: string;
  headerId?: string | undefined;
  label: ReactNode;
};

export type SelectionMatrixCell = {
  key: string;
  content: ReactNode;
  selected?: boolean | undefined;
  disabled?: boolean | undefined;
};

export type SelectionMatrixRow = {
  key: string;
  header: ReactNode;
  cells: SelectionMatrixCell[];
  loading?: boolean | undefined;
  details?: ReactNode;
};

export type SelectionMatrixProps = {
  orientation: "vertical" | "horizontal";
  columns: SelectionMatrixColumn[];
  rows: SelectionMatrixRow[];
  detailsGrid?: ReactNode;
  empty?: ReactNode;
};

export type SelectionMatrixComponent = ComponentType<SelectionMatrixProps>;
