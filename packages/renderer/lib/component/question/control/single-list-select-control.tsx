import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useStrings } from "@formbox/theme";
import {
  AnswerType,
  OptionItem,
  ValueControlProperties,
} from "../../../types.ts";
import { useTheme } from "../../../ui/theme.tsx";
import { getValueControl } from "../fhir/value-control.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import { renderErrors } from "../../node/errors.tsx";
import { buildId } from "../../../utilities.ts";

export const SingleListSelectControl = observer(
  function SingleListSelectControl<T extends AnswerType>({
    answer,
    path,
    ariaDescribedBy,
    ariaLabelledBy,
    id,
  }: ValueControlProperties<T>) {
    const strings = useStrings();
    const { CustomOptionForm, OptionDisplay, RadioButtonList } = useTheme();
    const node = answer.question;
    const store = node.answerOption.select;

    const isCustomActive =
      store.customOptionFormState?.answer.token === answer.token;
    const selection = store.getSelectedOption(answer);

    const Control = getValueControl(store.customType);

    const customOptionForm =
      isCustomActive && store.customOptionFormState ? (
        <CustomOptionForm
          id={buildId(id, "custom-form")}
          content={
            <Control
              answer={answer}
              path={path}
              id={id}
              ariaLabelledBy={ariaLabelledBy}
              ariaDescribedBy={ariaDescribedBy}
            />
          }
          errors={renderErrors(answer)}
          onCancel={store.cancelCustomOptionForm}
          onSubmit={store.submitCustomOptionForm}
          canSubmit={!node.readOnly && store.customOptionFormState.canSubmit}
        />
      ) : undefined;

    const options = useMemo<OptionItem[]>(() => {
      return store.filteredOptions.map((entry) => ({
        token: entry.token,
        label: (
          <OptionDisplay prefix={entry.prefix} media={entry.media}>
            <ValueDisplay
              id={buildId(id, "option", entry.token, "display")}
              type={entry.answerType}
              value={entry.value}
            />
          </OptionDisplay>
        ),
        disabled: entry.disabled,
        exclusive: entry.exclusive === true,
      }));
    }, [OptionDisplay, id, store.filteredOptions]);
    const specifyOtherOption = store.allowCustom
      ? {
          token: store.specifyOtherToken,
          label: node.openLabel ?? strings.selection.specifyOther,
          disabled: store.isLoading,
          exclusive: false,
        }
      : undefined;
    const selectedOption = (() => {
      if (isCustomActive) {
        return specifyOtherOption;
      }
      if (!selection) {
        return;
      }
      return {
        token: selection.token,
        disabled: selection.disabled,
        exclusive: selection.exclusive === true,
        label: (
          <OptionDisplay prefix={selection.prefix} media={selection.media}>
            <ValueDisplay
              id={buildId(id, "selected", selection.token, "display")}
              type={selection.answerType}
              value={selection.value}
            />
          </OptionDisplay>
        ),
      };
    })();

    return (
      <RadioButtonList
        options={options}
        selectedOption={selectedOption}
        orientation={node.choiceOrientation}
        onChange={(token) => store.selectOptionForAnswer(answer, token)}
        specifyOtherOption={specifyOtherOption}
        customOptionForm={customOptionForm}
        id={id}
        path={path}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        disabled={node.readOnly}
        isLoading={store.isLoading}
      />
    );
  },
);
