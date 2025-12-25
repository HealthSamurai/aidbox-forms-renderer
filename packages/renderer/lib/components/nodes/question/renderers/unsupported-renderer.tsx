import { QuestionScaffold } from "../question-scaffold.tsx";
import type { QuestionRendererProps } from "../../../../types.ts";

export function UnsupportedRenderer({ node }: QuestionRendererProps) {
  return (
    <QuestionScaffold node={node}>
      Unsupported type: {node.type}
    </QuestionScaffold>
  );
}
