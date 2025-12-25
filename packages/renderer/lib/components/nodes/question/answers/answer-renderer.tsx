import type { ReactElement } from "react";
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
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IAnswerInstance,
} from "../../../../types.ts";

export type AnswerRenderCallbackProps<T extends AnswerType = AnswerType> = {
  value: DataTypeToType<AnswerTypeToDataType<T>> | null;
  setValue: (v: DataTypeToType<AnswerTypeToDataType<T>> | null) => void;
  inputId: string;
  labelId: string;
  describedById: string | undefined;
  answer: IAnswerInstance<T>;
};

// todo: use ComponentType when possible
export type AnswerRenderCallback<T extends AnswerType = AnswerType> = (
  props: AnswerRenderCallbackProps<T>,
) => ReactElement;

export const AnswerRenderer = observer(function AnswerRow<
  T extends AnswerType,
>({
  answer,
  render,
}: {
  answer: IAnswerInstance<T>;
  render: AnswerRenderCallback<T>;
}) {
  const { Button, AnswerRow: ThemedAnswerRow } = useTheme();
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

  return (
    <ThemedAnswerRow
      control={render({
        value: answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
        setValue: (value) => answer.setValueByUser(value),
        inputId: sanitizeForId(answer.key),
        labelId: getNodeLabelId(answer.question),
        describedById,
        answer: answer as IAnswerInstance<T>,
      })}
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
