import type { ComponentType } from "react";
import type {
  AnswerType,
  ValueControlProps,
  ValueDisplayComponent,
} from "../../../../types.ts";
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
import { StringControl } from "./string/StringControl.tsx";
import { TextControl } from "./text/TextControl.tsx";
import { IntegerControl } from "./integer/IntegerControl.tsx";
import { DecimalControl } from "./decimal/DecimalControl.tsx";
import { BooleanControl } from "./boolean/BooleanControl.tsx";
import { DateControl } from "./date/DateControl.tsx";
import { DateTimeControl } from "./dateTime/DateTimeControl.tsx";
import { TimeControl } from "./time/TimeControl.tsx";
import { UrlControl } from "./url/UrlControl.tsx";
import { ReferenceControl } from "./reference/ReferenceControl.tsx";
import { QuantityControl } from "./quantity/QuantityControl.tsx";
import { CodingControl } from "./coding/CodingControl.tsx";
import { AttachmentControl } from "./attachment/AttachmentControl.tsx";

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
