import type { ReactNode } from "react";

import type { IQuestionNode } from "../../types.ts";
import { NodeHeader } from "../node/node-header.tsx";
import { useTheme } from "../../ui/theme.tsx";
import { NodeErrors } from "../node/node-errors.tsx";

export type QuestionScaffoldProperties = {
  node: IQuestionNode;
  children: ReactNode;
};

export function QuestionScaffold({
  node,
  children,
}: QuestionScaffoldProperties) {
  const { QuestionScaffold: ThemedQuestionScaffold } = useTheme();

  return (
    <ThemedQuestionScaffold
      linkId={node.linkId}
      header={
        node.isHeaderless ? undefined : <NodeHeader node={node} as="label" />
      }
      errors={node.hasErrors ? <NodeErrors node={node} /> : undefined}
    >
      {children}
    </ThemedQuestionScaffold>
  );
}
