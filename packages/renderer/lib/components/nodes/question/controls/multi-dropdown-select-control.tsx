import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type {
  AnswerType,
  IQuestionNode,
  OptionItem,
} from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import { getValueControl } from "../fhir/index.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import { strings } from "../../../../strings.ts";

export type MultiDropdownSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
};

export const MultiDropdownSelectControl = observer(
  function MultiDropdownSelectControl<T extends AnswerType>({
    node,
  }: MultiDropdownSelectControlProps<T>) {
    const { CustomOptionForm, MultiSelectInput } = useTheme();
    const store = node.selectStore;
    const customControlType =
      node.answerOptions.constraint === "optionsOrString"
        ? "string"
        : node.type;
    const CustomControl = getValueControl(customControlType);

    const selectedOptions = useMemo(() => {
      return store.selectedOptions.map((selection) => ({
        token: selection.token,
        label: (
          <ValueDisplay type={selection.answerType} value={selection.value} />
        ),
        errors: <AnswerErrors answer={selection.answer} />,
        disabled: selection.disabled,
      }));
    }, [store.selectedOptions]);
    const selectedTokens = useMemo(
      () => new Set(store.selectedTokens),
      [store.selectedTokens],
    );

    const customOptionForm = store.customOptionFormState && (
      <CustomOptionForm
        content={
          <CustomControl
            {...store.buildRowProps(
              store.customOptionFormState.answer,
              "custom-input",
            )}
          />
        }
        errors={<AnswerErrors answer={store.customOptionFormState.answer} />}
        cancel={{
          label: strings.dialog.cancel,
          onClick: store.cancelCustomOptionForm,
          disabled: false,
        }}
        submit={{
          label: strings.dialog.add,
          onClick: store.submitCustomOptionForm,
          disabled: !store.customOptionFormState.canSubmit,
        }}
      />
    );
    const options = useMemo<OptionItem[]>(() => {
      return store.filteredOptions.map((entry) => ({
        token: entry.token,
        disabled: entry.disabled,
        label: <ValueDisplay type={entry.answerType} value={entry.value} />,
      }));
    }, [store.filteredOptions]);

    const filteredOptions = useMemo(() => {
      return options.filter((option) => !selectedTokens.has(option.token));
    }, [options, selectedTokens]);

    const customOption = store.allowCustom
      ? {
          token: store.specifyOtherToken,
          label: strings.selection.specifyOther,
          disabled: !store.canAddSelection || store.isLoading,
        }
      : undefined;
    const inputId = `af_/_${node.token}_/_multi-select`;

    return (
      <MultiSelectInput
        options={filteredOptions}
        onSelect={store.selectOption}
        onDeselect={(token) => {
          const answer = store.answerByToken.get(token);
          if (answer) {
            store.removeAnswer(answer);
          }
        }}
        onSearch={store.setSearchQuery}
        customOption={customOption}
        id={inputId}
        ariaLabelledBy={store.ariaLabelledBy}
        ariaDescribedBy={store.ariaDescribedBy}
        disabled={node.readOnly}
        isLoading={store.isLoading}
        selectedOptions={selectedOptions}
        customOptionForm={customOptionForm}
        placeholder={strings.selection.selectPlaceholder}
      />
    );
  },
);
