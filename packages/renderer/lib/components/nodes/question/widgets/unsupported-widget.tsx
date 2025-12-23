import { WidgetScaffold } from "../widget-scaffold.tsx";
import type { QuestionControlProps } from "../../../../types.ts";

export function UnsupportedWidget({ node }: QuestionControlProps) {
  return (
    <WidgetScaffold
      node={node}
      className="af-unsupported"
      body={`Unsupported type: ${node.type}`}
    />
  );
}
