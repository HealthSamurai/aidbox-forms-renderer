import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  AnswerType,
  ValueControlProps,
  OptionItem,
} from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { getValueControl } from "../fhir/index.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import { strings } from "../../../../strings.ts";
import { AnswerErrors } from "../validation/answer-errors.tsx";

export const SingleDropdownSelectControl = observer(
  function SingleDropdownSelectControl<T extends AnswerType>({
    answer,
    ariaDescribedBy,
    ariaLabelledBy,
    id,
  }: ValueControlProps<T>) {
    const { SelectInput, CustomOptionForm } = useTheme();
    const node = answer.question;
    const store = node.selectStore;
    const customControlType =
      node.answerOptions.constraint === "optionsOrString"
        ? "string"
        : node.type;
    const isCustomActive =
      store.customOptionFormState?.answer.token === answer.token;
    const selection = store.getSelectedOption(answer);

    const Control = store.allowCustom
      ? getValueControl(customControlType)
      : null;

    const customOptionForm =
      store.allowCustom && isCustomActive && Control ? (
        <CustomOptionForm
          content={
            <Control
              answer={answer}
              id={id}
              ariaLabelledBy={ariaLabelledBy}
              ariaDescribedBy={ariaDescribedBy}
            />
          }
          errors={<AnswerErrors answer={answer} />}
          cancel={{
            label: strings.dialog.cancel,
            onClick: store.cancelCustomOptionForm,
            disabled: node.readOnly,
          }}
          submit={{
            label: strings.dialog.add,
            onClick: store.submitCustomOptionForm,
            disabled: node.readOnly || !store.customOptionFormState?.canSubmit,
          }}
        />
      ) : undefined;

    const options = useMemo<OptionItem[]>(() => {
      return store.filteredOptions.map((entry) => ({
        token: entry.token,
        label: <ValueDisplay type={entry.answerType} value={entry.value} />,
        disabled: entry.disabled,
      }));
    }, [store.filteredOptions]);

    const customOption = store.allowCustom
      ? {
          token: store.specifyOtherToken,
          label: strings.selection.specifyOther,
          disabled: store.isLoading,
        }
      : undefined;

    const selectedOption = (() => {
      if (isCustomActive) {
        return customOption ?? null;
      }
      if (!selection) {
        return null;
      }
      return {
        token: selection.token,
        disabled: selection.disabled,
        label: (
          <ValueDisplay type={selection.answerType} value={selection.value} />
        ),
      };
    })();

    return (
      <SelectInput
        options={options}
        selectedOption={selectedOption}
        onChange={(token) => {
          store.selectOptionForAnswer(answer, token);
        }}
        onSearch={store.setSearchQuery}
        customOption={customOption}
        customOptionForm={customOptionForm}
        id={id}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        disabled={node.readOnly}
        isLoading={store.isLoading}
        placeholder={strings.selection.selectPlaceholder}
      />
    );
  },
);
