import type { IQuestionNode } from "../../../../types.ts";
import { NodeErrors } from "../../../form/node-errors.tsx";

export function QuestionErrors({ node }: { node: IQuestionNode }) {
  return <NodeErrors node={node} />;
}
