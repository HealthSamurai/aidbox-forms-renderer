import "./group-wrapper-scaffold.css";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import type { IGroupWrapper } from "../../../types.ts";
import { NodeText } from "../../form/node-text.tsx";
import { Button } from "../../controls/button.tsx";
import { GroupWrapperScaffoldItem } from "./group-wrapper-scaffold-item.tsx";

export const GroupWrapperScaffold = observer(function GroupWrapperScaffold({
  wrapper,
  children,
}: {
  wrapper: IGroupWrapper;
  children?: ReactNode;
}) {
  return (
    <fieldset className="af-group" data-linkid={wrapper.linkId}>
      {wrapper.template.text ? <NodeText as="legend" node={wrapper} /> : null}
      <div className="af-group-node-list">
        {children ??
          wrapper.visibleNodes.map((node) => (
            <GroupWrapperScaffoldItem
              key={node.key}
              node={node}
              wrapper={wrapper}
            />
          ))}
      </div>
      <div className="af-group-node-list-toolbar">
        <Button
          type="button"
          variant="success"
          onClick={() => wrapper.addNode()}
          disabled={!wrapper.canAdd}
        >
          Add section
        </Button>
      </div>
    </fieldset>
  );
});
