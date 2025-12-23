import type { ReactNode } from "react";
import type { IGroupNode } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
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
  const { GroupScaffold: ThemedGroupScaffold, NodeList } = useTheme();
  const header = node.template.text ? <NodeHeader node={node} /> : null;
  return (
    <ThemedGroupScaffold
      linkId={node.linkId}
      dataControl={dataControl ?? undefined}
      header={header}
    >
      <NodeList>{children}</NodeList>
      <NodeErrors node={node} />
    </ThemedGroupScaffold>
  );
}
