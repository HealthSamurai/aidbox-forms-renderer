import { styled } from "@linaria/react";
import type { FormHeaderProps } from "@aidbox-forms/theme";

export function FormHeader({ title, description }: FormHeaderProps) {
  if (!title && !description) return null;
  return (
    <Header>
      {title ? <Title>{title}</Title> : null}
      {description ? <Description>{description}</Description> : null}
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h1`
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Description = styled.p`
  display: block;
  color: #4a5568;
`;
