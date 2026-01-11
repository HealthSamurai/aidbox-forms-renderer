import type { ReactNode } from "react";
import type { IQuestionNode } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
import { QuestionErrors } from "./validation/question-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";

export type QuestionScaffoldProperties = {
  node: IQuestionNode;
  children: ReactNode;
  showOptionsLoading?: boolean;
};

export function QuestionScaffold({
  node,
  children,
  showOptionsLoading,
}: QuestionScaffoldProperties) {
  const { QuestionScaffold: ThemedQuestionScaffold } = useTheme();

  return (
    <ThemedQuestionScaffold
      linkId={node.linkId}
      header={
        node.isHeaderless ? undefined : <NodeHeader node={node} as="label" />
      }
    >
      {showOptionsLoading && <QuestionOptionsLoading node={node} />}
      {children}
      <QuestionErrors node={node} />
    </ThemedQuestionScaffold>
  );
}

function QuestionOptionsLoading({ node }: { node: IQuestionNode }) {
  const { OptionsLoading } = useTheme();
  if (node.answerOption.select.isLoading) {
    return <OptionsLoading isLoading />;
  }
  return;
}
