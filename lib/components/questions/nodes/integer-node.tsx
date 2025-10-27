import { observer } from "mobx-react-lite";
import { IQuestionStore } from "../../../stores/types.ts";
import { ItemHeader } from "../../common/item-header.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { NumberInput } from "../../controls/number-input.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";

export const IntegerNode = observer(function IntegerNode({
  item,
}: {
  item: IQuestionStore<"integer">;
}) {
  return (
    <div className="af-item" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, inputId, labelId, describedById }) => {
          const ariaDescribedBy = describedById ?? undefined;
          return (
            <NumberInput
              id={inputId}
              ariaLabelledBy={labelId}
              ariaDescribedBy={ariaDescribedBy}
              value={value ?? null}
              onChange={(value) =>
                setValue(value != null ? Math.round(value) : null)
              }
              disabled={item.readOnly}
              step={1}
            />
          );
        }}
      />
      <ItemErrors item={item} />
    </div>
  );
});
