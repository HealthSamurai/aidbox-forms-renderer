import { styled } from "@linaria/react";
import type { QuestionScaffoldProperties } from "@aidbox-forms/theme";

export function QuestionScaffold({
  linkId,
  header,
  children,
}: QuestionScaffoldProperties) {
  return (
    <Container data-linkid={linkId}>
      {header}
      {children}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
