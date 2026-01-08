import type { ReactNode } from "react";
import type { IGroupNode } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
import { NodeErrors } from "../../form/node-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";

export function GroupScaffold({
  node,
  dataControl,
  children,
}: {
  node: IGroupNode;
  dataControl?: string | undefined;
  children: ReactNode;
}) {
  const { GroupScaffold: ThemedGroupScaffold, NodeList } = useTheme();

  const header =
    !node.isHeaderless && node.template.text ? (
      <NodeHeader node={node} />
    ) : null;
  return (
    <ThemedGroupScaffold
      linkId={node.linkId}
      dataControl={dataControl}
      header={header}
    >
      <NodeList>{children}</NodeList>
      <NodeErrors node={node} />
    </ThemedGroupScaffold>
  );
}
