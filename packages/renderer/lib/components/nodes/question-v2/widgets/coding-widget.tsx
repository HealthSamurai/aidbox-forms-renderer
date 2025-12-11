import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { CodingInput } from "../inputs/coding-input.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const CodingWidget = observer(function CodingWidget({
  node,
}: {
  node: IQuestionNode<"coding">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<"coding"> => {
    return (rowProps) => (
      <CodingInput
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        value={rowProps.value ?? null}
        onChange={rowProps.setValue}
        disabled={node.readOnly}
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
