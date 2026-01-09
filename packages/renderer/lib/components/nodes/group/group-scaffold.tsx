import type { ReactNode } from "react";
import type { IGroupNode } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
import { NodeErrors } from "../../form/node-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";
import { isGroupWrapper } from "../../../stores/nodes/groups/group-wrapper.ts";

export function GroupScaffold({
  node,
  dataControl,
  children,
}: {
  node: IGroupNode;
  dataControl?: string | undefined;
  children: ReactNode;
}) {
  const { GroupScaffold: ThemedGroupScaffold } = useTheme();
  const parentIsWrapper = isGroupWrapper(node.parentStore);

  const header =
    !node.isHeaderless && node.template.text && !parentIsWrapper ? (
      <NodeHeader node={node} as="legend" />
    ) : null;
  return (
    <ThemedGroupScaffold
      linkId={node.linkId}
      dataControl={dataControl}
      header={header}
    >
      {children}
      <NodeErrors node={node} />
    </ThemedGroupScaffold>
  );
}
