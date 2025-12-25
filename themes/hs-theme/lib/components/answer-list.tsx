import { styled } from "@linaria/react";
import type { AnswerListProps } from "@aidbox-forms/theme";

export function AnswerList({ children, toolbar }: AnswerListProps) {
  return (
    <div>
      <List>{children}</List>
      {toolbar ? <Toolbar>{toolbar}</Toolbar> : null}
    </div>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Toolbar = styled.div`
  margin-top: 0.5rem;
`;
