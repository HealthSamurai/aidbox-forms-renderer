import "./answer.css";
import { useCallback, ReactElement } from "react";
import { observer } from "mobx-react-lite";
import { ItemsList } from "./item-list.tsx";
import { Button } from "../controls/button.tsx";
import {
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

  return (
    <div className="af-answer">
      {renderRow({
        value: answer.value as AnswerValueType<T> | null,
        setValue: (value) => item.setAnswer(index, value),
        index,
        inputId: sanitizeForId(answer.key),
        labelId: getItemLabelId(item),
        describedById: getItemDescribedBy(item),
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
    </div>
  );
});
