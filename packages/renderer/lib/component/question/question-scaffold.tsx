import type { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import type { IQuestionNode } from "../../types.ts";
import { NodeHeader } from "../node/node-header.tsx";
import { useTheme } from "../../ui/theme.tsx";
import { renderErrors } from "../node/errors.tsx";
import { SignatureInput } from "../signature/signature-input.tsx";
import { buildId, getIssueErrorId, getNodeLabelId } from "../../utilities.ts";

export type QuestionScaffoldProperties = {
  node: IQuestionNode;
  children: ReactNode;
};

export const QuestionScaffold = observer(function QuestionScaffold({
  node,
  children,
}: QuestionScaffoldProperties) {
  const { QuestionScaffold: ThemedQuestionScaffold } = useTheme();
  const signature = node.signatureRequired ? (
    <SignatureInput
      id={buildId(node.token, "signature")}
      path={node.path}
      value={node.signature}
      onChange={(value) => {
        node.setSignature(value);
      }}
      ariaLabelledBy={getNodeLabelId(node)}
      ariaDescribedBy={getIssueErrorId(node)}
      disabled={node.readOnly}
    />
  ) : undefined;

  return (
    <ThemedQuestionScaffold
      linkId={node.linkId}
      path={node.path}
      header={
        node.isHeaderless ? undefined : <NodeHeader node={node} as="label" />
      }
      isExpandable={node.isExpandable}
      isExpanded={node.isExpanded}
      errors={renderErrors(node)}
      signature={signature}
      customExtensions={node.customExtensions}
    >
      {children}
    </ThemedQuestionScaffold>
  );
});
