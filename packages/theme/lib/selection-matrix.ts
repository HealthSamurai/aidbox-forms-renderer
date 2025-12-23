import type { ComponentType, ReactNode } from "react";

export type SelectionMatrixColumn = {
  key: string;
  headerId?: string | undefined;
  label: ReactNode;
};

export type SelectionMatrixControl = {
  id: string;
  name: string;
  type: "radio" | "checkbox";
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
  labelledBy: string;
  describedBy?: string | undefined;
  ariaLabel?: string | undefined;
};

export type SelectionMatrixCell = {
  key: string;
  control?: SelectionMatrixControl;
  placeholder?: string;
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
