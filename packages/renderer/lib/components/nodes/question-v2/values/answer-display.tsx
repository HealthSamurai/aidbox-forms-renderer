import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
} from "../../../../types.ts";
import { StringDisplay } from "../fhir/string/StringDisplay.tsx";
import { TextDisplay } from "../fhir/text/TextDisplay.tsx";
import { IntegerDisplay } from "../fhir/integer/IntegerDisplay.tsx";
import { DecimalDisplay } from "../fhir/decimal/DecimalDisplay.tsx";
import { BooleanDisplay } from "../fhir/boolean/BooleanDisplay.tsx";
import { DateDisplay } from "../fhir/date/DateDisplay.tsx";
import { DateTimeDisplay } from "../fhir/dateTime/DateTimeDisplay.tsx";
import { TimeDisplay } from "../fhir/time/TimeDisplay.tsx";
import { UrlDisplay } from "../fhir/url/UrlDisplay.tsx";
import { ReferenceDisplay } from "../fhir/reference/ReferenceDisplay.tsx";
import { QuantityDisplay } from "../fhir/quantity/QuantityDisplay.tsx";
import { CodingDisplay } from "../fhir/coding/CodingDisplay.tsx";
import { AttachmentDisplay } from "../fhir/attachment/AttachmentDisplay.tsx";

export function AnswerDisplay<T extends AnswerType>({
  type,
  value,
  placeholder,
}: {
  type: T;
  value: DataTypeToType<AnswerTypeToDataType<T>> | null | undefined;
  placeholder?: string;
}) {
  const placeholderProps = placeholder === undefined ? {} : { placeholder };

  switch (type) {
    case "string":
      return (
        <StringDisplay value={value as string | null} {...placeholderProps} />
      );
    case "text":
      return (
        <TextDisplay value={value as string | null} {...placeholderProps} />
      );
    case "integer":
      return (
        <IntegerDisplay value={value as number | null} {...placeholderProps} />
      );
    case "decimal":
      return (
        <DecimalDisplay value={value as number | null} {...placeholderProps} />
      );
    case "boolean":
      return (
        <BooleanDisplay value={value as boolean | null} {...placeholderProps} />
      );
    case "date":
      return (
        <DateDisplay value={value as string | null} {...placeholderProps} />
      );
    case "dateTime":
      return (
        <DateTimeDisplay value={value as string | null} {...placeholderProps} />
      );
    case "time":
      return (
        <TimeDisplay value={value as string | null} {...placeholderProps} />
      );
    case "url":
      return (
        <UrlDisplay value={value as string | null} {...placeholderProps} />
      );
    case "reference":
      return <ReferenceDisplay value={value as never} {...placeholderProps} />;
    case "quantity":
      return <QuantityDisplay value={value as never} {...placeholderProps} />;
    case "coding":
      return <CodingDisplay value={value as never} {...placeholderProps} />;
    case "attachment":
      return <AttachmentDisplay value={value as never} {...placeholderProps} />;
    default:
      return (
        <StringDisplay value={String(value ?? "")} {...placeholderProps} />
      );
  }
}
