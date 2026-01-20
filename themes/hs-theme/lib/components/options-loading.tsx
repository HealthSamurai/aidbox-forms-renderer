import { styled } from "@linaria/react";
import type { OptionsLoadingProperties } from "@formbox/theme";

export function OptionsLoading({ isLoading }: OptionsLoadingProperties) {
  if (isLoading) {
    return <Hint role="status">Loading options…</Hint>;
  }
  return;
}

const Hint = styled.div`
  font-size: 0.875rem;
  color: #4a5568;
`;
