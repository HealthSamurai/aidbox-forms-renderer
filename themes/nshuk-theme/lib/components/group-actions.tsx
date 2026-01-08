import { styled } from "@linaria/react";
import type { GroupActionsProps } from "@aidbox-forms/theme";

export function GroupActions({ children }: GroupActionsProps) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
