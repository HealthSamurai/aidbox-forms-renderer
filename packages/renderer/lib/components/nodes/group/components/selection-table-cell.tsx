import { observer } from "mobx-react-lite";
import type {
  ITableStore,
  OptionAxisItem,
  QuestionAxisItem,
} from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { useCallback } from "react";
import { buildId } from "../../../../utilities.ts";

export const SelectionTableCell = observer(function SelectionTableCell({
  store,
  questionAxis,
  option,
  optionLabelId,
}: {
  store: ITableStore;
  questionAxis: QuestionAxisItem;
  option: OptionAxisItem;
  optionLabelId: string;
}) {
  const { Checkbox, RadioButton } = useTheme();
  const cell = store.getCellState(questionAxis.token, option.token);

  const toggleCell = useCallback(
    () => store.toggleCell(questionAxis.token, option.token),
    [store, questionAxis.token, option.token],
  );

  if (!cell) {
    return;
  }

  const groupName = buildId(questionAxis.token, "table");
  const ariaLabelledBy = `${questionAxis.ariaLabelledBy} ${optionLabelId}`;
  const controlId = buildId(questionAxis.token, option.token, "control");

  return questionAxis.question.repeats ? (
    <Checkbox
      id={controlId}
      checked={cell.selected}
      disabled={cell.disabled}
      onChange={toggleCell}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={questionAxis.ariaDescribedBy}
    />
  ) : (
    <RadioButton
      id={controlId}
      groupName={groupName}
      value={option.token}
      checked={cell.selected}
      disabled={cell.disabled}
      onChange={toggleCell}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={questionAxis.ariaDescribedBy}
    />
  );
});
