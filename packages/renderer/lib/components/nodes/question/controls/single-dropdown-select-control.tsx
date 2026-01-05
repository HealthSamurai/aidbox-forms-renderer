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
import { answerHasContent } from "../../../../utils.ts";

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
    const allowCustom = store.allowCustom;
    const customType =
      node.options.constraint === "optionsOrString" ? "string" : node.type;
    const resolvedOptionToken = store.resolveTokenForValue(answer.value);
    const isCustomValue =
      allowCustom && answer.value != null && !resolvedOptionToken;
    const customInputState = store.customInputState;
    const isCustomActive =
      allowCustom && customInputState?.answer.token === answer.token;
    const fallbackOption: OptionItem | null =
      !isCustomActive && answer.value != null && !resolvedOptionToken
        ? {
            token: `${answer.token}_/_fallback`,
            label: (
              <ValueDisplay
                type={allowCustom ? customType : node.type}
                value={answer.value}
              />
            ),
            disabled: !allowCustom,
          }
        : null;

    const Control = allowCustom ? getValueControl(customType) : null;

    const customOptionForm =
      allowCustom && isCustomActive && Control ? (
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
      ) : undefined;

    const filteredOptions = useMemo<OptionItem[]>(() => {
      return store.filteredOptions.map((option) => ({
        token: option.token,
        label: <ValueDisplay type={node.type} value={option.value} />,
        disabled: option.disabled,
      }));
    }, [node.type, store.filteredOptions]);

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
      if (resolvedOptionToken) {
        const resolved = store.resolvedOptions.find(
          (option) => option.token === resolvedOptionToken,
        );
        return resolved
          ? {
              token: resolved.token,
              label: <ValueDisplay type={node.type} value={resolved.value} />,
              disabled: resolved.disabled,
            }
          : null;
      }
      return fallbackOption;
    })();

    const optionsWithLegacy = useMemo(() => {
      let next = filteredOptions;
      if (fallbackOption) {
        const hasLegacy = next.some(
          (option) => option.token === fallbackOption.token,
        );
        if (!hasLegacy) {
          next = [fallbackOption, ...next];
        }
      }
      if (
        selectedOption &&
        selectedOption.token !== customOption?.token &&
        !next.some((option) => option.token === selectedOption.token)
      ) {
        next = [selectedOption, ...next];
      }
      return next;
    }, [customOption?.token, filteredOptions, fallbackOption, selectedOption]);

    const handleSelect = (token: string | null) => {
      if (token == null) {
        if (isCustomActive) {
          store.cancelCustomInput();
        }
        answer.setValueByUser(null);
        return;
      }
      if (allowCustom && token === store.specifyOtherToken) {
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

    return (
      <SelectInput
        options={optionsWithLegacy}
        selectedOption={selectedOption}
        onChange={handleSelect}
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
