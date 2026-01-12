import { styled } from "@linaria/react";
import type { AnswerScaffoldProperties } from "@aidbox-forms/theme";
import { Trash } from "../icons/trash.tsx";
import { IconButton } from "./icon-button.tsx";

export function AnswerScaffold({
  control,
  onRemove,
  canRemove,
  errors,
  children,
}: AnswerScaffoldProperties) {
  return (
    <Row>
      <MainRow>
        <Control>{control}</Control>
        {onRemove && (
          <Toolbar>
            <IconButton
              icon={<Trash />}
              onClick={onRemove}
              disabled={canRemove === false}
              label="Remove"
            />
          </Toolbar>
        )}
      </MainRow>
      <Children>
        {children}
        {errors}
      </Children>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const MainRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const Control = styled.div`
  flex: 1;
  min-width: 0;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const Children = styled.div`
  padding: 0.75rem 0 0 0.75rem;

  &:empty {
    display: none;
  }
`;
