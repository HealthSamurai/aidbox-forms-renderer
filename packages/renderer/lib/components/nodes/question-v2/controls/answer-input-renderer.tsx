import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import type {
  AnswerRowRenderer,
  RowRenderProps,
} from "../answers/answer-row.tsx";
import { StringInput } from "../fhir/string/StringInput.tsx";
import { TextInput } from "../fhir/text/TextInput.tsx";
import { IntegerInput } from "../fhir/integer/IntegerInput.tsx";
import { DecimalInput } from "../fhir/decimal/DecimalInput.tsx";
import { DateInput } from "../fhir/date/DateInput.tsx";
import { DateTimeInput } from "../fhir/dateTime/DateTimeInput.tsx";
import { TimeInput } from "../fhir/time/TimeInput.tsx";
import { UrlInput } from "../fhir/url/UrlInput.tsx";
import { QuantityInput } from "../fhir/quantity/QuantityInput.tsx";
import { CodingInput } from "../fhir/coding/CodingInput.tsx";
import { ReferenceInput } from "../fhir/reference/ReferenceInput.tsx";
import { AttachmentInput } from "../fhir/attachment/AttachmentInput.tsx";

export function getAnswerInputRenderer<T extends AnswerType>(
  node: IQuestionNode<T>,
): AnswerRowRenderer<T> {
  switch (node.type) {
    case "string":
      return ((rowProps: RowRenderProps<"string">) => (
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
      )) as AnswerRowRenderer<T>;
    case "text":
      return ((rowProps: RowRenderProps<"text">) => (
        <TextInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      )) as AnswerRowRenderer<T>;
    case "integer":
      return ((rowProps: RowRenderProps<"integer">) => (
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
      )) as AnswerRowRenderer<T>;
    case "decimal":
      return ((rowProps: RowRenderProps<"decimal">) => (
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
      )) as AnswerRowRenderer<T>;
    case "date":
      return ((rowProps: RowRenderProps<"date">) => (
        <DateInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      )) as AnswerRowRenderer<T>;
    case "dateTime":
      return ((rowProps: RowRenderProps<"dateTime">) => (
        <DateTimeInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      )) as AnswerRowRenderer<T>;
    case "time":
      return ((rowProps: RowRenderProps<"time">) => (
        <TimeInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      )) as AnswerRowRenderer<T>;
    case "url":
      return ((rowProps: RowRenderProps<"url">) => (
        <UrlInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      )) as AnswerRowRenderer<T>;
    case "quantity":
      return ((rowProps: RowRenderProps<"quantity">) => (
        <QuantityInput
          answer={rowProps.answer}
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          disabled={node.readOnly}
          list={rowProps.list}
        />
      )) as AnswerRowRenderer<T>;
    case "coding":
      return ((rowProps: RowRenderProps<"coding">) => (
        <CodingInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          value={rowProps.value ?? null}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      )) as AnswerRowRenderer<T>;
    case "reference":
      return ((rowProps: RowRenderProps<"reference">) => (
        <ReferenceInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          value={rowProps.value ?? null}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
          placeholder={node.placeholder}
        />
      )) as AnswerRowRenderer<T>;
    case "attachment":
      return ((rowProps: RowRenderProps<"attachment">) => (
        <AttachmentInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          value={rowProps.value ?? null}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      )) as AnswerRowRenderer<T>;
    default:
      throw new Error(`Unsupported renderer for type ${node.type}`);
  }
}
