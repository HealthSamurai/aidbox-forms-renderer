import { css } from "@linaria/core";

export const inputClass = css`
  width: 100%;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;

  &:focus,
  &:focus-visible {
    border-color: #3182ce;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.35);
    outline: none;
  }

  &:disabled {
    background: #edf2f7;
    cursor: not-allowed;
  }
`;
