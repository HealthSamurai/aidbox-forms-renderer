import type { FormEvent } from "react";
import type { FormProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function Form({
  onSubmit,
  onCancel,
  children,
  title,
  description,
  errors,
  before,
  after,
  pagination,
}: FormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };
  const handleCancel = onCancel ?? (() => {});
  const actions = (
    <>
      <ActionButton variant="primary" type="submit" disabled={!onSubmit}>
        Submit
      </ActionButton>
      <ActionButton
        variant="secondary"
        type="button"
        onClick={handleCancel}
        disabled={!onCancel}
      >
        Cancel
      </ActionButton>
    </>
  );
  const header =
    title || description ? (
      <header>
        {Boolean(title) && <h1 className="nhsuk-heading-l">{title}</h1>}
        {Boolean(description) && <p className="nhsuk-body">{description}</p>}
      </header>
    ) : null;

  if (pagination) {
    return (
      <FormElement onSubmit={handleSubmit}>
        {header && <TitleSlot>{header}</TitleSlot>}
        {Boolean(errors) && <Slot>{errors}</Slot>}
        {Boolean(before) && <Slot>{before}</Slot>}
        {children}
        <Controls>
          <Nav className="nhsuk-button-group">
            <button
              className="nhsuk-button nhsuk-button--secondary"
              type="button"
              onClick={pagination.onPrev}
              disabled={pagination.disabledPrev}
            >
              Previous
            </button>
            <span className="nhsuk-hint">
              {pagination.current} / {pagination.total}
            </span>
            <button
              className="nhsuk-button nhsuk-button--secondary"
              type="button"
              onClick={pagination.onNext}
              disabled={pagination.disabledNext}
            >
              Next
            </button>
          </Nav>
          <Actions>{actions}</Actions>
        </Controls>
        {Boolean(after) && <Slot>{after}</Slot>}
      </FormElement>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {header}
      {errors}
      {before}
      {children}
      {after}
      <div className="nhsuk-button-group">{actions}</div>
    </form>
  );
}

function ActionButton({
  variant,
  type = "button",
  onClick,
  disabled,
  children,
}: {
  variant: "primary" | "secondary";
  type?: "button" | "submit" | undefined;
  onClick?: (() => void) | undefined;
  disabled?: boolean | undefined;
  children: string;
}) {
  const className =
    variant === "primary"
      ? "nhsuk-button"
      : "nhsuk-button nhsuk-button--secondary";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}

const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitleSlot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Slot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:empty {
    display: none;
  }
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;
