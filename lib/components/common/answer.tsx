import "./answer.css";
import { useCallback, ReactElement } from "react";
import { observer } from "mobx-react-lite";
import { ItemsList } from "./item-list.tsx";
import { Button } from "../controls/button.tsx";
import { AnswerErrors } from "./answer-errors.tsx";
import {
  getAnswerErrorId,
  getItemDescribedBy,
  getItemLabelId,
  sanitizeForId,
} from "../../utils.ts";
import type {
  AnswerType,
  AnswerValueType,
  IAnswerInstance,
  IQuestionNode,
} from "../../stores/types.ts";

export type RowRenderProps<TValue> = {
  value: TValue | null;
  setValue: (v: TValue | null) => void;
  index: number;
  inputId: string;
  labelId: string;
  describedById: string | undefined;
  answer: IAnswerInstance<TValue>;
};

export type AnswerProps<T extends AnswerType> = {
  item: IQuestionNode<T>;
  renderRow: (p: RowRenderProps<AnswerValueType<T>>) => ReactElement;
  answer: IAnswerInstance<AnswerValueType<T>>;
  index: number;
};

export const Answer = observer(function Answer<T extends AnswerType>({
  item,
  renderRow,
  answer,
  index,
}: AnswerProps<T>) {
  const handleRemove = useCallback(() => {
    item.removeAnswer(index);
  }, [item, index]);

  const answerErrorId =
    answer.issues.length > 0 ? getAnswerErrorId(answer) : undefined;

  const describedByPieces = [
    getItemDescribedBy(item),
    answerErrorId,
  ].filter((value): value is string => Boolean(value));
  const describedById =
    describedByPieces.length > 0 ? describedByPieces.join(" ") : undefined;

  return (
    <div className="af-answer">
      {renderRow({
        value: answer.value as AnswerValueType<T> | null,
        setValue: (value) => item.setAnswer(index, value),
        index,
        inputId: sanitizeForId(answer.key),
        labelId: getItemLabelId(item),
        describedById,
        answer: answer as IAnswerInstance<AnswerValueType<T>>,
      })}
      {item.repeats && (
        <div className="af-answer-toolbar">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleRemove}
            disabled={!item.canRemove}
          >
            Remove
          </Button>
        </div>
      )}
      {!!answer.nodes?.length && (
        <div className="af-answer-children">
          <ItemsList items={answer.nodes} />
        </div>
      )}
      <AnswerErrors answer={answer} />
    </div>
  );
});
