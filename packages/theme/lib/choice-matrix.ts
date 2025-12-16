import type { ComponentType, ReactNode } from "react";

export type ChoiceMatrixColumn = {
  key: string;
  headerId?: string | undefined;
  label: ReactNode;
};

export type ChoiceMatrixCell = {
  key: string;
  content: ReactNode;
  selected?: boolean | undefined;
  disabled?: boolean | undefined;
};

export type ChoiceMatrixRow = {
  key: string;
  header: ReactNode;
  cells: ChoiceMatrixCell[];
  loading?: boolean | undefined;
  details?: ReactNode;
};

export type ChoiceMatrixProps = {
  orientation: "vertical" | "horizontal";
  columns: ChoiceMatrixColumn[];
  rows: ChoiceMatrixRow[];
  detailsGrid?: ReactNode;
  empty?: ReactNode;
};

export type ChoiceMatrixComponent = ComponentType<ChoiceMatrixProps>;
