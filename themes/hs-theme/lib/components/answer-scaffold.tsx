import { styled } from "@linaria/react";
import type { AnswerScaffoldProps } from "@aidbox-forms/theme";

export function AnswerScaffold({
  control,
  toolbar,
  children,
}: AnswerScaffoldProps) {
  return (
    <Row>
      <div>{control}</div>
      {toolbar ? <Toolbar>{toolbar}</Toolbar> : null}
      {children ? <Children>{children}</Children> : null}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const Children = styled.div`
  margin-left: 0.5rem;
  border-left: 2px solid #e2e8f0;
  padding-left: 0.5rem;
`;
