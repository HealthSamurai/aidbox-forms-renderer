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
  const { Button, AnswerList: ThemedAnswerList } = useTheme();
  const answers = node.repeats ? node.answers : node.answers.slice(0, 1);
  const addAnswer = useCallback(() => node.addAnswer(), [node]);

  const toolbar = node.repeats && (
    <Button
      type="button"
      variant="success"
      onClick={addAnswer}
      disabled={!node.canAdd}
    >
      Add another
    </Button>
  );

  return (
    <ThemedAnswerList
      answers={answers.map((answer) => (
        <AnswerRow
          key={answer.key}
          node={node}
          answer={answer}
          renderRow={renderRow}
        />
      ))}
      toolbar={toolbar}
    />
  );
});
