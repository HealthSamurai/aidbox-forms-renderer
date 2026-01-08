import type { Theme } from "@aidbox-forms/theme";
import { TextInput } from "./components/text-input.tsx";
import { TextArea } from "./components/text-area.tsx";
import { NumberInput } from "./components/number-input.tsx";
import { DateInput } from "./components/date-input.tsx";
import { DateTimeInput } from "./components/date-time-input.tsx";
import { TimeInput } from "./components/time-input.tsx";
import { SliderInput } from "./components/slider-input.tsx";
import { SpinnerInput } from "./components/spinner-input.tsx";
import { SelectInput } from "./components/select-input.tsx";
import { RadioButton } from "./components/radio-button.tsx";
import { RadioButtonList } from "./components/radio-button-list.tsx";
import { Checkbox } from "./components/checkbox.tsx";
import { CheckboxList } from "./components/checkbox-list.tsx";
import { MultiSelectInput } from "./components/multi-select-input.tsx";
import { CustomOptionForm } from "./components/custom-option-form.tsx";
import { Errors } from "./components/errors.tsx";
import { NodeHeader } from "./components/node-header.tsx";
import { QuestionScaffold } from "./components/question-scaffold.tsx";
import { OptionsLoading } from "./components/options-loading.tsx";
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
import { FormSubmitButton } from "./components/form-submit-button.tsx";
import { FormResetButton } from "./components/form-reset-button.tsx";
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

export { TextInput, TextArea, NumberInput };
export { TabContainer, DisplayRenderer, Link };

const passthrough: Theme = {
  TextInput,
  TextArea,
  NumberInput,
  DateInput,
  DateTimeInput,
  TimeInput,
  SliderInput,
  SpinnerInput,
  SelectInput,
  RadioButton,
  RadioButtonList,
  Checkbox,
  CheckboxList,
  MultiSelectInput,
  CustomOptionForm,
  Errors,
  NodeHeader,
  QuestionScaffold,
  OptionsLoading,
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
  FormSubmitButton,
  FormResetButton,
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

export default theme;
