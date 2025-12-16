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
import { CodingInput } from "./components/coding-input.tsx";
import { ReferenceInput } from "./components/reference-input.tsx";
import { NodeErrors } from "./components/node-errors.tsx";
import { NodeHeader } from "./components/node-header.tsx";
import { NodeWrapper } from "./components/node-wrapper.tsx";
import { OptionsStatus } from "./components/options-status.tsx";
import { NodeHelp } from "./components/node-help.tsx";
import { NodeLegal } from "./components/node-legal.tsx";
import { NodeFlyover } from "./components/node-flyover.tsx";
import { AnswerList } from "./components/answer-list.tsx";
import { AnswerRow } from "./components/answer-row.tsx";
import { FormShell } from "./components/form-shell.tsx";
import { FormHeader } from "./components/form-header.tsx";
import { FormErrors } from "./components/form-errors.tsx";
import { NodesContainer } from "./components/nodes-container.tsx";
import { FormSection } from "./components/form-section.tsx";
import { PageStatus } from "./components/page-status.tsx";
import { PageNavigation } from "./components/page-navigation.tsx";
import { EmptyState } from "./components/empty-state.tsx";
import { FormActions } from "./components/form-actions.tsx";
import { GroupWrapper } from "./components/group-wrapper.tsx";
import { GroupItem } from "./components/group-item.tsx";
import { GroupContainer } from "./components/group-container.tsx";
import { GroupExtras } from "./components/group-extras.tsx";
import { ChoiceMatrix } from "./components/choice-matrix.tsx";
import { GridTable } from "./components/grid-table.tsx";
import { AttachmentInput } from "./components/attachment-input.tsx";
import { OpenChoiceField } from "./components/open-choice.tsx";
import { TabContainer } from "./components/tab-container.tsx";
import { DisplayNode } from "./components/display-node.tsx";
import "./global.css";

export type { Theme, QuantityInputProps, QuantityUnitOption };
export type { TextInputProps, TextAreaProps, NumberInputProps };
export { Button, TextInput, TextArea, NumberInput };
export {
  CodingInput,
  ReferenceInput,
  OpenChoiceField,
  TabContainer,
  DisplayNode,
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
  OptionSelectField,
  OptionsOrStringField,
  OptionAutocompleteField,
  OptionRadioGroup,
  OptionCheckboxGroup,
  TypedSuggestionInput,
  CodingInput,
  ReferenceInput,
  NodeErrors,
  NodeHeader,
  NodeWrapper,
  OptionsStatus,
  NodeHelp,
  NodeLegal,
  NodeFlyover,
  AnswerList,
  AnswerRow,
  FormShell,
  FormHeader,
  FormErrors,
  NodesContainer,
  FormSection,
  PageStatus,
  PageNavigation,
  EmptyState,
  FormActions,
  GroupWrapper,
  GroupItem,
  GroupContainer,
  GroupExtras,
  ChoiceMatrix,
  GridTable,
  AttachmentInput,
  OpenChoiceField,
  TabContainer,
  DisplayNode,
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
