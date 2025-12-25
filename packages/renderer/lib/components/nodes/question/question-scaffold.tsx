import type { ReactNode } from "react";
import type { IQuestionNode } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
import { QuestionErrors } from "./validation/question-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";

export type QuestionScaffoldProps = {
  node: IQuestionNode;
  children: ReactNode;
  showOptionsState?: boolean;
};

export function QuestionScaffold({
  node,
  children,
  showOptionsState,
}: QuestionScaffoldProps) {
  const { QuestionScaffold: ThemedQuestionScaffold } = useTheme();
  const header = <NodeHeader node={node} />;
  return (
    <ThemedQuestionScaffold linkId={node.linkId} header={header}>
      {showOptionsState ? <QuestionOptionsState node={node} /> : null}
      {children}
      <QuestionErrors node={node} />
    </ThemedQuestionScaffold>
  );
}

function QuestionOptionsState({ node }: { node: IQuestionNode }) {
  const { OptionsState } = useTheme();
  if (node.options.loading) {
    return <OptionsState isLoading error={undefined} />;
  }
  if (node.options.error) {
    return <OptionsState isLoading={false} error={node.options.error} />;
  }
  return null;
}
