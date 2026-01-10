import { styled } from "@linaria/react";
import type { GroupScaffoldProperties } from "@aidbox-forms/theme";
import { Children } from "react";
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
  let resolvedContent;
  if (content.length > 0) {
    resolvedContent = onRemove ? <div>{content}</div> : content;
  }
  return (
    <Container>
      {header}
      {resolvedContent}
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
      ) : undefined}
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
