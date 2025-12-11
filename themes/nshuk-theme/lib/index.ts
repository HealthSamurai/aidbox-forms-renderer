import type { ComponentProps } from "react";
import type {
  Theme,
  QuantityInputProps,
  QuantityUnitOption,
} from "@aidbox-forms/theme";
import { Button } from "./components/button.tsx";
import { TextInput, type TextInputProps } from "./components/text-input.tsx";
import { TextArea, type TextAreaProps } from "./components/text-area.tsx";
import { NumberInput } from "./components/number-input.tsx";
import type { NumberInputProps } from "@aidbox-forms/theme";
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
import "./global.css";

export type { Theme, QuantityInputProps, QuantityUnitOption };
export type { TextInputProps, TextAreaProps, NumberInputProps };
export { Button, TextInput, TextArea, NumberInput };

const passthrough: Theme = {
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

export const theme: Theme = passthrough;

// Derived prop helpers for consumers wanting to wrap other controls using the same shapes.
export type DateInputProps = ComponentProps<typeof passthrough.DateInput>;
export type DateTimeInputProps = ComponentProps<
  typeof passthrough.DateTimeInput
>;
export type TimeInputProps = ComponentProps<typeof passthrough.TimeInput>;
export type SliderInputProps = ComponentProps<typeof passthrough.SliderInput>;
export type SpinnerInputProps = ComponentProps<typeof passthrough.SpinnerInput>;
export type OptionSelectFieldProps = ComponentProps<
  typeof passthrough.OptionSelectField
>;
export type OptionsOrStringFieldProps = ComponentProps<
  typeof passthrough.OptionsOrStringField
>;
export type OptionAutocompleteFieldProps = ComponentProps<
  typeof passthrough.OptionAutocompleteField
>;
export type OptionRadioGroupProps = ComponentProps<
  typeof passthrough.OptionRadioGroup
>;
export type OptionCheckboxGroupProps = ComponentProps<
  typeof passthrough.OptionCheckboxGroup
>;
export type TypedSuggestionInputProps = ComponentProps<
  typeof passthrough.TypedSuggestionInput
>;

export default theme;
