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
  as = "label",
}: NodeHeaderProps) {
  const labelTag = as === "label" ? "label" : "div";
  const labelFor = labelTag === "label" ? htmlFor : undefined;
  const labelRowTag = labelTag === "div" ? "div" : "span";
  const labelTextTag = labelTag === "div" ? "div" : "span";
  const isEmphasized = as !== "text";
  const isLegend = as === "legend";

  return (
    <Wrapper as={labelTag} htmlFor={labelFor}>
      <LabelRow as={labelRowTag}>
        <Label
          as={labelTextTag}
          id={ariaLabelledBy}
          data-emphasis={isEmphasized ? "true" : undefined}
          data-size={isLegend ? "legend" : undefined}
        >
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

const Wrapper = styled.label`
  display: block;
  margin: 0;
  padding: 0;
  border: 0;
`;

const LabelRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &[data-emphasis="true"] {
    font-weight: 600;
  }

  &[data-size="legend"] {
    font-size: 1.25rem;
  }
`;

const Required = styled.span`
  color: #e53e3e;
`;
