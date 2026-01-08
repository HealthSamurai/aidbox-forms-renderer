import { styled } from "@linaria/react";
import type { QuestionScaffoldProps } from "@aidbox-forms/theme";

export function QuestionScaffold({
  linkId,
  header,
  children,
}: QuestionScaffoldProps) {
  return (
    <Container data-linkid={linkId}>
      {header ? <Header>{header}</Header> : null}
      {children}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Header = styled.div``;
