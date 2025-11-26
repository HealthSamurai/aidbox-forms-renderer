import "./answer.css";
import { ReactElement, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { NodesList } from "../../../form/node-list.tsx";
import { Button } from "../../../controls/button.tsx";
import { AnswerErrors } from "./answer-errors.tsx";
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

export const Answer = observer(function Answer<T extends AnswerType>({
  node,
  renderRow,
  answer,
}: {
  node: IQuestionNode<T>;
  renderRow: (p: RowRenderProps<T>) => ReactElement;
  answer: IAnswerInstance<T>;
}) {
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
