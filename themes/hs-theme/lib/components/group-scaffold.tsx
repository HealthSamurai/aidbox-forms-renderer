import type { GroupScaffoldProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function GroupScaffold({
  linkId,
  header,
  children,
  dataControl,
}: GroupScaffoldProps) {
  return (
    <Container
      data-linkid={linkId}
      data-item-control={dataControl ?? undefined}
      data-control={dataControl ?? undefined}
    >
      {header ? <Header>{header}</Header> : null}
      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Header = styled.div``;

const Content = styled.div`
  display: grid;
  gap: 1rem;
`;
