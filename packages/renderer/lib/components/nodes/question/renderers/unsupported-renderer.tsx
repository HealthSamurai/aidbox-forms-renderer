import { QuestionScaffold } from "../question-scaffold.tsx";
import type { QuestionControlProps } from "../../../../types.ts";

export function UnsupportedRenderer({ node }: QuestionControlProps) {
  return (
    <QuestionScaffold
      node={node}
      className="af-unsupported"
      body={`Unsupported type: ${node.type}`}
    />
  );
}
