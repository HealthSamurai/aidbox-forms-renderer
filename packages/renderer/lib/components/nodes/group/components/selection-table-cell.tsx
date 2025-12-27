import type {
  CheckboxComponent,
  RadioButtonComponent,
} from "@aidbox-forms/theme";
import { observer } from "mobx-react-lite";
import type {
  ITableStore,
  OptionAxisItem,
  QuestionAxisItem,
} from "../../../../types.ts";

type SelectionTableCellProps = {
  store: ITableStore;
  questionAxis: QuestionAxisItem;
  option: OptionAxisItem;
  optionLabelId: string;
  groupName: string;
  Checkbox: CheckboxComponent;
  RadioButton: RadioButtonComponent;
};

export const SelectionTableCell = observer(function SelectionTableCell({
  store,
  questionAxis,
  option,
  optionLabelId,
  groupName,
  Checkbox,
  RadioButton,
}: SelectionTableCellProps) {
  const cell = store.getCellState(questionAxis.token, option.token);

  if (!cell.hasOption) {
    return "—";
  }

  const ariaLabelledBy = `${questionAxis.ariaLabelledBy} ${optionLabelId}`;
  const disabled = questionAxis.question.readOnly || cell.disabled;
  const toggleCell = () => store.toggleCell(questionAxis.token, option.token);

  if (questionAxis.question.repeats) {
    return (
      <Checkbox
        checked={cell.selected}
        disabled={disabled}
        onChange={toggleCell}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={questionAxis.ariaDescribedBy}
      />
    );
  }

  return (
    <RadioButton
      groupName={groupName}
      value={option.token}
      checked={cell.selected}
      disabled={disabled}
      onChange={toggleCell}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={questionAxis.ariaDescribedBy}
    />
  );
});
