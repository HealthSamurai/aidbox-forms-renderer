import "./boolean-question-control.css";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../../types.ts";
import { AnswerList } from "../../shared/answer-list.tsx";
import { QuestionScaffold } from "../question-scaffold.tsx";
import { RadioGroup } from "../../../../controls/radio-group.tsx";

const booleanOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

export const BooleanQuestionControl = observer(function BooleanQuestionControl({
  node,
}: {
  node: IQuestionNode<"boolean">;
}) {
  return (
    <QuestionScaffold
      node={node}
      className="af-node-boolean"
      answers={
        <AnswerList
          node={node}
          renderRow={({ value, setValue, inputId, labelId, describedById }) => (
            <RadioGroup
              name={inputId}
              value={value ?? null}
              options={booleanOptions}
              onChange={setValue}
              disabled={node.readOnly}
              ariaLabelledBy={labelId}
              ariaDescribedBy={describedById}
            />
          )}
        />
      }
    />
  );
});
