import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { AnswerType, ValueControlProps } from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { getValueControl } from "../fhir/index.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import type { OptionItem } from "@aidbox-forms/theme";
import { strings } from "../../../../strings.ts";
import { AnswerErrors } from "../validation/answer-errors.tsx";

export const SingleListSelectControl = observer(
  function SingleListSelectControl<T extends AnswerType>({
    answer,
    ariaDescribedBy,
    ariaLabelledBy,
    id,
  }: ValueControlProps<T>) {
    const { CustomOptionForm, RadioButtonList } = useTheme();
    const node = answer.question;
    const store = node.selectStore;
    const customControlType =
      node.options.constraint === "optionsOrString" ? "string" : node.type;
    const Control = getValueControl(customControlType);
    const selection = store.getSelectedOption(answer);
    const isCustomActive =
      store.customOptionFormState?.answer.token === answer.token;
    const selectedToken = isCustomActive
      ? store.specifyOtherToken
      : (selection?.token ?? "");
    const options = useMemo<OptionItem[]>(
      () =>
        store.options.map((entry) => ({
          token: entry.token,
          disabled: entry.disabled,
          label: <ValueDisplay type={entry.answerType} value={entry.value} />,
        })),
      [store.options],
    );
    const customOption = store.allowCustom
      ? {
          token: store.specifyOtherToken,
          label: strings.selection.specifyOther,
          disabled: store.isLoading,
        }
      : undefined;
    const radioOptions = customOption ? [...options, customOption] : options;

    const customOptionForm =
      isCustomActive && store.customOptionFormState ? (
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
            disabled: node.readOnly || !store.customOptionFormState.canSubmit,
          }}
        />
      ) : null;

    return (
      <RadioButtonList
        options={radioOptions}
        token={selectedToken}
        onChange={(token) => {
          store.selectOptionForAnswer(answer, token);
        }}
        id={id}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        disabled={node.readOnly}
        isLoading={store.isLoading}
        after={customOptionForm}
        afterInset={Boolean(customOptionForm)}
      />
    );
  },
);
