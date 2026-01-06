import type { ComponentType } from "react";
import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { NodesList } from "../../../form/node-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import {
  getAnswerErrorId,
  getNodeDescribedBy,
  getNodeLabelId,
  safeJoin,
} from "../../../../utils.ts";
import {
  AnswerType,
  IAnswerInstance,
  ValueControlProps,
} from "../../../../types.ts";

export type AnswerRenderCallback<T extends AnswerType = AnswerType> =
  ComponentType<ValueControlProps<T>>;

export const AnswerScaffold = observer(function AnswerScaffold<
  T extends AnswerType,
>({
  answer,
  control,
}: {
  answer: IAnswerInstance<T>;
  control: AnswerRenderCallback<T>;
}) {
  const { AnswerRemoveButton, AnswerScaffold: ThemedAnswerScaffold } =
    useTheme();
  const handleRemove = useCallback(() => {
    answer.question.removeAnswer(answer);
  }, [answer]);

  const answerErrorId =
    answer.issues.length > 0 ? getAnswerErrorId(answer) : undefined;

  const ariaDescribedBy = safeJoin([
    getNodeDescribedBy(answer.question),
    answerErrorId,
  ]);

  const Component = control;

  return (
    <ThemedAnswerScaffold
      control={
        <Component
          id={answer.token}
          ariaLabelledBy={getNodeLabelId(answer.question)}
          ariaDescribedBy={ariaDescribedBy}
          answer={answer as IAnswerInstance<T>}
        />
      }
      toolbar={
        answer.question.repeats ? (
          <AnswerRemoveButton
            onClick={handleRemove}
            disabled={!answer.question.canRemove}
          >
            Remove
          </AnswerRemoveButton>
        ) : undefined
      }
      children={
        <>
          {!!answer.nodes?.length && <NodesList nodes={answer.nodes} />}
          <AnswerErrors answer={answer} />
        </>
      }
    />
  );
});
