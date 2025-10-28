import { observer } from "mobx-react-lite";
import { IQuestionStore } from "../../../stores/types.ts";
import { ItemHeader } from "../../common/item-header.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { NumberInput } from "../../controls/number-input.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";

export const DecimalNode = observer(function DecimalNode({
  item,
}: {
  item: IQuestionStore<"decimal">;
}) {
  return (
    <div className="af-item" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, inputId, labelId, describedById }) => (
          <NumberInput
            id={inputId}
            ariaLabelledBy={labelId}
            ariaDescribedBy={describedById}
            value={value ?? null}
            onChange={setValue}
            disabled={item.readOnly}
            step="any"
          />
        )}
      />
      <ItemErrors item={item} />
    </div>
  );
});
