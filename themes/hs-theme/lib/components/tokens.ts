import { css } from "@linaria/core";

export const inputClass = css`
  width: 100%;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;

  &:disabled {
    background: #edf2f7;
    cursor: not-allowed;
  }
`;
