import { observer } from "mobx-react-lite";
import { AnswerType, ValueControlProps } from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { getValueControl } from "../fhir/index.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import type { OptionItem } from "@aidbox-forms/theme";
import { strings } from "../../../../strings.ts";
import { AnswerErrors } from "../validation/answer-errors.tsx";
import { answerHasContent } from "../../../../utils.ts";

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
    const customType =
      node.options.constraint === "optionsOrString" ? "string" : node.type;
    const Control = getValueControl(customType);
    const selectToken = store.resolveTokenForValue(answer.value);
    const isBooleanFallback =
      node.type === "boolean" && node.options.resolvedOptions.length === 0;
    const isCustomValue =
      store.allowCustom && answer.value != null && !selectToken;
    const customInputState = store.customInputState;
    const isCustomActive =
      store.allowCustom && customInputState?.answer.token === answer.token;
    const fallbackOption =
      isBooleanFallback || selectToken || answer.value == null || isCustomActive
        ? null
        : {
            token: `${answer.token}_/_fallback`,
            label: (
              <ValueDisplay
                type={store.allowCustom ? customType : node.type}
                value={answer.value}
              />
            ),
            disabled: !store.allowCustom,
          };
    const selectValue = isCustomActive
      ? store.specifyOtherToken
      : selectToken || fallbackOption?.token || "";
    const baseOptions: OptionItem[] = store.resolvedOptions.map((option) => ({
      token: option.token,
      label: <ValueDisplay type={node.type} value={option.value} />,
      disabled: option.disabled,
    }));
    const optionsWithFallback = fallbackOption
      ? baseOptions.some((option) => option.token === fallbackOption.token)
        ? baseOptions
        : [fallbackOption, ...baseOptions]
      : baseOptions;
    const customOption = store.allowCustom
      ? {
          token: store.specifyOtherToken,
          label: strings.selection.specifyOther,
          disabled: store.isLoading,
        }
      : undefined;
    const radioOptions = customOption
      ? [...optionsWithFallback, customOption]
      : optionsWithFallback;

    const handleChange = (token: string) => {
      if (store.allowCustom && token === store.specifyOtherToken) {
        store.openCustomInput(answer);
        if (!isCustomValue) {
          answer.setValueByUser(null);
        }
        return;
      }

      if (isCustomActive) {
        store.cancelCustomInput();
      }
      const nextValue = store.resolveValueForToken(token);
      if (nextValue !== null) {
        answer.setValueByUser(nextValue);
      }
    };

    const customInput = isCustomActive ? (
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
          onClick: store.cancelCustomInput,
          disabled: node.readOnly,
        }}
        submit={{
          label: strings.dialog.add,
          onClick: store.submitCustomInput,
          disabled: node.readOnly || !answerHasContent(answer),
        }}
      />
    ) : null;

    return (
      <RadioButtonList
        options={radioOptions}
        token={selectValue}
        onChange={handleChange}
        id={id}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        disabled={node.readOnly}
        isLoading={store.isLoading}
        after={customInput}
        afterInset={Boolean(customInput)}
      />
    );
  },
);
