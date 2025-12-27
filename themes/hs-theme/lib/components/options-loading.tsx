import { styled } from "@linaria/react";
import type { OptionsLoadingProps } from "@aidbox-forms/theme";

export function OptionsLoading({ isLoading }: OptionsLoadingProps) {
  if (isLoading) {
    return <Hint role="status">Loading options…</Hint>;
  }
  return null;
}

const Hint = styled.div`
  font-size: 0.875rem;
  color: #4a5568;
`;
