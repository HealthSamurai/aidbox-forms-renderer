import { observer } from "mobx-react-lite";
import { IQuestionNode } from "../../../stores/types.ts";
import { ItemHeader } from "../../common/item-header.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { NumberInput } from "../../controls/number-input.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";

export const IntegerNode = observer(function IntegerNode({
  item,
}: {
  item: IQuestionNode<"integer">;
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
            onChange={(next) =>
              setValue(next != null ? Math.round(next) : null)
            }
            disabled={item.readOnly}
            step={1}
            unitLabel={item.unitDisplay}
          />
        )}
      />
      <ItemErrors item={item} />
    </div>
  );
});
