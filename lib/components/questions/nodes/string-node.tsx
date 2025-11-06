import { observer } from "mobx-react-lite";
import { ItemHeader } from "../../common/item-header.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { TextInput } from "../../controls/text-input.tsx";
import { IQuestionNode } from "../../../stores/types.ts";
import { AnswerOptionWrapper } from "../../common/answer-option-wrapper.tsx";

export const StringNode = observer(function StringNode({
  item,
}: {
  item: IQuestionNode<"string">;
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
              <TextInput
                id={rowProps.inputId}
                list={rowProps.list}
                ariaLabelledBy={rowProps.labelId}
                ariaDescribedBy={rowProps.describedById}
                value={rowProps.value ?? ""}
                onChange={rowProps.setValue}
                disabled={item.readOnly}
                inputMode={item.keyboardType}
              />
            )}
          />
        )}
      />
      <ItemErrors item={item} />
    </div>
  );
});
