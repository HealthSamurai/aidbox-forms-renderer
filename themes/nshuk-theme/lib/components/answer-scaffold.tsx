import type { AnswerScaffoldProperties } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function AnswerScaffold({
  control,
  onRemove,
  canRemove,
  errors,
  children,
}: AnswerScaffoldProperties) {
  return (
    <Row>
      {errors}
      {control}
      {children}
      {onRemove && (
        <div className="nhsuk-button-group">
          <button
            type="button"
            onClick={onRemove}
            disabled={canRemove === false}
            className="nhsuk-button nhsuk-button--secondary nhsuk-button--small"
          >
            Remove
          </button>
        </div>
      )}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: calc(var(--nhsuk-spacing-1) + var(--nhsuk-spacing-2));
`;
