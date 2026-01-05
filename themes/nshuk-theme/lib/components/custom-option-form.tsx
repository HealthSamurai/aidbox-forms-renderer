import { styled } from "@linaria/react";
import type { CustomOptionFormProps } from "@aidbox-forms/theme";

export function CustomOptionForm({
  content,
  errors,
  submit,
  cancel,
}: CustomOptionFormProps) {
  return (
    <Stack>
      <div>{content}</div>
      {errors ?? null}
      <Actions>
        <ActionButton
          type="button"
          onClick={cancel.onClick}
          disabled={cancel.disabled}
          className="nhsuk-button nhsuk-button--secondary"
        >
          {cancel.label}
        </ActionButton>
        <ActionButton
          type="button"
          onClick={submit.onClick}
          disabled={submit.disabled}
          className="nhsuk-button nhsuk-button--secondary"
        >
          {submit.label}
        </ActionButton>
      </Actions>
    </Stack>
  );
}

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  &.nhsuk-button {
    margin: 0;
  }
`;
