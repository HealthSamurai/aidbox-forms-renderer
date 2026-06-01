import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useStrings, type NodePath } from "@formbox/theme";

import type { IAnswer, OptionItem } from "../../../../types.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import { buildId } from "../../../../utilities.ts";
import { renderErrors } from "../../../node/errors.tsx";
import { CodingInput } from "../coding/coding-input.tsx";
import { ValueDisplay } from "../value-display.tsx";

const LEGACY_UNIT_TOKEN_PREFIX = "__legacy_unit__";

export type QuantityUnitInputProperties = {
  answer: IAnswer<"quantity">;
  id: string;
  path?: NodePath | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
};

export const QuantityUnitInput = observer(function QuantityUnitInput({
  answer,
  id,
  path,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
}: QuantityUnitInputProperties) {
  const strings = useStrings();
  const {
    SelectInput,
    TextInput,
    CustomOptionForm: CustomForm,
    OptionDisplay,
  } = useTheme();

  const unitSelection = answer.quantity.unitSelection;
  const supplementalSystem = answer.question.unitOption.supplementalSystem;
  const isCustomFormActive = unitSelection.customFormActive;
  const specifyOtherToken = unitSelection.specifyOtherToken;

  const specifyOtherOption = useMemo(
    () =>
      specifyOtherToken
        ? {
            token: specifyOtherToken,
            label: answer.question.form.strings.selection.specifyOther,
            disabled:
              answer.question.readOnly || answer.question.unitOption.isLoading,
            exclusive: false,
          }
        : undefined,
    [
      specifyOtherToken,
      answer.question.form.strings.selection.specifyOther,
      answer.question.readOnly,
      answer.question.unitOption.isLoading,
    ],
  );

  const options = useMemo<OptionItem[]>(() => {
    return unitSelection.entries.map((entry) => ({
      token: entry.token,
      disabled: entry.token.startsWith(LEGACY_UNIT_TOKEN_PREFIX),
      exclusive: false,
      label: (
        <OptionDisplay>
          <ValueDisplay
            id={buildId(id, "option", entry.token, "display")}
            type="coding"
            value={entry.coding}
          />
        </OptionDisplay>
      ),
    }));
  }, [OptionDisplay, id, unitSelection.entries]);

  const customForm = isCustomFormActive && (
    <CustomForm
      id={buildId(id, "custom-form")}
      content={
        answer.question.unitOption.effectiveUnitOpen === "optionsOrType" ? (
          <CodingInput
            id={buildId(id, "custom")}
            ariaLabelledBy={ariaLabelledBy}
            ariaDescribedBy={ariaDescribedBy}
            value={unitSelection.customCoding}
            onChange={(coding) => unitSelection.setCustomCoding(coding)}
            disabled={disabled}
            supplementalSystem={supplementalSystem}
            path={path}
          />
        ) : (
          <TextInput
            id={buildId(id, "custom")}
            path={path}
            ariaLabelledBy={ariaLabelledBy}
            ariaDescribedBy={ariaDescribedBy}
            value={unitSelection.customText}
            onChange={(text) => unitSelection.setCustomText(text)}
            disabled={disabled}
            placeholder={strings.inputs.quantityUnitPlaceholder}
          />
        )
      }
      errors={renderErrors(answer)}
      onCancel={() => unitSelection.cancelCustomForm()}
      onSubmit={() => unitSelection.submitCustomForm()}
      canSubmit={!disabled && unitSelection.canSubmitCustomForm}
    />
  );

  return (
    <SelectInput
      options={options}
      selectedOption={
        isCustomFormActive
          ? specifyOtherOption
          : options.find((entry) => entry.token === unitSelection.selectedToken)
      }
      onChange={(token) => unitSelection.select(token)}
      searchQuery=""
      specifyOtherOption={specifyOtherOption}
      customOptionForm={customForm}
      id={id}
      path={path}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      disabled={Boolean(disabled)}
      isLoading={answer.question.unitOption.isLoading}
    />
  );
});
