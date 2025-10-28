import { observer } from "mobx-react-lite";
import { ItemHeader } from "../../common/item-header.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { TextInput } from "../../controls/text-input.tsx";
import { IQuestionStore } from "../../../stores/types.ts";

export const UrlNode = observer(function UrlNode({
  item,
}: {
  item: IQuestionStore<"url">;
}) {
  return (
    <div className="af-item" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, inputId, labelId, describedById }) => (
          <TextInput
            id={inputId}
            type="url"
            ariaLabelledBy={labelId}
            ariaDescribedBy={describedById}
            value={value ?? ""}
            onChange={setValue}
            disabled={item.readOnly}
            placeholder="https://example.com"
          />
        )}
      />
      <ItemErrors item={item} />
    </div>
  );
});
