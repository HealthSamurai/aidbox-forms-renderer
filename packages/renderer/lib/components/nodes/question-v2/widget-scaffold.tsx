import type { ReactNode } from "react";
import type { IQuestionNode } from "../../../types.ts";
import { NodeHeader } from "../../form/node-header.tsx";
import { QuestionErrors } from "./validation/question-errors.tsx";
import { useTheme } from "../../../ui/theme.tsx";

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
  const { NodeWrapper } = useTheme();
  return (
    <NodeWrapper linkId={node.linkId} className={className}>
      <NodeHeader node={node} />
      {showOptionsStatus ? <QuestionOptionsStatus node={node} /> : null}
      {beforeBody}
      {body}
      {afterBody}
      <QuestionErrors node={node} />
    </NodeWrapper>
  );
}

function QuestionOptionsStatus({ node }: { node: IQuestionNode }) {
  const { OptionsStatus } = useTheme();
  if (node.options.loading) {
    return <OptionsStatus loading error={undefined} />;
  }
  if (node.options.error) {
    return <OptionsStatus loading={false} error={node.options.error} />;
  }
  return null;
}
