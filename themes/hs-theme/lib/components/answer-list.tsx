import { styled } from "@linaria/react";
import { Children } from "react";
import type { AnswerListProperties } from "@formbox/theme";
import { Plus } from "../icons/plus.tsx";
import { IconButton } from "./icon-button.tsx";

export function AnswerList({
  children,
  onAdd,
  canAdd,
  addLabel,
}: AnswerListProperties) {
  const items = Children.toArray(children);
  const addText = addLabel ?? "Add";
  return (
    <Container>
      {items.length > 0 && <List>{items}</List>}
      {onAdd && (
        <Toolbar>
          <IconButton
            icon={<Plus size={15} />}
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
  gap: 0.5rem;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
