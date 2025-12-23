import type { GroupActionsProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function GroupActions({ children }: GroupActionsProps) {
  return <Extras>{children}</Extras>;
}

const Extras = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
