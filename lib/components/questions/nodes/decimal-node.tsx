import { observer } from "mobx-react-lite";
import { IQuestionNode } from "../../../stores/types.ts";
import { ItemHeader } from "../../common/item-header.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { NumberInput } from "../../controls/number-input.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { AnswerOptionWrapper } from "../../common/answer-option-wrapper.tsx";

export const DecimalNode = observer(function DecimalNode({
  item,
}: {
  item: IQuestionNode<"decimal">;
}) {
  return (
    <div className="af-item" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={(rowProps) => (
          <AnswerOptionWrapper
            item={item}
            rowProps={rowProps}
            renderInput={(rowProps) => (
              <NumberInput
                id={rowProps.inputId}
                list={rowProps.list}
                ariaLabelledBy={rowProps.labelId}
                ariaDescribedBy={rowProps.describedById}
                value={rowProps.value ?? null}
                onChange={rowProps.setValue}
                disabled={item.readOnly}
                step="any"
                unitLabel={item.unitDisplay}
              />
            )}
          />
        )}
      />
      <ItemErrors item={item} />
    </div>
  );
});
