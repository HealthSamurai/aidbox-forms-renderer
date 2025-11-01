import { observer } from "mobx-react-lite";
import { IQuestionNode } from "../../../stores/types.ts";
import { ItemHeader } from "../../common/item-header.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { QuantityInput } from "../../controls/quantity-input.tsx";

export const QuantityNode = observer(function QuantityNode({
  item,
}: {
  item: IQuestionNode<"quantity">;
}) {
  return (
    <div className="af-item af-item-quantity" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, inputId, labelId, describedById }) => (
          <QuantityInput
            inputId={inputId}
            value={value}
            onChange={(next) => setValue(next)}
            disabled={item.readOnly}
            ariaLabelledBy={labelId}
            ariaDescribedBy={describedById}
            unitOptions={item.unitOptions}
          />
        )}
      />
      <ItemErrors item={item} />
    </div>
  );
});
