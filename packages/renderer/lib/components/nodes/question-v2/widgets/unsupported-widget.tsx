import { WidgetScaffold } from "../widget-scaffold.tsx";
import type { QuestionControlProps } from "../../../../types.ts";

export function UnsupportedWidget({ node }: QuestionControlProps) {
  return (
    <WidgetScaffold
      node={node}
      className="af-unsupported"
      body={
        <div>
          Unsupported type: <code>{node.type}</code>
        </div>
      }
    />
  );
}
