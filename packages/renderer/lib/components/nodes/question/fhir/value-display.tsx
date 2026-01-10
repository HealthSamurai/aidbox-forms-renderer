import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  ValueDisplayComponent,
} from "../../../../types.ts";
import { VALUE_DISPLAY_BY_TYPE } from "./index.ts";
import { strings } from "../../../../strings.ts";

type ValueDisplayProperties<T extends AnswerType> = {
  type: T;
  value: DataTypeToType<AnswerTypeToDataType<T>> | undefined;
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
