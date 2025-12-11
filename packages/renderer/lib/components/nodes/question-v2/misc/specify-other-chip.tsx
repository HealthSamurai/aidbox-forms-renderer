import type { ReactNode } from "react";

type SpecifyOtherChipProps = {
  label: ReactNode;
  onRemove: () => void;
  disabled?: boolean;
};

export function SpecifyOtherChip({
  label,
  onRemove,
  disabled,
}: SpecifyOtherChipProps) {
  return (
    <span className="af-chip">
      <span className="af-chip__label">{label}</span>
      <button
        type="button"
        className="af-chip__remove"
        onClick={onRemove}
        aria-label="Remove value"
        disabled={disabled}
      >
        ×
      </button>
    </span>
  );
}
