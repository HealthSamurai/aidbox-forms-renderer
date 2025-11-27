import "./question-scaffold.css";
import classNames from "classnames";
import type { ReactNode } from "react";
import type { IQuestionNode } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
import { NodeErrors } from "../../form/node-errors.tsx";

export type QuestionScaffoldProps = {
  node: IQuestionNode;
  className?: string;
  beforeAnswers?: ReactNode;
  answers: ReactNode;
  afterAnswers?: ReactNode;
  showOptionsStatus?: boolean;
};

export function QuestionScaffold({
  node,
  className,
  beforeAnswers,
  answers,
  afterAnswers,
  showOptionsStatus,
}: QuestionScaffoldProps) {
  return (
    <div className={classNames("af-node", className)} data-linkid={node.linkId}>
      <NodeHeader node={node} />
      {showOptionsStatus ? <QuestionOptionsStatus node={node} /> : null}
      {beforeAnswers}
      {answers}
      {afterAnswers}
      <NodeErrors node={node} />
    </div>
  );
}

function QuestionOptionsStatus({ node }: { node: IQuestionNode }) {
  if (node.options.loading) {
    return <div className="af-loading">Loading options…</div>;
  }
  if (node.options.error) {
    return (
      <div className="af-error">
        Failed to load options: {node.options.error}
      </div>
    );
  }
  return null;
}
