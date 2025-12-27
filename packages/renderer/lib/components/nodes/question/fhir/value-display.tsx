import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  ValueDisplayComponent,
} from "../../../../types.ts";
import { VALUE_DISPLAY_BY_TYPE } from "./index.ts";

type ValueDisplayProps<T extends AnswerType> = {
  type: T;
  value: DataTypeToType<AnswerTypeToDataType<T>>;
};

export function ValueDisplay<T extends AnswerType>({
  type,
  value,
}: ValueDisplayProps<T>) {
  const Component = VALUE_DISPLAY_BY_TYPE[type] as ValueDisplayComponent<T>;
  return <Component value={value} />;
}
