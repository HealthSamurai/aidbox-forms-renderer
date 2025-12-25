import { styled } from "@linaria/react";
import type { NodeHeaderProps } from "@aidbox-forms/theme";

export function NodeHeader({
  label,
  ariaLabelledBy,
  htmlFor,
  required,
  help,
  legal,
  flyover,
}: NodeHeaderProps) {
  return (
    <Wrapper>
      <LabelRow>
        <Label id={ariaLabelledBy} htmlFor={htmlFor}>
          {label}
          {required ? <Required aria-hidden>*</Required> : null}
        </Label>
        {help}
        {legal}
        {flyover}
      </LabelRow>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-bottom: 0.25rem;
`;

const LabelRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
`;

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

const Required = styled.span`
  color: #e53e3e;
`;
