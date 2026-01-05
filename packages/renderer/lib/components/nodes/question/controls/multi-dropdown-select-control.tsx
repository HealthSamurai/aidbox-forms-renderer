import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IAnswerInstance,
  IQuestionNode,
  OptionItem,
} from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import { getValueControl } from "../fhir/index.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import { strings } from "../../../../strings.ts";

type AnswerWithValue<T extends AnswerType> = IAnswerInstance<T> & {
  value: DataTypeToType<AnswerTypeToDataType<T>>;
};

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
      node.options.constraint === "optionsOrString" ? "string" : node.type;
    const CustomControl = getValueControl(customControlType);
    const customDisplayType =
      node.options.constraint === "optionsOrString" ? "string" : node.type;

    const customInputToken = store.customInputState?.answer.token;
    const customAnswerTokens = new Set(
      store.customAnswers.map((answer) => answer.token),
    );
    const selectedAnswers = node.answers.filter(
      (answer): answer is AnswerWithValue<T> =>
        answer.value != null && answer.token !== customInputToken,
    );
    const answerByToken = new Map<string, AnswerWithValue<T>>();
    const selectedOptions = selectedAnswers.map((answer) => {
      const isCustomAnswer = customAnswerTokens.has(answer.token);
      const displayType = isCustomAnswer ? customDisplayType : node.type;
      answerByToken.set(answer.token, answer);
      return {
        token: answer.token,
        label: <ValueDisplay type={displayType} value={answer.value} />,
        errors: <AnswerErrors answer={answer} />,
        disabled: !store.canRemoveSelection,
      };
    });

    const customInput = store.customInputState
      ? (() => {
          return (
            <CustomOptionForm
              content={
                <CustomControl
                  {...store.buildRowProps(
                    store.customInputState.answer,
                    "custom-input",
                  )}
                />
              }
              errors={<AnswerErrors answer={store.customInputState.answer} />}
              cancel={{
                label: strings.dialog.cancel,
                onClick: store.cancelCustomInput,
                disabled: false,
              }}
              submit={{
                label: strings.dialog.add,
                onClick: store.submitCustomInput,
                disabled: !store.customInputState.canSubmit,
              }}
            />
          );
        })()
      : null;

    const customOptionForm = customInput ?? undefined;
    const options = useMemo<OptionItem[]>(() => {
      return store.filteredOptions.map((option) => ({
        token: option.token,
        label: <ValueDisplay type={node.type} value={option.value} />,
        disabled: option.disabled || !store.canAddSelection,
      }));
    }, [node.type, store.canAddSelection, store.filteredOptions]);

    const filteredOptions = useMemo(() => {
      return options.filter(
        (option) => !store.selectedOptionTokens.has(option.token),
      );
    }, [options, store.selectedOptionTokens]);

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
        onSelect={store.handleSelectOption}
        onDeselect={(token) => {
          const answer = answerByToken.get(token);
          if (answer) {
            store.handleRemoveAnswer(answer);
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
