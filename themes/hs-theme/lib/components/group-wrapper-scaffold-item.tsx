import type { GroupWrapperScaffoldItemProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";
import { Children } from "react";
import { Trash } from "../icons/trash.tsx";
import { IconButton } from "./icon-button.tsx";

export function GroupWrapperScaffoldItem({
  children,
  errors,
  onRemove,
  canRemove,
  removeLabel,
}: GroupWrapperScaffoldItemProps) {
  const content = Children.toArray(children);
  const removeText = removeLabel ?? "Remove";
  return (
    <Item>
      {content.length > 0 ? <Content>{content}</Content> : null}
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
      ) : null}
    </Item>
  );
}

const Item = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
