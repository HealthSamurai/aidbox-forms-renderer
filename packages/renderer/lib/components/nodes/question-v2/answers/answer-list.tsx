import "./answer-list.css";
import type { ReactElement } from "react";
import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerRow, type RowRenderProps } from "./answer-row.tsx";

export const AnswerList = observer(function AnswerList<T extends AnswerType>({
  node,
  renderRow,
}: {
  node: IQuestionNode<T>;
  renderRow: (p: RowRenderProps<T>) => ReactElement;
}) {
  const { Button } = useTheme();
  const answers = node.repeats ? node.answers : node.answers.slice(0, 1);
  const addAnswer = useCallback(() => node.addAnswer(), [node]);

  return (
    <>
      <div className="af-answer-list">
        {answers.map((answer) => (
          <AnswerRow
            key={answer.key}
            node={node}
            answer={answer}
            renderRow={renderRow}
          />
        ))}
      </div>
      {node.repeats && (
        <div className="af-answer-list-toolbar">
          <Button
            type="button"
            variant="success"
            onClick={addAnswer}
            disabled={!node.canAdd}
          >
            Add another
          </Button>
        </div>
      )}
    </>
  );
});
