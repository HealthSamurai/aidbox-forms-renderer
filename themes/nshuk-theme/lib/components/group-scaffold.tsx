import { styled } from "@linaria/react";
import type { GroupScaffoldProps } from "@aidbox-forms/theme";
import { Children } from "react";
import { IconButton } from "./icon-button.tsx";

export function GroupScaffold({
  header,
  children,
  errors,
  onRemove,
  canRemove,
  removeLabel,
}: GroupScaffoldProps) {
  const content = Children.toArray(children);
  const removeText = removeLabel ?? "Remove";
  return (
    <Container>
      {header}
      {content.length > 0 ? onRemove ? <div>{content}</div> : content : null}
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

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
