import { observer } from "mobx-react-lite";
import { ItemHeader } from "../../common/item-header.tsx";
import { ItemErrors } from "../../common/item-errors.tsx";
import { AnswerList } from "../../common/answer-list.tsx";
import { TextInput } from "../../controls/text-input.tsx";
import { IQuestionNode } from "../../../stores/types.ts";
import type { Reference } from "fhir/r5";

function pruneReference(value: Reference): Reference | null {
  const next: Reference = { ...value };
  for (const key of Object.keys(next) as (keyof Reference)[]) {
    if (next[key] === undefined || next[key] === null || next[key] === "") {
      delete next[key];
    }
  }
  return Object.keys(next).length > 0 ? next : null;
}

export const ReferenceNode = observer(function ReferenceNode({
  item,
}: {
  item: IQuestionNode<"reference">;
}) {
  return (
    <div className="af-item" data-linkid={item.linkId}>
      <ItemHeader item={item} />
      <AnswerList
        item={item}
        renderRow={({ value, setValue, labelId, describedById }) => {
          const reference = value ?? {};
          const handleReferenceChange = (nextRef: string) => {
            const draft: Reference = {
              ...reference,
              reference: nextRef || undefined,
            };
            setValue(pruneReference(draft));
          };

          const handleDisplayChange = (nextDisplay: string) => {
            const draft: Reference = {
              ...reference,
              display: nextDisplay || undefined,
            };
            setValue(pruneReference(draft));
          };

          return (
            <div>
              <TextInput
                ariaLabelledBy={labelId}
                ariaDescribedBy={describedById}
                value={reference.reference ?? ""}
                onChange={handleReferenceChange}
                disabled={item.readOnly}
                placeholder="Resource/type/id"
              />
              <TextInput
                ariaLabelledBy={labelId}
                ariaDescribedBy={describedById}
                value={reference.display ?? ""}
                onChange={handleDisplayChange}
                disabled={item.readOnly}
                placeholder="Display label"
              />
            </div>
          );
        }}
      />
      <ItemErrors item={item} />
    </div>
  );
});
