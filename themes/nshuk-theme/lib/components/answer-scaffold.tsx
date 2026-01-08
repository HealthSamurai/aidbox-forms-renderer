import { styled } from "@linaria/react";
import type { AnswerScaffoldProps } from "@aidbox-forms/theme";

export function AnswerScaffold({
  control,
  toolbar,
  children,
}: AnswerScaffoldProps) {
  return (
    <Container>
      {control}
      {toolbar ? <Toolbar>{toolbar}</Toolbar> : null}
      {children ? <Indented>{children}</Indented> : null}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Indented = styled.div`
  padding-left: 0.5rem;
`;
