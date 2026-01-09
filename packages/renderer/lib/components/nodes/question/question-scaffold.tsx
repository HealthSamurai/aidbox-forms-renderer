import type { ReactNode } from "react";
import type { IQuestionNode } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
import { QuestionErrors } from "./validation/question-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";

export type QuestionScaffoldProps = {
  node: IQuestionNode;
  children: ReactNode;
  showOptionsLoading?: boolean;
};

export function QuestionScaffold({
  node,
  children,
  showOptionsLoading,
}: QuestionScaffoldProps) {
  const { QuestionScaffold: ThemedQuestionScaffold } = useTheme();
  const header = node.isHeaderless ? null : (
    <NodeHeader node={node} as="label" />
  );
  return (
    <ThemedQuestionScaffold linkId={node.linkId} header={header}>
      {showOptionsLoading ? <QuestionOptionsLoading node={node} /> : null}
      {children}
      <QuestionErrors node={node} />
    </ThemedQuestionScaffold>
  );
}

function QuestionOptionsLoading({ node }: { node: IQuestionNode }) {
  const { OptionsLoading } = useTheme();
  if (node.answerOption.isLoading) {
    return <OptionsLoading isLoading />;
  }
  return null;
}
