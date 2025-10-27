import { observer } from "mobx-react-lite";
import { IQuestionStore } from "../../../stores/types.ts";
import { DateInput } from "../../controls/date-input.tsx";
import { DateTimeInput } from "../../controls/date-time-input.tsx";
import { TimeInput } from "../../controls/time-input.tsx";
import { ItemHeader } from "../../common/item-header.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";

export const DateLikeNode = observer(function DateLikeNode({
  item,
}: {
  item: IQuestionStore<"date" | "dateTime" | "time">;
}) {
  const Control =
    item.type === "date"
      ? DateInput
      : item.type === "dateTime"
        ? DateTimeInput
        : TimeInput;

  return (
    <div className="af-item" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, inputId, labelId, describedById }) => {
          const ariaDescribedBy = describedById ?? undefined;
          return (
            <Control
              id={inputId}
              ariaLabelledBy={labelId}
              ariaDescribedBy={ariaDescribedBy}
              value={value ?? ""}
              onChange={setValue}
              disabled={item.readOnly}
            />
          );
        }}
      />
      <ItemErrors item={item} />
    </div>
  );
});
