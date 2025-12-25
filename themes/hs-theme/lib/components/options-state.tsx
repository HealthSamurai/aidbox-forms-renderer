import { styled } from "@linaria/react";
import type { OptionsStateProps } from "@aidbox-forms/theme";

export function OptionsState({ isLoading, error }: OptionsStateProps) {
  if (isLoading) {
    return <Hint role="status">Loading options…</Hint>;
  }
  if (error) {
    return (
      <ErrorMessage role="alert">Failed to load options: {error}</ErrorMessage>
    );
  }
  return null;
}

const Hint = styled.div`
  font-size: 0.875rem;
  color: #4a5568;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
`;
