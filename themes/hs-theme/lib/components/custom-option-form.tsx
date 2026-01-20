import { styled } from "@linaria/react";
import type { CustomOptionFormProperties } from "@formbox/theme";

export function CustomOptionForm({
  content,
  errors,
  submit,
  cancel,
}: CustomOptionFormProperties) {
  return (
    <Stack>
      <div>{content}</div>
      {errors ?? undefined}
      <Actions>
        <CancelButton
          type="button"
          onClick={cancel.onClick}
          disabled={cancel.disabled}
        >
          {cancel.label}
        </CancelButton>
        <SubmitButton
          type="button"
          onClick={submit.onClick}
          disabled={submit.disabled}
        >
          {submit.label}
        </SubmitButton>
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
  cursor: pointer;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CancelButton = styled(ActionButton)`
  background: #edf2f7;
  color: #1a202c;
  border-color: #cbd5e0;
`;

const SubmitButton = styled(ActionButton)`
  background: #38a169;
  color: #fff;
  border-color: #2f855a;
`;
