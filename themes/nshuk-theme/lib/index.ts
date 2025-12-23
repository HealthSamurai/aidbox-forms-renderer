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
import { SelectField } from "./components/select-field.tsx";
import { SelectOrStringField } from "./components/select-or-string-field.tsx";
import { AutocompleteField } from "./components/autocomplete-field.tsx";
import { RadioGroup } from "./components/radio-group.tsx";
import { CheckboxGroup } from "./components/checkbox-group.tsx";
import { MultiSelectField } from "./components/multi-select-field.tsx";
import { TypedAutocompleteInput } from "./components/typed-autocomplete-input.tsx";
import { CodingInput } from "./components/coding-input.tsx";
import { ReferenceInput } from "./components/reference-input.tsx";
import { Errors } from "./components/errors.tsx";
import { NodeHeader } from "./components/node-header.tsx";
import { QuestionScaffold } from "./components/question-scaffold.tsx";
import { OptionsState } from "./components/options-state.tsx";
import { NodeHelp } from "./components/node-help.tsx";
import { NodeLegal } from "./components/node-legal.tsx";
import { NodeFlyover } from "./components/node-flyover.tsx";
import { AnswerList } from "./components/answer-list.tsx";
import { AnswerRow } from "./components/answer-row.tsx";
import { Form } from "./components/form.tsx";
import { FormHeader } from "./components/form-header.tsx";
import { FormErrors } from "./components/form-errors.tsx";
import { NodeList } from "./components/node-list.tsx";
import { FormSection } from "./components/form-section.tsx";
import { PageStatus } from "./components/page-status.tsx";
import { PageNavigation } from "./components/page-navigation.tsx";
import { EmptyState } from "./components/empty-state.tsx";
import { FormActions } from "./components/form-actions.tsx";
import { GroupWrapperScaffold } from "./components/group-wrapper-scaffold.tsx";
import { GroupWrapperScaffoldItem } from "./components/group-wrapper-scaffold-item.tsx";
import { GroupScaffold } from "./components/group-scaffold.tsx";
import { GroupActions } from "./components/group-actions.tsx";
import { SelectionMatrix } from "./components/selection-matrix.tsx";
import { GridTable } from "./components/grid-table.tsx";
import { AttachmentInput } from "./components/attachment-input.tsx";
import { SelectOrInputField } from "./components/select-or-input-field.tsx";
import { TabContainer } from "./components/tab-container.tsx";
import { DisplayRenderer } from "./components/display-renderer.tsx";
import { Link } from "./components/link.tsx";
import "./global.css";

export type { Theme, QuantityInputProps, QuantityUnitOption };
export type { TextInputProps, TextAreaProps, NumberInputProps };
export { Button, TextInput, TextArea, NumberInput };
export {
  CodingInput,
  ReferenceInput,
  SelectOrInputField,
  TabContainer,
  DisplayRenderer,
  Link,
};

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
  SelectField,
  SelectOrStringField,
  AutocompleteField,
  RadioGroup,
  CheckboxGroup,
  MultiSelectField,
  TypedAutocompleteInput,
  CodingInput,
  ReferenceInput,
  Errors,
  NodeHeader,
  QuestionScaffold,
  OptionsState,
  NodeHelp,
  NodeLegal,
  NodeFlyover,
  AnswerList,
  AnswerRow,
  Form,
  FormHeader,
  FormErrors,
  NodeList,
  FormSection,
  PageStatus,
  PageNavigation,
  EmptyState,
  FormActions,
  GroupWrapperScaffold,
  GroupWrapperScaffoldItem,
  GroupScaffold,
  GroupActions,
  SelectionMatrix,
  GridTable,
  AttachmentInput,
  SelectOrInputField,
  TabContainer,
  DisplayRenderer,
  Link,
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
export type SelectFieldProps = ComponentProps<typeof passthrough.SelectField>;
export type SelectOrStringFieldProps = ComponentProps<
  typeof passthrough.SelectOrStringField
>;
export type AutocompleteFieldProps = ComponentProps<
  typeof passthrough.AutocompleteField
>;
export type RadioGroupProps = ComponentProps<typeof passthrough.RadioGroup>;
export type CheckboxGroupProps = ComponentProps<
  typeof passthrough.CheckboxGroup
>;
export type TypedAutocompleteInputProps = ComponentProps<
  typeof passthrough.TypedAutocompleteInput
>;

export default theme;
