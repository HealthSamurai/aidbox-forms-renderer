import { observer } from "mobx-react-lite";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { AnswerList } from "../answers/answer-list.tsx";
import {
  DatalistAnswerType,
  getOptionSelectionState,
  getRendererForType,
  HybridAnswerType,
  StringLikeAnswerType,
} from "../shared.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import type {
  AnswerRowRenderer,
  RowRenderProps,
} from "../answers/answer-row.tsx";

type DropdownMode = "select" | "autocomplete" | "lookup";

export const DropdownControl = observer(function DropdownControl<
  T extends AnswerType,
>({ node, mode }: { node: IQuestionNode<T>; mode: DropdownMode }) {
  const {
    OptionSelectField,
    OptionsOrStringField,
    OptionAutocompleteField,
    TypedSuggestionInput,
    OpenChoiceField,
  } = useTheme();
  const isLoading = node.options.loading;

  if (node.options.constraint === "optionsOrString" && isStringLike(node)) {
    const renderInput =
      node.type === "text"
        ? getRendererForType(node as IQuestionNode<"text">)
        : getRendererForType(node as IQuestionNode<"string">);
    const typedRenderInput =
      renderInput as AnswerRowRenderer<StringLikeAnswerType>;

    return (
      <AnswerList
        node={node}
        renderRow={(rowProps: RowRenderProps<StringLikeAnswerType>) => {
          const optionKey = node.options.getKeyForValue(
            rowProps.value,
          ) as string;
          const hasCustomValue =
            optionKey === "" &&
            rowProps.value != null &&
            String(rowProps.value).trim().length > 0;
          const selectValue = hasCustomValue
            ? "__af-custom-value__"
            : optionKey;

          return (
            <OptionsOrStringField
              options={node.options.entries}
              renderInput={() => typedRenderInput(rowProps)}
              getValueForKey={(key) =>
                node.options.getValueForKey(key) as string | null
              }
              customOptionKey="__af-custom-value__"
              selectValue={selectValue}
              onSelectValue={(next) =>
                rowProps.setValue(next as typeof rowProps.value | null)
              }
              inputId={rowProps.inputId}
              labelId={rowProps.labelId}
              describedById={rowProps.describedById}
              readOnly={node.readOnly}
              isLoading={isLoading}
            />
          );
        }}
      />
    );
  }

  if (
    node.options.constraint === "optionsOrType" &&
    isDatalistType(node) &&
    hasOptions(node)
  ) {
    const renderInput = getRendererForType(node);
    const typedRenderInput =
      renderInput as AnswerRowRenderer<DatalistAnswerType>;

    return (
      <AnswerList
        node={node}
        renderRow={(rowProps: RowRenderProps<DatalistAnswerType>) => (
          <TypedSuggestionInput
            renderInput={() => typedRenderInput(rowProps)}
            options={node.options.entries}
            isLoading={isLoading}
            readOnly={node.readOnly}
            onSelect={(value) => rowProps.setValue(value as never)}
            currentValue={rowProps.value}
          />
        )}
      />
    );
  }

  if (
    node.options.constraint === "optionsOrType" &&
    isHybridType(node) &&
    hasOptions(node)
  ) {
    const renderInput = getRendererForType(node);
    const typedRenderInput = renderInput as AnswerRowRenderer<HybridAnswerType>;
    const hybridNode = node as IQuestionNode<HybridAnswerType>;

    return (
      <AnswerList
        node={node}
        renderRow={(rowProps: RowRenderProps<HybridAnswerType>) => {
          const { selectValue, legacyOption } = getOptionSelectionState(
            node,
            rowProps,
          );
          return (
            <OpenChoiceField
              select={
                <OptionSelectField
                  options={hybridNode.options.entries}
                  selectValue={selectValue}
                  legacyOption={legacyOption}
                  onChange={(key) => {
                    const nextValue = key
                      ? hybridNode.options.getValueForKey(key)
                      : null;
                    rowProps.setValue(
                      nextValue as RowRenderProps<HybridAnswerType>["value"],
                    );
                  }}
                  inputId={rowProps.inputId}
                  labelId={rowProps.labelId}
                  describedById={rowProps.describedById}
                  readOnly={hybridNode.readOnly}
                  isLoading={isLoading}
                />
              }
              input={typedRenderInput(rowProps)}
            />
          );
        }}
      />
    );
  }

  return (
    <AnswerList
      node={node}
      renderRow={(rowProps) => {
        const { selectValue, legacyOption } = getOptionSelectionState(
          node,
          rowProps,
        );

        if (mode === "autocomplete" || mode === "lookup") {
          return (
            <OptionAutocompleteField
              options={node.options.entries}
              selectValue={selectValue}
              legacyOptionLabel={legacyOption?.label}
              onSelect={(key) => {
                const nextValue = key ? node.options.getValueForKey(key) : null;
                rowProps.setValue(nextValue);
              }}
              inputId={rowProps.inputId}
              labelId={rowProps.labelId}
              describedById={rowProps.describedById}
              readOnly={node.readOnly}
              mode={mode === "lookup" ? "lookup" : "autocomplete"}
              isLoading={isLoading}
            />
          );
        }

        return (
          <OptionSelectField
            options={node.options.entries}
            selectValue={selectValue}
            legacyOption={legacyOption}
            onChange={(key) => {
              const nextValue = key ? node.options.getValueForKey(key) : null;
              rowProps.setValue(nextValue);
            }}
            inputId={rowProps.inputId}
            labelId={rowProps.labelId}
            describedById={rowProps.describedById}
            readOnly={node.readOnly}
            isLoading={isLoading}
          />
        );
      }}
    />
  );
});

function hasOptions(node: IQuestionNode) {
  return (
    node.template.answerOption?.length ||
    node.template.answerValueSet ||
    node.expressionRegistry.answer
  );
}

function isStringLike(
  node: IQuestionNode,
): node is IQuestionNode<StringLikeAnswerType> {
  return node.type === "string" || node.type === "text";
}

function isDatalistType(
  node: IQuestionNode,
): node is IQuestionNode<DatalistAnswerType> {
  return (
    node.type === "string" ||
    node.type === "integer" ||
    node.type === "decimal" ||
    node.type === "date" ||
    node.type === "dateTime" ||
    node.type === "time" ||
    node.type === "url"
  );
}

function isHybridType(
  node: IQuestionNode,
): node is IQuestionNode<HybridAnswerType> {
  return (
    node.type === "quantity" ||
    node.type === "coding" ||
    node.type === "reference" ||
    node.type === "text"
  );
}
