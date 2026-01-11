import { styled } from "@linaria/react";
import type {
  AnswerRemoveButtonProperties,
  AnswerScaffoldProperties,
} from "@aidbox-forms/theme";
import { IconButton } from "./icon-button.tsx";

export function AnswerScaffold({
  control,
  onRemove,
  canRemove,
  errors,
  children,
}: AnswerScaffoldProperties) {
  return (
    <Container>
      {control}
      {onRemove && (
        <Toolbar>
          <AnswerRemoveButton
            onClick={onRemove}
            disabled={canRemove === false}
            text="Remove"
          />
        </Toolbar>
      )}
      <Indented>
        {children}
        {errors}
      </Indented>
    </Container>
  );
}

export function AnswerRemoveButton({
  onClick,
  disabled,
  text,
}: AnswerRemoveButtonProperties) {
  return (
    <IconButton icon="−" onClick={onClick} disabled={disabled} label={text} />
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Indented = styled.div`
  padding-left: 0.5rem;

  &:empty {
    display: none;
  }
`;
