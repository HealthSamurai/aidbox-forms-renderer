import type { QuestionScaffoldProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

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
  margin-bottom: 1rem;
`;

const Header = styled.div`
  margin-bottom: 0.5rem;
`;
