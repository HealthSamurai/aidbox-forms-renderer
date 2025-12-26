import type { ComponentProps } from "react";
import type { Theme } from "@aidbox-forms/theme";
import { Button } from "./components/button.tsx";
import { TextInput, type TextInputProps } from "./components/text-input.tsx";
import { TextArea, type TextAreaProps } from "./components/text-area.tsx";
import { NumberInput } from "./components/number-input.tsx";
import type { NumberInputProps } from "@aidbox-forms/theme";
import { DateInput } from "./components/date-input.tsx";
import { DateTimeInput } from "./components/date-time-input.tsx";
import { TimeInput } from "./components/time-input.tsx";
import { SliderInput } from "./components/slider-input.tsx";
import { SpinnerInput } from "./components/spinner-input.tsx";
import { SelectInput } from "./components/select-input.tsx";
import { RadioButtonList } from "./components/radio-button-list.tsx";
import { CheckboxList } from "./components/checkbox-list.tsx";
import { MultiSelectInput } from "./components/multi-select-input.tsx";
import { Errors } from "./components/errors.tsx";
import { NodeHeader } from "./components/node-header.tsx";
import { QuestionScaffold } from "./components/question-scaffold.tsx";
import { OptionsState } from "./components/options-state.tsx";
import { NodeHelp } from "./components/node-help.tsx";
import { NodeLegal } from "./components/node-legal.tsx";
import { NodeFlyover } from "./components/node-flyover.tsx";
import { AnswerAddButton } from "./components/answer-add-button.tsx";
import { AnswerList } from "./components/answer-list.tsx";
import { AnswerRemoveButton } from "./components/answer-remove-button.tsx";
import { AnswerScaffold } from "./components/answer-scaffold.tsx";
import { Form } from "./components/form.tsx";
import { FormHeader } from "./components/form-header.tsx";
import { FormErrors } from "./components/form-errors.tsx";
import { NodeList } from "./components/node-list.tsx";
import { FormSection } from "./components/form-section.tsx";
import { PageStatus } from "./components/page-status.tsx";
import { PageNavigation } from "./components/page-navigation.tsx";
import { EmptyState } from "./components/empty-state.tsx";
import { FormActions } from "./components/form-actions.tsx";
import { GroupAddButton } from "./components/group-add-button.tsx";
import { GroupWrapperScaffold } from "./components/group-wrapper-scaffold.tsx";
import { GroupWrapperScaffoldItem } from "./components/group-wrapper-scaffold-item.tsx";
import { GroupRemoveButton } from "./components/group-remove-button.tsx";
import { GroupScaffold } from "./components/group-scaffold.tsx";
import { GroupActions } from "./components/group-actions.tsx";
import { GridTable } from "./components/grid-table.tsx";
import { InputGroup } from "./components/input-group.tsx";
import { FileInput } from "./components/file-input.tsx";
import { TabContainer } from "./components/tab-container.tsx";
import { DisplayRenderer } from "./components/display-renderer.tsx";
import { Link } from "./components/link.tsx";
import "./global.css";

export type { Theme };
export type { TextInputProps, TextAreaProps, NumberInputProps };
export { Button, TextInput, TextArea, NumberInput };
export { TabContainer, DisplayRenderer, Link };

const passthrough: Theme = {
  Button,
  TextInput,
  TextArea,
  NumberInput,
  DateInput,
  DateTimeInput,
  TimeInput,
  SliderInput,
  SpinnerInput,
  SelectInput,
  RadioButtonList,
  CheckboxList,
  MultiSelectInput,
  Errors,
  NodeHeader,
  QuestionScaffold,
  OptionsState,
  NodeHelp,
  NodeLegal,
  NodeFlyover,
  AnswerAddButton,
  AnswerList,
  AnswerRemoveButton,
  AnswerScaffold,
  Form,
  FormHeader,
  FormErrors,
  NodeList,
  FormSection,
  PageStatus,
  PageNavigation,
  EmptyState,
  FormActions,
  GroupAddButton,
  GroupWrapperScaffold,
  GroupWrapperScaffoldItem,
  GroupRemoveButton,
  GroupScaffold,
  GroupActions,
  GridTable,
  InputGroup,
  FileInput,
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
export type SelectInputProps = ComponentProps<typeof passthrough.SelectInput>;
export type RadioButtonListProps = ComponentProps<
  typeof passthrough.RadioButtonList
>;
export type CheckboxListProps = ComponentProps<typeof passthrough.CheckboxList>;

export default theme;
