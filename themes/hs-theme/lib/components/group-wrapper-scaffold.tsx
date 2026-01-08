import type { GroupWrapperScaffoldProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function GroupWrapperScaffold({
  linkId,
  header,
  children,
  toolbar,
}: GroupWrapperScaffoldProps) {
  return (
    <Container data-linkid={linkId}>
      {header ? <Header>{header}</Header> : null}
      <Items>{children}</Items>
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

const Items = styled.div`
  interpolate-size: allow-keywords;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0.75rem;
`;
