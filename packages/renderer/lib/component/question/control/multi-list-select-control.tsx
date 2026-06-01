import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useStrings } from "@formbox/theme";
import type { AnswerType, IQuestionNode, OptionItem } from "../../../types.ts";
import { useTheme } from "../../../ui/theme.tsx";
import { renderErrors } from "../../node/errors.tsx";
import { getValueControl } from "../fhir/value-control.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import {
  buildId,
  concatIds,
  getIssueErrorId,
  getNodeHelpId,
  getNodeLabelId,
} from "../../../utilities.ts";

export const MultiListSelectControl = observer(function MultiListSelectControl<
  T extends AnswerType,
>({ node }: { node: IQuestionNode<T> }) {
  const strings = useStrings();
  const { CheckboxList, CustomOptionForm, OptionDisplay } = useTheme();
  const store = node.answerOption.select;
  const CustomControl = getValueControl(store.customType);
  const selectedOptions = store.selectedOptions.map((selection) => ({
    token: selection.token,
    label: (
      <OptionDisplay prefix={selection.prefix} media={selection.media}>
        <ValueDisplay
          id={buildId(
            selection.answer.token,
            "selected",
            selection.token,
            "display",
          )}
          type={selection.answerType}
          value={selection.value}
        />
      </OptionDisplay>
    ),
    ariaDescribedBy: getIssueErrorId(selection.answer),
    errors: renderErrors(selection.answer),
    disabled: selection.disabled,
    exclusive: selection.exclusive === true,
  }));

  const ariaLabelledBy = getNodeLabelId(node);
  const ariaDescribedBy = concatIds(getNodeHelpId(node), getIssueErrorId(node));
  const formState = store.customOptionFormState;
  const customAriaDescribedBy = formState?.answer
    ? getIssueErrorId(formState.answer)
    : undefined;
  const customOptionForm = formState ? (
    <CustomOptionForm
      id={buildId(formState.answer.token, "custom-form")}
      content={
        <CustomControl
          answer={formState.answer}
          path={formState.answer.path}
          id={buildId(formState.answer.token, "custom-input")}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={customAriaDescribedBy}
        />
      }
      errors={renderErrors(formState.answer)}
      onCancel={store.cancelCustomOptionForm}
      onSubmit={store.submitCustomOptionForm}
      canSubmit={!node.readOnly && formState.canSubmit}
    />
  ) : undefined;

  const options = useMemo<OptionItem[]>(() => {
    return store.filteredOptions.map((entry) => ({
      token: entry.token,
      disabled: entry.disabled,
      exclusive: entry.exclusive === true,
      label: (
        <OptionDisplay prefix={entry.prefix} media={entry.media}>
          <ValueDisplay
            id={buildId(
              node.token,
              "multi-select",
              "option",
              entry.token,
              "display",
            )}
            type={entry.answerType}
            value={entry.value}
          />
        </OptionDisplay>
      ),
    }));
  }, [OptionDisplay, node.token, store.filteredOptions]);

  const specifyOtherOption = store.allowCustom
    ? {
        token: store.specifyOtherToken,
        label: node.openLabel ?? strings.selection.specifyOther,
        disabled: !store.canAddSelection || store.isLoading,
        exclusive: false,
      }
    : undefined;

  return (
    <CheckboxList
      options={options}
      onSelect={store.selectOption}
      onDeselect={store.deselectOption}
      orientation={node.choiceOrientation}
      specifyOtherOption={specifyOtherOption}
      id={buildId(node.token, "multi-select")}
      path={node.path}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      disabled={node.readOnly}
      isLoading={store.isLoading}
      selectedOptions={selectedOptions}
      customOptionForm={customOptionForm}
    />
  );
});
