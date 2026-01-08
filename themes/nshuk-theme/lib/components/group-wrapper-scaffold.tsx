import { styled } from "@linaria/react";
import type { GroupWrapperScaffoldProps } from "@aidbox-forms/theme";

export function GroupWrapperScaffold({
  linkId,
  header,
  children,
  toolbar,
}: GroupWrapperScaffoldProps) {
  return (
    <Container data-linkid={linkId}>
      {header ? <Header>{header}</Header> : null}
      {children}
      {toolbar ? <Toolbar>{toolbar}</Toolbar> : null}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Header = styled.div``;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
