import type { ReactNode } from "react";
import type { LabelAs } from "@aidbox-forms/theme";

import type { IQuestionNode } from "../../types.ts";
import { NodeHeader } from "../node/node-header.tsx";
import { useTheme } from "../../ui/theme.tsx";
import { NodeErrors } from "../node/node-errors.tsx";

export type QuestionScaffoldProperties = {
  node: IQuestionNode;
  children: ReactNode;
  headerAs?: LabelAs | undefined;
};

export function QuestionScaffold({
  node,
  children,
  headerAs = "label",
}: QuestionScaffoldProperties) {
  const { QuestionScaffold: ThemedQuestionScaffold } = useTheme();

  return (
    <ThemedQuestionScaffold
      linkId={node.linkId}
      header={
        node.isHeaderless ? undefined : <NodeHeader node={node} as={headerAs} />
      }
      errors={node.hasErrors ? <NodeErrors node={node} /> : undefined}
    >
      {children}
    </ThemedQuestionScaffold>
  );
}
