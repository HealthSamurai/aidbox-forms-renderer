import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { ReferenceInput } from "../inputs/reference-input.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const ReferenceWidget = observer(function ReferenceWidget({
  node,
}: {
  node: IQuestionNode<"reference">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"reference"> => {
    return (rowProps) => (
      <ReferenceInput
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        value={rowProps.value ?? null}
        onChange={rowProps.setValue}
        disabled={node.readOnly}
        placeholder={node.placeholder}
      />
    );
  }, [node]);

  return (
    <WidgetScaffold
      node={node}
      body={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
