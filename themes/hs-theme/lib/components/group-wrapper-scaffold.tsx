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

const Container = styled.fieldset`
  border: 1px solid #cbd5f5;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const Header = styled.div`
  margin-bottom: 0.5rem;
`;

const Items = styled.div`
  interpolate-size: allow-keywords;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 1rem;
`;
