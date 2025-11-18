import "./group-scaffold.css";
import type { ReactNode } from "react";
import type { IGroupNode } from "../../../../types.ts";
import { NodeText } from "../../../form/node-text.tsx";
import { NodeErrors } from "../../../form/node-errors.tsx";

type GroupScaffoldProps = {
  node: IGroupNode;
  className: string;
  dataControl?: string | null | undefined;
  children: ReactNode;
};

export function GroupScaffold({
  node,
  className,
  dataControl,
  children,
}: GroupScaffoldProps) {
  return (
    <div className="flex flex-col gap-2">
      <fieldset
        className={className}
        data-linkid={node.linkId}
        data-item-control={dataControl}
      >
        {node.template.text ? <NodeText as="legend" node={node} /> : null}
        <div className="af-group-children">{children}</div>
      </fieldset>
      <NodeErrors node={node} />
    </div>
  );
}
