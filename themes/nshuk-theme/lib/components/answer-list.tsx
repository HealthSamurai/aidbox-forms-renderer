import { styled } from "@linaria/react";
import type { AnswerListProperties } from "@formbox/theme";

export function AnswerList({
  children,
  onAdd,
  canAdd,
  addLabel,
}: AnswerListProperties) {
  const addText = addLabel ?? "Add";
  return (
    <Container>
      {children}
      {onAdd && (
        <div className="nhsuk-button-group">
          <button
            type="button"
            onClick={onAdd}
            disabled={canAdd === false}
            className="nhsuk-button nhsuk-button--secondary nhsuk-button--small"
          >
            {addText}
          </button>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--nhsuk-spacing-2);
`;
