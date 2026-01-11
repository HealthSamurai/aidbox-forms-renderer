import { observer } from "mobx-react-lite";
import type { IQuestionNode, ITable, OptionAxisItem } from "../../../types.ts";
import { useTheme } from "../../../ui/theme.tsx";
import { useCallback } from "react";
import {
  buildId,
  concatIds,
  getNodeErrorId,
  getNodeHelpId,
  getNodeLabelId,
} from "../../../utilities.ts";

export const SelectionTableCell = observer(function SelectionTableCell({
  store,
  question,
  option,
  ariaLabelledBy,
}: {
  store: ITable;
  question: IQuestionNode;
  option: OptionAxisItem;
  ariaLabelledBy: string;
}) {
  const { Checkbox, RadioButton } = useTheme();
  const cell = store.getCellState(question, option.token);

  const toggleCell = useCallback(
    () => store.toggleCell(question, option.token),
    [store, question, option.token],
  );

  if (!cell) return;

  return question.repeats ? (
    <Checkbox
      id={buildId(question.token, option.token, "control")}
      checked={cell.selected}
      disabled={cell.disabled}
      onChange={toggleCell}
      ariaLabelledBy={concatIds(getNodeLabelId(question), ariaLabelledBy) ?? ""}
      ariaDescribedBy={concatIds(
        getNodeHelpId(question),
        getNodeErrorId(question),
      )}
    />
  ) : (
    <RadioButton
      id={buildId(question.token, option.token, "control")}
      groupName={buildId(question.token, "table")}
      value={option.token}
      checked={cell.selected}
      disabled={cell.disabled}
      onChange={toggleCell}
      ariaLabelledBy={concatIds(getNodeLabelId(question), ariaLabelledBy) ?? ""}
      ariaDescribedBy={concatIds(
        getNodeHelpId(question),
        getNodeErrorId(question),
      )}
    />
  );
});
