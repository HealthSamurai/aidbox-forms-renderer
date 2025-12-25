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
  sanitizeForId,
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
  const { Button, AnswerScaffold: ThemedAnswerScaffold } = useTheme();
  const handleRemove = useCallback(() => {
    answer.question.removeAnswer(answer);
  }, [answer]);

  const answerErrorId =
    answer.issues.length > 0 ? getAnswerErrorId(answer) : undefined;

  const describedByPieces = [
    getNodeDescribedBy(answer.question),
    answerErrorId,
  ].filter((value): value is string => Boolean(value));
  const describedById =
    describedByPieces.length > 0 ? describedByPieces.join(" ") : undefined;

  const Component = control;

  return (
    <ThemedAnswerScaffold
      control={
        <Component
          inputId={sanitizeForId(answer.key)}
          labelId={getNodeLabelId(answer.question)}
          describedById={describedById}
          answer={answer as IAnswerInstance<T>}
        />
      }
      toolbar={
        answer.question.repeats ? (
          <Button
            type="button"
            variant="danger"
            onClick={handleRemove}
            disabled={!answer.question.canRemove}
          >
            Remove
          </Button>
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
