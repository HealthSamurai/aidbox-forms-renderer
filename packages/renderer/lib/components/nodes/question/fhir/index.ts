import type { AnswerType, ValueDisplayComponent } from "../../../../types.ts";
import { StringDisplay } from "./string/StringDisplay.tsx";
import { TextDisplay } from "./text/TextDisplay.tsx";
import { IntegerDisplay } from "./integer/IntegerDisplay.tsx";
import { DecimalDisplay } from "./decimal/DecimalDisplay.tsx";
import { BooleanDisplay } from "./boolean/BooleanDisplay.tsx";
import { DateDisplay } from "./date/DateDisplay.tsx";
import { DateTimeDisplay } from "./dateTime/DateTimeDisplay.tsx";
import { TimeDisplay } from "./time/TimeDisplay.tsx";
import { UrlDisplay } from "./url/UrlDisplay.tsx";
import { ReferenceDisplay } from "./reference/ReferenceDisplay.tsx";
import { QuantityDisplay } from "./quantity/QuantityDisplay.tsx";
import { CodingDisplay } from "./coding/CodingDisplay.tsx";
import { AttachmentDisplay } from "./attachment/AttachmentDisplay.tsx";

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
