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
  IQuestionNode,
} from "../../../../types.ts";

export type RowRenderProps<T extends AnswerType = AnswerType> = {
  value: DataTypeToType<AnswerTypeToDataType<T>> | null;
  setValue: (v: DataTypeToType<AnswerTypeToDataType<T>> | null) => void;
  inputId: string;
  labelId: string;
  describedById: string | undefined;
  answer: IAnswerInstance<T>;
};

export type AnswerRowRenderer<T extends AnswerType = AnswerType> = (
  rowProps: RowRenderProps<T>,
) => ReactElement;

export const AnswerRow = observer(function AnswerRow<T extends AnswerType>({
  node,
  renderRow,
  answer,
}: {
  node: IQuestionNode<T>;
  renderRow: (p: RowRenderProps<T>) => ReactElement;
  answer: IAnswerInstance<T>;
}) {
  const { Button, AnswerRow: ThemedAnswerRow } = useTheme();
  const handleRemove = useCallback(() => {
    node.removeAnswer(answer);
  }, [node, answer]);

  const answerErrorId =
    answer.issues.length > 0 ? getAnswerErrorId(answer) : undefined;

  const describedByPieces = [getNodeDescribedBy(node), answerErrorId].filter(
    (value): value is string => Boolean(value),
  );
  const describedById =
    describedByPieces.length > 0 ? describedByPieces.join(" ") : undefined;

  return (
    <ThemedAnswerRow
      control={renderRow({
        value: answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
        setValue: (value) => answer.setValueByUser(value),
        inputId: sanitizeForId(answer.key),
        labelId: getNodeLabelId(node),
        describedById,
        answer: answer as IAnswerInstance<T>,
      })}
      toolbar={
        node.repeats ? (
          <Button
            type="button"
            variant="danger"
            onClick={handleRemove}
            disabled={!node.canRemove}
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
