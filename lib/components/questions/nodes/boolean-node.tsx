import { observer } from "mobx-react-lite";
import { ItemHeader } from "../../common/item-header.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { RadioGroup } from "../../controls/radio-group.tsx";
import { IQuestionNode } from "../../../stores/types.ts";

const booleanOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

export const BooleanNode = observer(function BooleanNode({
  item,
}: {
  item: IQuestionNode<"boolean">;
}) {
  return (
    <div className="af-item af-item-boolean" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, inputId, labelId, describedById }) => (
          <RadioGroup
            name={inputId}
            value={value ?? null}
            options={booleanOptions}
            onChange={(next) => setValue(next)}
            disabled={item.readOnly}
            ariaLabelledBy={labelId}
            ariaDescribedBy={describedById}
          />
        )}
      />
      <ItemErrors item={item} />
    </div>
  );
});
