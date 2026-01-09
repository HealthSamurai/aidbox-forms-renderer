import type { ReactNode } from "react";

export type IconButtonProps = {
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean | undefined;
  label: string;
};

export function IconButton({
  icon,
  onClick,
  disabled,
  label,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="nhsuk-button nhsuk-button--secondary"
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
