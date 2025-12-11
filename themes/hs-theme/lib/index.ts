export { Button } from "./components/button.tsx";
export type { ButtonProps } from "./components/button.tsx";
export { TextInput } from "./components/text-input.tsx";
export { TextArea } from "./components/text-area.tsx";
export { NumberInput } from "./components/number-input.tsx";
export {
  QuantityInput,
  type QuantityInputProps,
  type QuantityUnitOption,
} from "./components/quantity-input.tsx";
export { DateInput } from "./components/date-input.tsx";
export { DateTimeInput } from "./components/date-time-input.tsx";
export { TimeInput } from "./components/time-input.tsx";
export { SliderInput } from "./components/slider-input.tsx";
export { SpinnerInput } from "./components/spinner-input.tsx";
export { OptionSelectField } from "./components/option-select-field.tsx";
export { OptionsOrStringField } from "./components/options-or-string-field.tsx";
export { OptionAutocompleteField } from "./components/option-autocomplete-field.tsx";
export { OptionRadioGroup } from "./components/option-radio-group.tsx";
export { OptionCheckboxGroup } from "./components/option-checkbox-group.tsx";
export { TypedSuggestionInput } from "./components/typed-suggestion-input.tsx";

import { Button } from "./components/button.tsx";
import { TextInput } from "./components/text-input.tsx";
import { TextArea } from "./components/text-area.tsx";
import { NumberInput } from "./components/number-input.tsx";
import { QuantityInput } from "./components/quantity-input.tsx";
import { DateInput } from "./components/date-input.tsx";
import { DateTimeInput } from "./components/date-time-input.tsx";
import { TimeInput } from "./components/time-input.tsx";
import { SliderInput } from "./components/slider-input.tsx";
import { SpinnerInput } from "./components/spinner-input.tsx";
import { OptionSelectField } from "./components/option-select-field.tsx";
import { OptionsOrStringField } from "./components/options-or-string-field.tsx";
import { OptionAutocompleteField } from "./components/option-autocomplete-field.tsx";
import { OptionRadioGroup } from "./components/option-radio-group.tsx";
import { OptionCheckboxGroup } from "./components/option-checkbox-group.tsx";
import { TypedSuggestionInput } from "./components/typed-suggestion-input.tsx";
import type { Theme } from "@aidbox-forms/theme";

export const theme: Theme = {
  Button,
  TextInput,
  TextArea,
  NumberInput,
  QuantityInput,
  DateInput,
  DateTimeInput,
  TimeInput,
  SliderInput,
  SpinnerInput,
  OptionSelectField,
  OptionsOrStringField,
  OptionAutocompleteField,
  OptionRadioGroup,
  OptionCheckboxGroup,
  TypedSuggestionInput,
};
