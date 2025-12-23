import type { GroupWrapperScaffoldItemProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function GroupWrapperScaffoldItem({
  children,
  errors,
  toolbar,
}: GroupWrapperScaffoldItemProps) {
  return (
    <Item>
      <Content>{children}</Content>
      {errors}
      {toolbar ? <Toolbar>{toolbar}</Toolbar> : null}
    </Item>
  );
}

const Item = styled.section`
  margin: 0 -1rem;
  padding: 0 1rem;
  overflow: clip;

  & + & {
    border-top: 1px solid #e2e8f0;
    margin-top: 1rem;
    padding-top: 1rem;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
`;
