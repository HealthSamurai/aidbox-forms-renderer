import { observer } from "mobx-react-lite";
import { IQuestionNode } from "../../../stores/types.ts";
import { ItemHeader } from "../../common/item-header.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { QuantityInput } from "../../controls/quantity-input.tsx";
import { AnswerOptionWrapper } from "../../common/answer-option-wrapper.tsx";

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
        renderRow={(rowProps) => (
          <AnswerOptionWrapper
            item={item}
            rowProps={rowProps}
            renderInput={(rowProps) => (
              <QuantityInput
                inputId={rowProps.inputId}
                value={rowProps.value}
                list={rowProps.list}
                onChange={(next) => {
                  rowProps.setValue(next);
                }}
                disabled={item.readOnly}
                ariaLabelledBy={rowProps.labelId}
                ariaDescribedBy={rowProps.describedById}
                unitOptions={item.unitOptions}
              />
            )}
          />
        )}
      />
      <ItemErrors item={item} />
    </div>
  );
});
