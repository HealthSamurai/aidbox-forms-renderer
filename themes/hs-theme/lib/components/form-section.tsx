import { styled } from "@linaria/react";
import type { FormSectionProps } from "@aidbox-forms/theme";

export function FormSection({
  children,
  variant = "default",
}: FormSectionProps) {
  return <Section data-variant={variant}>{children}</Section>;
}

const Section = styled.section`
  &[data-variant="header"] {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  &[data-variant="footer"] {
    padding-top: 0.5rem;
    border-top: 1px solid #e2e8f0;
  }
`;
