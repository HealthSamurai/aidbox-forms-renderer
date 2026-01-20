import { styled } from "@linaria/react";
import type { CustomOptionFormProperties } from "@formbox/theme";

export function CustomOptionForm({
  content,
  errors,
  submit,
  cancel,
}: CustomOptionFormProperties) {
  return (
    <Root>
      {content}
      {errors}

      <div className="nhsuk-button-group nhsuk-button-group--small nhsuk-u-margin-right-0">
        <button
          type="button"
          onClick={cancel.onClick}
          disabled={cancel.disabled}
          className="nhsuk-button nhsuk-button--small nhsuk-button--secondary"
        >
          {cancel.label}
        </button>
        <button
          type="button"
          onClick={submit.onClick}
          disabled={submit.disabled}
          className="nhsuk-button nhsuk-button--small nhsuk-button--secondary"
        >
          {submit.label}
        </button>
      </div>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--nhsuk-spacing-3);
`;
