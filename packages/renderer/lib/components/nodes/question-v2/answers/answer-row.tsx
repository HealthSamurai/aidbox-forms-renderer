import "./answer.css";
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
  list?: string | undefined;
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
  const { Button } = useTheme();
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
    <div className="af-answer">
      {renderRow({
        value: answer.value as DataTypeToType<AnswerTypeToDataType<T>> | null,
        setValue: (value) => answer.setValueByUser(value),
        inputId: sanitizeForId(answer.key),
        labelId: getNodeLabelId(node),
        describedById,
        answer: answer as IAnswerInstance<T>,
      })}
      {node.repeats && (
        <div className="af-answer-toolbar">
          <Button
            type="button"
            variant="danger"
            onClick={handleRemove}
            disabled={!node.canRemove}
          >
            Remove
          </Button>
        </div>
      )}
      {!!answer.nodes?.length && (
        <div className="af-answer-children">
          <NodesList nodes={answer.nodes} />
        </div>
      )}
      <AnswerErrors answer={answer} />
    </div>
  );
});
