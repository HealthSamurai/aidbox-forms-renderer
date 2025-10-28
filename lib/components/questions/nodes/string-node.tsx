import { observer } from "mobx-react-lite";
import { ItemHeader } from "../../common/item-header.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { TextInput } from "../../controls/text-input.tsx";
import { IQuestionStore } from "../../../stores/types.ts";

export const StringNode = observer(function StringNode({
  item,
}: {
  item: IQuestionStore<"string">;
}) {
  return (
    <div className="af-item" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, inputId, labelId, describedById }) => (
          <TextInput
            id={inputId}
            ariaLabelledBy={labelId}
            ariaDescribedBy={describedById}
            value={value ?? ""}
            onChange={setValue}
            disabled={item.readOnly}
          />
        )}
      />
      <ItemErrors item={item} />
    </div>
  );
});
