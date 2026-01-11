import type { ComponentType } from "react";
import type { AnswerType, ValueControlProperties } from "../../../types.ts";
import { StringControl } from "./string/string-control.tsx";
import { TextControl } from "./text/text-control.tsx";
import { IntegerControl } from "./integer/integer-control.tsx";
import { DecimalControl } from "./decimal/decimal-control.tsx";
import { BooleanControl } from "./boolean/boolean-control.tsx";
import { DateControl } from "./date/date-control.tsx";
import { DateTimeControl } from "./dateTime/date-time-control.tsx";
import { TimeControl } from "./time/time-control.tsx";
import { UrlControl } from "./url/url-control.tsx";
import { ReferenceControl } from "./reference/reference-control.tsx";
import { QuantityControl } from "./quantity/quantity-control.tsx";
import { CodingControl } from "./coding/coding-control.tsx";
import { AttachmentControl } from "./attachment/attachment-control.tsx";

export const VALUE_CONTROL_BY_TYPE: {
  [K in AnswerType]: ComponentType<ValueControlProperties<K>>;
} = {
  string: StringControl,
  text: TextControl,
  integer: IntegerControl,
  decimal: DecimalControl,
  boolean: BooleanControl,
  date: DateControl,
  dateTime: DateTimeControl,
  time: TimeControl,
  url: UrlControl,
  reference: ReferenceControl,
  quantity: QuantityControl,
  coding: CodingControl,
  attachment: AttachmentControl,
};

export function getValueControl<T extends AnswerType>(
  type: T,
): ComponentType<ValueControlProperties<T>> {
  return VALUE_CONTROL_BY_TYPE[type];
}
