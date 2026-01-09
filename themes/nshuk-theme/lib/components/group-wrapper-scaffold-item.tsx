import { styled } from "@linaria/react";
import { Children } from "react";
import type { GroupWrapperScaffoldItemProps } from "@aidbox-forms/theme";
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
    <Container>
      {content.length > 0 ? <Content>{content}</Content> : null}
      {errors}
      {onRemove ? (
        <Toolbar>
          <IconButton
            icon="−"
            onClick={onRemove}
            disabled={canRemove === false}
            label={removeText}
          />
        </Toolbar>
      ) : null}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Content = styled.div``;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
