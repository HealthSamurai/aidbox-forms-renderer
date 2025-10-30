import { observer } from "mobx-react-lite";
import { ItemHeader } from "../../common/item-header.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { IQuestionNode } from "../../../stores/types.ts";
import { TextArea } from "../../controls/text-area.tsx";

export const TextNode = observer(function TextNode({
  item,
}: {
  item: IQuestionNode<"text">;
}) {
  return (
    <div className="af-item" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, inputId, labelId, describedById }) => (
          <TextArea
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
