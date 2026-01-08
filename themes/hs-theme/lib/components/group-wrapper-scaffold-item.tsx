import type { GroupWrapperScaffoldItemProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";
import { Children } from "react";

export function GroupWrapperScaffoldItem({
  children,
  errors,
  toolbar,
}: GroupWrapperScaffoldItemProps) {
  const content = Children.toArray(children);
  return (
    <Item>
      {content.length > 0 ? <Content>{content}</Content> : null}
      {errors}
      {toolbar ? <Toolbar>{toolbar}</Toolbar> : null}
    </Item>
  );
}

const Item = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
