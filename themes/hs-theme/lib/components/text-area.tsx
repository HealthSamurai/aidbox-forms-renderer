import { css } from "@linaria/core";

const textAreaClass = css`
  width: 100%;
  min-height: 6rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;

  &:disabled {
    background: #edf2f7;
    cursor: not-allowed;
  }
`;

export function TextArea({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
}: {
  id?: string | undefined;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean | undefined;
  placeholder?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
}) {
  return (
    <textarea
      id={id}
      className={textAreaClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
  );
}
