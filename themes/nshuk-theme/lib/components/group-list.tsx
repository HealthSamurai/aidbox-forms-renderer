import { styled } from "@linaria/react";
import type { GroupListProperties } from "@aidbox-forms/theme";
import { IconButton } from "./icon-button.tsx";

export function GroupList({
  linkId,
  header,
  children,
  onAdd,
  canAdd,
  addLabel,
}: GroupListProperties) {
  const addText = addLabel ?? "Add";
  return (
    <Container data-linkid={linkId}>
      {header}
      {children}
      {onAdd && (
        <Toolbar>
          <IconButton
            icon="＋"
            onClick={onAdd}
            disabled={canAdd === false}
            label={addText}
          />
        </Toolbar>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
