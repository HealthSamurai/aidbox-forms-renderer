import type { ReactNode } from "react";
import type { IGroupNode } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
import { NodeErrors } from "../../form/node-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";

export function GroupScaffold({
  node,
  children,
  onRemove,
  canRemove,
  removeLabel,
}: {
  node: IGroupNode;
  children?: ReactNode;
  onRemove?: (() => void) | undefined;
  canRemove?: boolean | undefined;
  removeLabel?: string | undefined;
}) {
  const { GroupScaffold: ThemedGroupScaffold } = useTheme();

  const header = !node.isHeaderless ? (
    <NodeHeader node={node} as="legend" />
  ) : null;
  return (
    <ThemedGroupScaffold
      header={header}
      errors={<NodeErrors node={node} />}
      onRemove={onRemove}
      canRemove={canRemove}
      removeLabel={removeLabel}
    >
      {children}
    </ThemedGroupScaffold>
  );
}
