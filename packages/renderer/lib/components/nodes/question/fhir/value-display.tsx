import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  ValueDisplayComponent,
} from "../../../../types.ts";
import { VALUE_DISPLAY_BY_TYPE } from "./index.ts";
import { strings } from "../../../../strings.ts";

type ValueDisplayProps<T extends AnswerType> = {
  type: T;
  value: DataTypeToType<AnswerTypeToDataType<T>> | null;
};

export function ValueDisplay<T extends AnswerType>({
  type,
  value,
}: ValueDisplayProps<T>) {
  if (value == null) {
    return strings.value.null;
  } else {
    const Component = VALUE_DISPLAY_BY_TYPE[type] as ValueDisplayComponent<T>;
    return <Component value={value} />;
  }
}
