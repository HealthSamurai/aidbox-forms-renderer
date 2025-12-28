import { QuestionScaffold } from "../question-scaffold.tsx";
import type { QuestionRendererProps } from "../../../../types.ts";
import { strings } from "../../../../strings.ts";

export function UnsupportedRenderer({ node }: QuestionRendererProps) {
  return (
    <QuestionScaffold node={node}>
      {strings.unsupported.typePrefix} {node.type}
    </QuestionScaffold>
  );
}
