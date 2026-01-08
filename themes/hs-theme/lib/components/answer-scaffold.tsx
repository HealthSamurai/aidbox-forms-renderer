import { styled } from "@linaria/react";
import type { AnswerScaffoldProps } from "@aidbox-forms/theme";

export function AnswerScaffold({
  control,
  toolbar,
  children,
}: AnswerScaffoldProps) {
  return (
    <Row>
      <MainRow>
        <Control>{control}</Control>
        {toolbar ? <Toolbar>{toolbar}</Toolbar> : null}
      </MainRow>
      {children ? <Children>{children}</Children> : null}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const MainRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const Control = styled.div`
  flex: 1;
  min-width: 0;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const Children = styled.div`
  border-left: 2px solid #e2e8f0;
  padding-left: 0.5rem;

  &:empty {
    display: none;
  }
`;
