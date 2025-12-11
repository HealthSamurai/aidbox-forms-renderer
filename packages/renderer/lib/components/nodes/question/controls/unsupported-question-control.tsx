import { QuestionScaffold } from "../question-scaffold.tsx";

import { QuestionControlProps } from "../../../../types.ts";

export function UnsupportedQuestionControl({ node }: QuestionControlProps) {
  return (
    <QuestionScaffold
      node={node}
      className="af-unsupported"
      answers={
        <div>
          Unsupported type: <code>{node.type}</code>
        </div>
      }
    />
  );
}
