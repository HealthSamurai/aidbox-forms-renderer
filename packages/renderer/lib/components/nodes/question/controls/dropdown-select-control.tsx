import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
  AnswerType,
  IQuestionNode,
  OptionItem,
  ValueControlProps,
} from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { getValueControl } from "../fhir/index.ts";
import { ValueDisplay } from "../fhir/value-display.tsx";
import { strings } from "../../../../strings.ts";

export type DropdownSelectControlProps<T extends AnswerType> = {
  node: IQuestionNode<T>;
};

export const DropdownSelectControl = observer(function DropdownSelectControl<
  T extends AnswerType,
>({ node }: DropdownSelectControlProps<T>) {
  const store = node.selectStore;

  return (
    <AnswerList
      node={node}
      control={(props) =>
        node.options.constraint === "optionsOrString" ||
        node.options.constraint === "optionsOrType" ? (
          <OpenChoiceRow
            node={node}
            rowProps={props}
            isLoading={store.isLoading}
          />
        ) : (
          <OptionsRow
            node={node}
            rowProps={props}
            isLoading={store.isLoading}
          />
        )
      }
    />
  );
});

const OptionsRow = observer(function OptionsRow<T extends AnswerType>({
  node,
  rowProps,
  isLoading,
}: {
  node: IQuestionNode<T>;
  rowProps: ValueControlProps<T>;
  isLoading: boolean;
}) {
  const { SelectInput } = useTheme();
  const store = node.selectStore;
  const answer = rowProps.answer;
  const optionToken = store.resolveTokenForValue(answer.value);
  const legacyOption =
    store.allowCustom || optionToken || answer.value == null
      ? null
      : {
          token: `${answer.token}::__legacy__`,
          label: <ValueDisplay type={node.type} value={answer.value} />,
        };
  const selectValue = optionToken || legacyOption?.token || "";
  const options: OptionItem[] = store.resolvedOptions.flatMap((option) => {
    if (option.value == null) {
      return [];
    }
    return [
      {
        token: option.token,
        label: <ValueDisplay type={node.type} value={option.value} />,
        disabled: option.disabled,
      },
    ];
  });
  const clearHandler =
    answer.value != null && !node.readOnly
      ? () => answer.setValueByUser(null)
      : undefined;
  const handleSelect = (token: string) => {
    const nextValue = store.resolveValueForToken(token);
    answer.setValueByUser(nextValue);
  };

  return (
    <SelectInput
      options={options}
      token={selectValue}
      legacyOption={legacyOption}
      onChange={handleSelect}
      id={rowProps.id}
      ariaLabelledBy={rowProps.ariaLabelledBy}
      ariaDescribedBy={rowProps.ariaDescribedBy}
      disabled={node.readOnly}
      isLoading={isLoading}
      onClear={clearHandler}
      clearLabel={strings.selection.clear}
    />
  );
});

const OpenChoiceRow = observer(function OpenChoiceRow<T extends AnswerType>({
  node,
  rowProps,
  isLoading,
}: {
  node: IQuestionNode<T>;
  rowProps: ValueControlProps<T>;
  isLoading: boolean;
}) {
  const { SelectInput, OpenChoiceBackButton } = useTheme();
  const store = node.selectStore;
  const answer = rowProps.answer;
  const [isCustomForced, setIsCustomForced] = useState(false);
  const optionToken = store.resolveTokenForValue(answer.value);
  const isCustomValue =
    store.allowCustom && optionToken === "" && answer.value != null;
  const isCustomActive =
    store.allowCustom && !optionToken && (isCustomValue || isCustomForced);

  if (isCustomActive) {
    const Control = getValueControl(node.type);
    return (
      <>
        <Control
          answer={answer}
          id={rowProps.id}
          ariaLabelledBy={rowProps.ariaLabelledBy}
          ariaDescribedBy={rowProps.ariaDescribedBy}
        />
        <OpenChoiceBackButton
          onClick={() => {
            setIsCustomForced(false);
            answer.setValueByUser(null);
          }}
          disabled={node.readOnly}
        >
          {strings.selection.backToOptions}
        </OpenChoiceBackButton>
      </>
    );
  }

  const clearHandler =
    answer.value != null && !node.readOnly
      ? () => answer.setValueByUser(null)
      : undefined;
  const options: OptionItem[] = store.resolvedOptions.flatMap((option) => {
    if (option.value == null) {
      return [];
    }
    return [
      {
        token: option.token,
        label: <ValueDisplay type={node.type} value={option.value} />,
        disabled: option.disabled,
      },
    ];
  });
  if (store.allowCustom) {
    options.push({
      token: store.specifyOtherToken,
      label: strings.selection.specifyOther,
      disabled: !store.canAddSelection,
    });
  }
  const handleSelect = (token: string) => {
    if (store.allowCustom && token === store.specifyOtherToken) {
      setIsCustomForced(true);
      answer.setValueByUser(null);
      return;
    }
    setIsCustomForced(false);
    const nextValue = store.resolveValueForToken(token);
    answer.setValueByUser(nextValue);
  };

  return (
    <SelectInput
      options={options}
      token={optionToken}
      legacyOption={null}
      onChange={handleSelect}
      id={rowProps.id}
      ariaLabelledBy={rowProps.ariaLabelledBy}
      ariaDescribedBy={rowProps.ariaDescribedBy}
      disabled={node.readOnly}
      isLoading={isLoading}
      onClear={clearHandler}
      clearLabel={strings.selection.clear}
    />
  );
});
