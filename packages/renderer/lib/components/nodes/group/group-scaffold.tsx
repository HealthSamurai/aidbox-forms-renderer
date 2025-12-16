import type { ReactNode } from "react";
import type { IGroupNode } from "../../../types.ts";
import { getNodeLabelParts } from "../../form/node-text.tsx";
import { NodeErrors } from "../../form/node-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";

type GroupScaffoldProps = {
  node: IGroupNode;
  dataControl?: string | null | undefined;
  children: ReactNode;
};

export function GroupScaffold({
  node,
  dataControl,
  children,
}: GroupScaffoldProps) {
  const { GroupContainer, NodesContainer } = useTheme();
  const { labelText } = getNodeLabelParts(node);
  return (
    <GroupContainer
      linkId={node.linkId}
      dataControl={dataControl ?? undefined}
      legend={node.template.text ? labelText : null}
    >
      <NodesContainer>{children}</NodesContainer>
      <NodeErrors node={node} />
    </GroupContainer>
  );
}
