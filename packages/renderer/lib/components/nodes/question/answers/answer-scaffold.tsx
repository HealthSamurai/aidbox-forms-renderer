import type { ComponentType } from "react";
import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { NodeList } from "../../../form/node-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import {
  concatIds,
  getAnswerErrorId,
  getNodeErrorId,
  getNodeHelpId,
  getNodeLabelId,
  buildId,
} from "../../../../utilities.ts";
import {
  AnswerType,
  IAnswer,
  ValueControlProperties,
} from "../../../../types.ts";

export type AnswerRenderCallback<T extends AnswerType = AnswerType> =
  ComponentType<ValueControlProperties<T>>;

export const AnswerScaffold = observer(function AnswerScaffold<
  T extends AnswerType,
>({
  answer,
  control,
}: {
  answer: IAnswer<T>;
  control: AnswerRenderCallback<T>;
}) {
  const { AnswerScaffold: ThemedAnswerScaffold } = useTheme();
  const handleRemove = useCallback(() => {
    answer.question.removeAnswer(answer);
  }, [answer]);

  const Component = control;

  return (
    <ThemedAnswerScaffold
      control={
        <Component
          id={buildId(answer.token, "control")}
          ariaLabelledBy={getNodeLabelId(answer.question)}
          ariaDescribedBy={concatIds(
            getNodeHelpId(answer.question),
            getNodeErrorId(answer.question),
            getAnswerErrorId(answer),
          )}
          answer={answer as IAnswer<T>}
        />
      }
      onRemove={answer.question.repeats ? handleRemove : undefined}
      canRemove={
        answer.question.repeats ? answer.question.canRemove : undefined
      }
      errors={<AnswerErrors answer={answer} />}
      children={<NodeList nodes={answer.nodes} />}
    />
  );
});
