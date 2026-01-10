import { QuestionScaffold } from "../question-scaffold.tsx";
import type { QuestionRendererProperties } from "../../../../types.ts";
import { strings } from "../../../../strings.ts";

export function UnsupportedRenderer({ node }: QuestionRendererProperties) {
  return (
    <QuestionScaffold node={node}>
      {strings.unsupported.typePrefix} {node.type}
    </QuestionScaffold>
  );
}
