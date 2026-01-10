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
      <PrimaryButton type="submit" disabled={!onSubmit}>
        Submit
      </PrimaryButton>
      <SecondaryButton
        type="button"
        onClick={handleCancel}
        disabled={!onCancel}
      >
        Cancel
      </SecondaryButton>
    </>
  );
  const header =
    title || description ? (
      <Header>
        {Boolean(title) && <Title>{title}</Title>}
        {Boolean(description) && <Description>{description}</Description>}
      </Header>
    ) : null;

  if (pagination) {
    return (
      <FormElement onSubmit={handleSubmit}>
        {header && <TitleSlot>{header}</TitleSlot>}
        {Boolean(errors) && <Slot>{errors}</Slot>}
        {Boolean(before) && <Slot>{before}</Slot>}
        {children}
        <Controls>
          <Nav>
            <NavButton
              type="button"
              onClick={pagination.onPrev}
              disabled={pagination.disabledPrev}
            >
              Previous
            </NavButton>
            <span>
              {pagination.current} / {pagination.total}
            </span>
            <NavButton
              type="button"
              onClick={pagination.onNext}
              disabled={pagination.disabledNext}
            >
              Next
            </NavButton>
          </Nav>
          <Actions>{actions}</Actions>
        </Controls>
        {Boolean(after) && <Slot>{after}</Slot>}
      </FormElement>
    );
  }

  return (
    <FormElement onSubmit={handleSubmit}>
      {header && <TitleSlot>{header}</TitleSlot>}
      {Boolean(errors) && <Slot>{errors}</Slot>}
      {Boolean(before) && <Slot>{before}</Slot>}
      {children}
      {Boolean(after) && <Slot>{after}</Slot>}
      <Actions>{actions}</Actions>
    </FormElement>
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

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h1`
  display: block;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Description = styled.p`
  display: block;
  color: #4a5568;
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

const BaseButton = styled.button`
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

const PrimaryButton = styled(BaseButton)`
  background: #2563eb;
  color: #fff;
  border-color: #1d4ed8;
`;

const SecondaryButton = styled(BaseButton)`
  background: #edf2f7;
  color: #1a202c;
  border-color: #cbd5e0;
`;

const NavButton = styled.button`
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

  background: #edf2f7;
  color: #1a202c;
  border-color: #cbd5e0;
`;
