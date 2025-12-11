import "./widget-scaffold.css";
import classNames from "classnames";
import type { ReactNode } from "react";
import type { IQuestionNode } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
import { QuestionErrors } from "./validation/question-errors.tsx";

export type WidgetScaffoldProps = {
  node: IQuestionNode;
  className?: string;
  beforeBody?: ReactNode;
  body: ReactNode;
  afterBody?: ReactNode;
  showOptionsStatus?: boolean;
};

export function WidgetScaffold({
  node,
  className,
  beforeBody,
  body,
  afterBody,
  showOptionsStatus,
}: WidgetScaffoldProps) {
  return (
    <div className={classNames("af-node", className)} data-linkid={node.linkId}>
      <NodeHeader node={node} />
      {showOptionsStatus ? <QuestionOptionsStatus node={node} /> : null}
      {beforeBody}
      {body}
      {afterBody}
      <QuestionErrors node={node} />
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
