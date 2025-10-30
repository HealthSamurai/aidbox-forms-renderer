import "./answer-list.css";
import { ReactElement, useCallback } from "react";
import { observer } from "mobx-react-lite";
import type {
  AnswerType,
  AnswerValueType,
  IQuestionNode,
} from "../../stores/types.ts";
import { Button } from "../controls/button.tsx";
import { Answer, RowRenderProps } from "./answer.tsx";

export type AnswerListProps<T extends AnswerType> = {
  item: IQuestionNode<T>;
  renderRow: (p: RowRenderProps<AnswerValueType<T>>) => ReactElement;
};

export const AnswerList = observer(function AnswerList<T extends AnswerType>({
  item,
  renderRow,
}: AnswerListProps<T>) {
  const answers = item.repeats ? item.answers : item.answers.slice(0, 1);
  const addAnswer = useCallback(() => item.addAnswer(), [item]);

  return (
    <>
      <div className="af-answer-list">
        {answers.map((answer, i) => (
          <Answer
            key={answer.key}
            index={i}
            item={item}
            answer={answer}
            renderRow={renderRow}
          />
        ))}
      </div>
      {item.repeats && (
        <div className="af-answer-list-toolbar">
          <Button
            type="button"
            variant="success"
            onClick={addAnswer}
            disabled={!item.canAdd}
          >
            Add another
          </Button>
        </div>
      )}
    </>
  );
});
