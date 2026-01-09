import { styled } from "@linaria/react";
import type { GroupScaffoldProps } from "@aidbox-forms/theme";

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
      {header}
      {children}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
