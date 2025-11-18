import "./repeating-group-scaffold.css";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import type { IRepeatingGroupWrapper } from "../../../../types.ts";
import { NodeText } from "../../../form/node-text.tsx";
import { Button } from "../../../controls/button.tsx";
import { RepeatingGroupNode } from "./repeating-group-node.tsx";

export type RepeatingGroupScaffoldProps = {
  wrapper: IRepeatingGroupWrapper;
  children?: ReactNode;
};

export const RepeatingGroupScaffold = observer(function RepeatingGroupScaffold({
  wrapper,
  children,
}: RepeatingGroupScaffoldProps) {
  return (
    <fieldset className="af-group" data-linkid={wrapper.linkId}>
      {wrapper.template.text ? <NodeText as="legend" node={wrapper} /> : null}
      <div className="af-group-node-list">
        {children ??
          wrapper.visibleNodes.map((node) => (
            <RepeatingGroupNode key={node.key} node={node} wrapper={wrapper} />
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
