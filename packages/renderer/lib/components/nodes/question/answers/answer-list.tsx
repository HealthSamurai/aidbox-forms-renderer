import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerScaffold, AnswerRenderCallback } from "./answer-scaffold.tsx";

export const AnswerList = observer(function AnswerList<T extends AnswerType>({
  node,
  control,
}: {
  node: IQuestionNode<T>;
  control: AnswerRenderCallback<T>;
}) {
  const { AnswerAddButton, AnswerList: ThemedAnswerList } = useTheme();
  const answers = node.repeats ? node.answers : node.answers.slice(0, 1);
  const addAnswer = useCallback(() => node.addAnswer(), [node]);

  const toolbar = node.repeats ? (
    <AnswerAddButton onClick={addAnswer} disabled={!node.canAdd}>
      Add another
    </AnswerAddButton>
  ) : undefined;

  return (
    <ThemedAnswerList toolbar={toolbar}>
      {answers.map((answer) => (
        <AnswerScaffold key={answer.key} answer={answer} control={control} />
      ))}
    </ThemedAnswerList>
  );
});
