import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerRenderer, AnswerRenderCallback } from "./answer-renderer.tsx";

export const AnswerList = observer(function AnswerList<T extends AnswerType>({
  node,
  render,
}: {
  node: IQuestionNode<T>;
  render: AnswerRenderCallback<T>;
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
        <AnswerRenderer key={answer.key} answer={answer} render={render} />
      ))}
      toolbar={toolbar}
    />
  );
});
