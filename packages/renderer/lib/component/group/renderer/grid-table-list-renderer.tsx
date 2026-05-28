import { observer } from "mobx-react-lite";

import type { GroupListRendererProperties } from "../../../types.ts";
import { NodeHeader } from "../../node/node-header.tsx";
import { useTheme } from "../../../ui/theme.tsx";
import { GridTableControl } from "../control/grid-table-control.tsx";
import { renderErrors } from "../../node/errors.tsx";

export const GridTableListRenderer = observer(function GridTableListRenderer({
  node,
}: GroupListRendererProperties) {
  const { GroupScaffold: ThemedGroupScaffold, GroupList: ThemedGroupList } =
    useTheme();
  const header =
    node.text || node.shortText ? (
      <NodeHeader node={node} as="legend" />
    ) : undefined;

  return (
    <ThemedGroupScaffold
      header={header}
      isExpanded={node.isExpanded}
      errors={renderErrors(node)}
      customExtensions={node.customExtensions}
    >
      <ThemedGroupList
        linkId={node.linkId}
        onAdd={() => node.addNode()}
        canAdd={node.canAdd}
        path={node.path}
        count={node.nodes.length}
        customExtensions={node.customExtensions}
      >
        <GridTableControl list={node} />
      </ThemedGroupList>
    </ThemedGroupScaffold>
  );
});
