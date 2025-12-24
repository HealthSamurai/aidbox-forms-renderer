import type { ComponentType } from "react";
import type {
  AnswerType,
  ValueControlProps,
  ValueDisplayComponent,
} from "../../../../types.ts";
import { StringDisplay } from "./string/string-display.tsx";
import { TextDisplay } from "./text/text-display.tsx";
import { IntegerDisplay } from "./integer/integer-display.tsx";
import { DecimalDisplay } from "./decimal/decimal-display.tsx";
import { BooleanDisplay } from "./boolean/boolean-display.tsx";
import { DateDisplay } from "./date/date-display.tsx";
import { DateTimeDisplay } from "./dateTime/date-time-display.tsx";
import { TimeDisplay } from "./time/time-display.tsx";
import { UrlDisplay } from "./url/url-display.tsx";
import { ReferenceDisplay } from "./reference/reference-display.tsx";
import { QuantityDisplay } from "./quantity/quantity-display.tsx";
import { CodingDisplay } from "./coding/coding-display.tsx";
import { AttachmentDisplay } from "./attachment/attachment-display.tsx";
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

export const VALUE_DISPLAY_BY_TYPE: {
  [K in AnswerType]: ValueDisplayComponent<K>;
} = {
  string: StringDisplay,
  text: TextDisplay,
  integer: IntegerDisplay,
  decimal: DecimalDisplay,
  boolean: BooleanDisplay,
  date: DateDisplay,
  dateTime: DateTimeDisplay,
  time: TimeDisplay,
  url: UrlDisplay,
  reference: ReferenceDisplay,
  quantity: QuantityDisplay,
  coding: CodingDisplay,
  attachment: AttachmentDisplay,
};

export const VALUE_CONTROL_BY_TYPE: {
  [K in AnswerType]: ComponentType<ValueControlProps<K>>;
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
): ComponentType<ValueControlProps<T>> {
  return VALUE_CONTROL_BY_TYPE[type];
}
