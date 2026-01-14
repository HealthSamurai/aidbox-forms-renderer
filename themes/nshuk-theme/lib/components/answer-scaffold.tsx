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
    <Column>
      <MainRow>
        <ControlColumn>
          {control}
          {errors}
        </ControlColumn>
        {onRemove && (
          <Remove>
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
          </Remove>
        )}
      </MainRow>
      <Children>{children}</Children>
    </Column>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--nhsuk-spacing-5);
`;

const MainRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: calc(var(--nhsuk-spacing-1) + var(--nhsuk-spacing-2));
`;

const ControlColumn = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
`;

const Remove = styled.div`
  display: flex;
`;

const Children = styled.div`
  padding-left: var(--nhsuk-spacing-5);

  &:empty {
    display: none;
  }
`;
