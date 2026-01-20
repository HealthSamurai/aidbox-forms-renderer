import { styled } from "@linaria/react";
import type { LabelProperties } from "@formbox/theme";

export function Label({
  prefix,
  children,
  id,
  htmlFor,
  required,
  help,
  legal,
  flyover,
  as = "label",
}: LabelProperties) {
  const labelTag = as === "label" ? "label" : "div";
  const labelFor = labelTag === "label" ? htmlFor : undefined;
  const labelRowTag = labelTag === "div" ? "div" : "span";
  const labelTextTag = labelTag === "div" ? "div" : "span";
  const isEmphasized = as !== "text";
  const isLegend = as === "legend";

  return (
    <Wrapper as={labelTag} htmlFor={labelFor}>
      <LabelRow as={labelRowTag}>
        <LabelText
          id={id}
          as={labelTextTag}
          data-emphasis={isEmphasized ? "true" : undefined}
          data-size={isLegend ? "legend" : undefined}
        >
          {prefix && <Prefix>{prefix}</Prefix>}
          {children}
          {required && <Required aria-hidden>*</Required>}
        </LabelText>
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

const LabelText = styled.span`
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

const Prefix = styled.span`
  font-weight: 600;
`;

const Required = styled.span`
  color: #e53e3e;
`;
