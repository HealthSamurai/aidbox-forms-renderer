import { styled } from "@linaria/react";
import { Children } from "react";
import type { GroupWrapperScaffoldItemProps } from "@aidbox-forms/theme";

export function GroupWrapperScaffoldItem({
  children,
  errors,
  toolbar,
}: GroupWrapperScaffoldItemProps) {
  const content = Children.toArray(children);
  return (
    <Container>
      {content.length > 0 ? <Content>{content}</Content> : null}
      {errors}
      {toolbar ? <Toolbar>{toolbar}</Toolbar> : null}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Content = styled.div``;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
