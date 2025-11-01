import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../stores/types.ts";
import { ItemHeader } from "../../common/item-header.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { useAnswerOptions } from "../hooks/use-answer-options.ts";

export const AnswerOptionNode = observer(function AnswerOptionNode<
  T extends AnswerType,
>({ item }: { item: IQuestionNode<T> }) {
  const { options, getKeyForValue, getValueForKey, getLegacyOptionForValue } =
    useAnswerOptions(item);
  return (
    <div className="af-item" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      {options.length > 0 ? (
        <AnswerList
          item={item}
          renderRow={({
            value,
            setValue,
            inputId,
            labelId,
            describedById,
            answer,
          }) => {
            const regularKey = getKeyForValue(value);
            const legacyOption =
              regularKey || value == null
                ? null
                : getLegacyOptionForValue(answer.key, value);
            const selectValue = regularKey || legacyOption?.key || "";
            return (
              <select
                id={inputId}
                className="af-input"
                value={selectValue}
                onChange={(event) => {
                  const key = event.target.value;
                  const nextValue = key ? getValueForKey(key) : null;
                  setValue(nextValue);
                }}
                disabled={item.readOnly}
                aria-labelledby={labelId}
                aria-describedby={describedById}
              >
                <option value="">Select an option</option>
                {legacyOption ? (
                  <option
                    key={legacyOption.key}
                    value={legacyOption.key}
                    disabled
                  >
                    {legacyOption.label}
                  </option>
                ) : null}
                {options.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.label}
                  </option>
                ))}
              </select>
            );
          }}
        />
      ) : (
        <div className="af-empty">No answer options configured.</div>
      )}
      <ItemErrors item={item} />
    </div>
  );
});
