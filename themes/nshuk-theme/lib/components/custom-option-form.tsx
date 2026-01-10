import { styled } from "@linaria/react";
import type { CustomOptionFormProperties } from "@aidbox-forms/theme";

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
        <button
          type="button"
          onClick={cancel.onClick}
          disabled={cancel.disabled}
          className="nhsuk-button nhsuk-button--secondary"
        >
          {cancel.label}
        </button>
        <button
          type="button"
          onClick={submit.onClick}
          disabled={submit.disabled}
          className="nhsuk-button nhsuk-button--secondary"
        >
          {submit.label}
        </button>
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
