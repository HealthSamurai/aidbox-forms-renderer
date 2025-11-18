import type { AnswerType, IQuestionNode } from "../../../../../types.ts";
import type { RowRenderProps } from "../../shared/answer.tsx";
import {
  createCodingAnswerRenderer,
  createDateAnswerRenderer,
  createDateTimeAnswerRenderer,
  createDecimalAnswerRenderer,
  createIntegerAnswerRenderer,
  createQuantityAnswerRenderer,
  createReferenceAnswerRenderer,
  createStringAnswerRenderer,
  createTextAnswerRenderer,
  createTimeAnswerRenderer,
  createUrlAnswerRenderer,
} from "../answer-renderers.tsx";

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
      return createStringAnswerRenderer(node as IQuestionNode<"string">);
    case "text":
      return createTextAnswerRenderer(node as IQuestionNode<"text">);
    case "integer":
      return createIntegerAnswerRenderer(node as IQuestionNode<"integer">);
    case "decimal":
      return createDecimalAnswerRenderer(node as IQuestionNode<"decimal">);
    case "quantity":
      return createQuantityAnswerRenderer(node as IQuestionNode<"quantity">);
    case "coding":
      return createCodingAnswerRenderer(node as IQuestionNode<"coding">);
    case "reference":
      return createReferenceAnswerRenderer(node as IQuestionNode<"reference">);
    case "date":
      return createDateAnswerRenderer(node as IQuestionNode<"date">);
    case "dateTime":
      return createDateTimeAnswerRenderer(node as IQuestionNode<"dateTime">);
    case "time":
      return createTimeAnswerRenderer(node as IQuestionNode<"time">);
    case "url":
      return createUrlAnswerRenderer(node as IQuestionNode<"url">);
    default:
      throw new Error(`Unsupported renderer for type ${node.type}`);
  }
}

export function getOptionSelectionState<T extends AnswerType>(
  node: IQuestionNode<T>,
  rowProps: RowRenderProps<T>,
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
