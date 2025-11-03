import React from "react";
import { observer } from "mobx-react-lite";
import { ItemHeader } from "../../common/item-header.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { IQuestionNode } from "../../../stores/types.ts";
import type { Coding } from "fhir/r5";

function codingKey(coding: Coding) {
  return [coding.system ?? "", coding.code ?? "", coding.display ?? ""].join(
    "::",
  );
}

export const CodingNode = observer(function CodingNode({
  item,
}: {
  item: IQuestionNode<"coding">;
}) {
  const options = React.useMemo(
    () =>
      item.answerOptions
        .map((option) => option.valueCoding)
        .filter((coding): coding is Coding => Boolean(coding)),
    [item.answerOptions],
  );

  const optionMap = React.useMemo(() => {
    const map = new Map<string, Coding>();
    for (const coding of options) {
      map.set(codingKey(coding), coding);
    }
    return map;
  }, [options]);

  const hasChoices = options.length > 0;

  return (
    <div className="af-item" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      {hasChoices ? (
        <AnswerList
          item={item}
          renderRow={({ value, setValue, inputId, labelId, describedById }) => (
            <select
              id={inputId}
              className="af-input"
              value={value ? codingKey(value) : ""}
              onChange={(event) => {
                const nextKey = event.target.value;
                if (!nextKey) {
                  setValue(null);
                  return;
                }
                setValue(optionMap.get(nextKey) ?? null);
              }}
              disabled={item.readOnly}
              aria-labelledby={labelId}
              aria-describedby={describedById}
            >
              <option value="">Select an option</option>
              {options.map((coding) => {
                const key = codingKey(coding);
                const label = coding.display ?? coding.code ?? key;
                return (
                  <option key={key} value={key}>
                    {label}
                  </option>
                );
              })}
            </select>
          )}
        />
      ) : (
        <div className="af-empty">No answer options configured.</div>
      )}
      <ItemErrors item={item} />
    </div>
  );
});
