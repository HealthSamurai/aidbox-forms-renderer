import { styled } from "@linaria/react";
import type { GroupScaffoldProperties } from "@aidbox-forms/theme";
import { Children } from "react";

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
      {onRemove && (
        <div className="nhsuk-button-group">
          <button
            type="button"
            onClick={onRemove}
            disabled={canRemove === false}
            className="nhsuk-button nhsuk-button--secondary nhsuk-button--small"
          >
            {removeText}
          </button>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--nhsuk-spacing-3);
`;
