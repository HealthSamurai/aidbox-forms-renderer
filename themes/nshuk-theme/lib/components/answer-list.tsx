import { styled } from "@linaria/react";
import { Children } from "react";
import type { AnswerListProps } from "@aidbox-forms/theme";

export function AnswerList({ children, toolbar }: AnswerListProps) {
  const items = Children.toArray(children);
  return (
    <Container>
      {items.length > 0 ? <List>{items}</List> : null}
      {toolbar ? <Toolbar>{toolbar}</Toolbar> : null}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
