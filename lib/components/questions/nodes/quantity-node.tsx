import { observer } from "mobx-react-lite";
import { IQuestionStore } from "../../../stores/types.ts";
import { ItemHeader } from "../../common/item-header.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { NumberInput } from "../../controls/number-input.tsx";
import { TextInput } from "../../controls/text-input.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";

export const QuantityNode = observer(function QuantityNode({
  item,
}: {
  item: IQuestionStore<"quantity">;
}) {
  return (
    <div className="af-item af-item-quantity" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, labelId, describedById }) => (
          <div className="af-quantity-grid">
            <NumberInput
              ariaLabelledBy={labelId}
              ariaDescribedBy={describedById}
              value={value?.value ?? null}
              step="any"
              onChange={(x) =>
                setValue({ ...(value ?? {}), value: x ?? undefined })
              }
              disabled={item.readOnly}
            />
            <TextInput
              ariaLabelledBy={labelId}
              ariaDescribedBy={describedById}
              value={value?.unit ?? ""}
              onChange={(t) => setValue({ ...(value ?? {}), unit: t })}
              disabled={item.readOnly}
              placeholder="unit"
            />
          </div>
        )}
      />
      <ItemErrors item={item} />
    </div>
  );
});
