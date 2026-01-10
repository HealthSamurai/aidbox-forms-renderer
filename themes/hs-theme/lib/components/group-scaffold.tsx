import type { GroupScaffoldProperties } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";
import { Children } from "react";
import { Trash } from "../icons/trash.tsx";
import { IconButton } from "./icon-button.tsx";

export function GroupScaffold({
  header,
  children,
  errors,
  onRemove,
  canRemove,
  removeLabel,
}: GroupScaffoldProperties) {
  const content = Children.toArray(children);
  const removeText = removeLabel ?? "Remove";
  return (
    <Container>
      {header}
      {content.length > 0 ? (
        onRemove ? (
          <ItemContent>{content}</ItemContent>
        ) : (
          <GroupContent>{content}</GroupContent>
        )
      ) : undefined}
      {errors}
      {onRemove ? (
        <Toolbar>
          <IconButton
            icon={<Trash />}
            onClick={onRemove}
            disabled={canRemove === false}
            label={removeText}
          />
        </Toolbar>
      ) : undefined}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GroupContent = styled.div`
  display: grid;
  gap: 1rem;
`;

const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
