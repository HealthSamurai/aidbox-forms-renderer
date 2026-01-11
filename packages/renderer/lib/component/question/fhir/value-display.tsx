import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  ValueDisplayComponent,
} from "../../../types.ts";
import { strings } from "../../../strings.ts";
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

type ValueDisplayProperties<T extends AnswerType> = {
  type: T;
  value: DataTypeToType<AnswerTypeToDataType<T>> | undefined;
};

const VALUE_DISPLAY_BY_TYPE: {
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

export function ValueDisplay<T extends AnswerType>({
  type,
  value,
}: ValueDisplayProperties<T>) {
  if (value == undefined) {
    return strings.value.undefined;
  } else {
    const Component = VALUE_DISPLAY_BY_TYPE[type] as ValueDisplayComponent<T>;
    return <Component value={value} />;
  }
}
