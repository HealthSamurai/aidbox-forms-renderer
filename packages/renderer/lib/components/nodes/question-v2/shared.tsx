import type { AnswerType, IQuestionNode } from "../../../types.ts";
import type { RowRenderProps } from "./answers/answer-row.tsx";
import { StringInput } from "./inputs/string-input.tsx";
import { TextInput } from "./inputs/text-input.tsx";
import { IntegerInput } from "./inputs/integer-input.tsx";
import { DecimalInput } from "./inputs/decimal-input.tsx";
import { DateQuestionInput } from "./inputs/date-input.tsx";
import { DateTimeQuestionInput } from "./inputs/datetime-input.tsx";
import { TimeQuestionInput } from "./inputs/time-input.tsx";
import { UrlInput } from "./inputs/url-input.tsx";
import { QuantityInput } from "./inputs/quantity-input.tsx";
import { CodingInput } from "./inputs/coding-input.tsx";
import { ReferenceInput } from "./inputs/reference-input.tsx";

export type StringLikeAnswerType = Extract<AnswerType, "string" | "text">;
export type DatalistAnswerType = Extract<
  AnswerType,
  "string" | "integer" | "decimal" | "date" | "dateTime" | "time" | "url"
>;
export type HybridAnswerType = Extract<
  AnswerType,
  "quantity" | "coding" | "reference" | "text"
>;

export function getRendererForType(
  node: IQuestionNode<
    DatalistAnswerType | HybridAnswerType | StringLikeAnswerType
  >,
) {
  switch (node.type) {
    case "string":
      return (rowProps: RowRenderProps<"string">) => (
        <StringInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
          list={rowProps.list}
          inputMode={node.keyboardType}
        />
      );
    case "text":
      return (rowProps: RowRenderProps<"text">) => (
        <TextInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      );
    case "integer":
      return (rowProps: RowRenderProps<"integer">) => (
        <IntegerInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? null}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
          list={rowProps.list}
          unitLabel={node.unitDisplay}
        />
      );
    case "decimal":
      return (rowProps: RowRenderProps<"decimal">) => (
        <DecimalInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? null}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
          list={rowProps.list}
          unitLabel={node.unitDisplay}
        />
      );
    case "date":
      return (rowProps: RowRenderProps<"date">) => (
        <DateQuestionInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      );
    case "dateTime":
      return (rowProps: RowRenderProps<"dateTime">) => (
        <DateTimeQuestionInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      );
    case "time":
      return (rowProps: RowRenderProps<"time">) => (
        <TimeQuestionInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      );
    case "url":
      return (rowProps: RowRenderProps<"url">) => (
        <UrlInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      );
    case "quantity":
      return (rowProps: RowRenderProps<"quantity">) => (
        <QuantityInput
          answer={rowProps.answer}
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          disabled={node.readOnly}
          list={rowProps.list}
        />
      );
    case "coding":
      return (rowProps: RowRenderProps<"coding">) => (
        <CodingInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          value={rowProps.value ?? null}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      );
    case "reference":
      return (rowProps: RowRenderProps<"reference">) => (
        <ReferenceInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          value={rowProps.value ?? null}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
          placeholder={node.placeholder}
        />
      );
    default:
      throw new Error(`Unsupported renderer for type ${node.type}`);
  }
}

export function getOptionSelectionState(
  node: IQuestionNode,
  rowProps: RowRenderProps,
) {
  const regularKey = node.options.getKeyForValue(rowProps.value);
  const legacyOption =
    regularKey || rowProps.value == null
      ? null
      : node.options.getLegacyEntryForValue(
          rowProps.answer.key,
          rowProps.value,
        );
  const selectValue = regularKey || legacyOption?.key || "";

  return { selectValue, legacyOption };
}
