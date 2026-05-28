import type { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../types.ts";
import { NodeHeader } from "../node/node-header.tsx";
import { renderErrors } from "../node/errors.tsx";
import { useTheme } from "../../ui/theme.tsx";
import { SignatureInput } from "../signature/signature-input.tsx";
import { buildId, getIssueErrorId, getNodeLabelId } from "../../utilities.ts";
import { isGroupListStore } from "../../store/group/group-list-store.ts";

export const GroupScaffold = observer(function GroupScaffold({
  node,
  children,
  onRemove,
  canRemove,
  hideSignature,
}: {
  node: IGroupNode;
  children?: ReactNode;
  onRemove?: (() => void) | undefined;
  canRemove?: boolean | undefined;
  hideSignature?: boolean | undefined;
}) {
  const { GroupScaffold: ThemedGroupScaffold } = useTheme();

  const header = node.isHeaderless ? undefined : (
    <NodeHeader node={node} as="legend" />
  );
  const repeatedGroupChildScaffold =
    canRemove === undefined && isGroupListStore(node.parentStore);
  const signature =
    !hideSignature && !repeatedGroupChildScaffold && node.signatureRequired ? (
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
    <ThemedGroupScaffold
      linkId={node.linkId}
      header={header}
      isExpandable={node.isExpandable}
      isExpanded={node.isExpanded}
      errors={repeatedGroupChildScaffold ? undefined : renderErrors(node)}
      signature={signature}
      onRemove={onRemove}
      canRemove={canRemove}
      path={node.path}
      customExtensions={node.customExtensions}
    >
      {children}
    </ThemedGroupScaffold>
  );
});
