import { QuestionScaffold } from "../question-scaffold.tsx";
import type { QuestionControlProps } from "../../../../types.ts";

export function UnsupportedRenderer({ node }: QuestionControlProps) {
  return (
    <QuestionScaffold node={node} children={`Unsupported type: ${node.type}`} />
  );
}
