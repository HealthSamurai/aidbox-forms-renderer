import { observer } from "mobx-react-lite";
import type { IGroupNode } from "../../../types.ts";
import { NodeList } from "../../node/node-list.tsx";
import { useTheme } from "@aidbox-forms/renderer/ui/theme.tsx";

export const FooterControl = observer(function FooterControl({
  node,
}: {
  node: IGroupNode;
}) {
  const { Footer: ThemedFooter } = useTheme();

  return (
    <ThemedFooter linkId={node.linkId}>
      <NodeList nodes={node.visibleNodes} />
    </ThemedFooter>
  );
});
