import { observer } from "mobx-react-lite";
import { ItemHeader } from "../../common/item-header.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { Checkbox } from "../../controls/checkbox.tsx";
import { IQuestionStore } from "../../../stores/types.ts";

export const BooleanNode = observer(function BooleanNode({
  item,
}: {
  item: IQuestionStore<"boolean">;
}) {
  return (
    <div className="af-item af-item-boolean" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, inputId, labelId, describedById }) => {
          const ariaDescribedBy = describedById ?? undefined;
          return (
            <Checkbox
              id={inputId}
              checked={value ?? false}
              onChange={(checked) => setValue(checked)}
              disabled={item.readOnly}
              ariaLabelledBy={labelId}
              ariaDescribedBy={ariaDescribedBy}
            />
          );
        }}
      />
      <ItemErrors item={item} />
    </div>
  );
});
