import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../../types.ts";
import { NodeList } from "../../node/node-list.tsx";
import { useTheme } from "@aidbox-forms/renderer/ui/theme.tsx";

export const HeaderControl = observer(function HeaderControl({
  node,
}: {
  node: IGroupNode;
}) {
  const { Header: ThemedHeader } = useTheme();

  return (
    <ThemedHeader linkId={node.linkId}>
      <NodeList nodes={node.visibleNodes} />
    </ThemedHeader>
  );
});
