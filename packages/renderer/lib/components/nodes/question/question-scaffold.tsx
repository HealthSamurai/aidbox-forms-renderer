import type { ReactNode } from "react";
import type { IQuestionNode } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
import { QuestionErrors } from "./validation/question-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";

export type QuestionScaffoldProps = {
  node: IQuestionNode;
  className?: string;
  body: ReactNode;
  showOptionsState?: boolean;
};

export function QuestionScaffold({
  node,
  className,
  body,
  showOptionsState,
}: QuestionScaffoldProps) {
  const { NodeWrapper } = useTheme();
  return (
    <NodeWrapper linkId={node.linkId} className={className}>
      <NodeHeader node={node} />
      {showOptionsState ? <QuestionOptionsState node={node} /> : null}
      {body}
      <QuestionErrors node={node} />
    </NodeWrapper>
  );
}

function QuestionOptionsState({ node }: { node: IQuestionNode }) {
  const { OptionsState } = useTheme();
  if (node.options.loading) {
    return <OptionsState loading error={undefined} />;
  }
  if (node.options.error) {
    return <OptionsState loading={false} error={node.options.error} />;
  }
  return null;
}
