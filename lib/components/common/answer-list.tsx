import "./answer-list.css";
import React, { ReactNode } from "react";
import { Observer, observer } from "mobx-react-lite";
import type {
  AnswerableQuestionType,
  AnswerValueFor,
  IAnswerInstance,
  IQuestionStore,
} from "../../stores/types.ts";
import { ItemsList } from "./item-list.tsx";
import {
  getItemDescribedBy,
  getItemLabelId,
  sanitizeForId,
} from "../../utils.ts";

export type RowRenderProps<TValue> = {
  value: TValue | null;
  setValue: (v: TValue | null) => void;
  index: number;
  inputId: string;
  labelId: string;
  describedById: string | undefined;
  answer: IAnswerInstance<TValue>;
};

export type AnswerListProps<T extends AnswerableQuestionType> = {
  item: IQuestionStore<T>;
  renderRow: (p: RowRenderProps<AnswerValueFor<T>>) => ReactNode;
};

export const AnswerList = observer(function AnswerList<
  T extends AnswerableQuestionType,
>({ item, renderRow }: AnswerListProps<T>) {
  const baseId = React.useId();
  const labelId = getItemLabelId(item);
  const describedById = getItemDescribedBy(item);

  if (!item.repeats) {
    const answer = item.answers.at(0);
    if (answer) {
      return (
        <div className="af-answer-list">
          <div className="af-answer">
            <Observer>
              {() => {
                return renderRow({
                  value: answer.value,
                  setValue: (v) => {
                    item.setAnswer(0, v);
                  },
                  index: 0,
                  inputId: `${sanitizeForId(answer.path)}-${baseId}`,
                  labelId,
                  answer,
                  describedById,
                });
              }}
            </Observer>
            {!!answer.children?.length && (
              <div className="af-answer-children">
                <ItemsList items={answer.children} />
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <div className="af-answer-list">
      {item.answers.map((answer, i) => {
        return (
          <div className="af-answer" key={answer.key}>
            <Observer>
              {() =>
                renderRow({
                  value: answer.value,
                  setValue: (v) => item.setAnswer(i, v),
                  index: i,
                  inputId: `${sanitizeForId(answer.path)}-${baseId}`,
                  labelId,
                  answer: answer,
                  describedById,
                })
              }
            </Observer>
            <div className="af-answer-toolbar">
              <button
                type="button"
                className="af-answer-remove"
                onClick={() => item.removeAnswer(i)}
                disabled={!item.canRemove}
              >
                Remove
              </button>
            </div>
            {!!answer.children?.length && (
              <div className="af-answer-children">
                <ItemsList items={answer.children} />
              </div>
            )}
          </div>
        );
      })}
      <div className="af-answer-list-toolbar">
        <button
          type="button"
          className="af-answer-add"
          onClick={() => item.addAnswer()}
          disabled={!item.canAdd}
        >
          Add another
        </button>
      </div>
    </div>
  );
});
