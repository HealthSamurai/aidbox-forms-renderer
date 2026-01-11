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
import { Label } from "./components/label.tsx";
import { QuestionScaffold } from "./components/question-scaffold.tsx";
import { OptionsLoading } from "./components/options-loading.tsx";
import { Help } from "./components/help.tsx";
import { Legal } from "./components/legal.tsx";
import { Flyover } from "./components/flyover.tsx";
import { AnswerList } from "./components/answer-list.tsx";
import {
  AnswerRemoveButton,
  AnswerScaffold,
} from "./components/answer-scaffold.tsx";
import { Form } from "./components/form.tsx";
import { Stack } from "./components/stack.tsx";
import { GroupList } from "./components/group-list.tsx";
import { GroupScaffold } from "./components/group-scaffold.tsx";
import { Table } from "./components/table.tsx";
import { InputGroup } from "./components/input-group.tsx";
import { FileInput } from "./components/file-input.tsx";
import { TabContainer } from "./components/tab-container.tsx";
import { DisplayRenderer } from "./components/display-renderer.tsx";
import { Link } from "./components/link.tsx";

export { TextInput } from "./components/text-input.tsx";
export { TextArea } from "./components/text-area.tsx";
export { NumberInput } from "./components/number-input.tsx";
export { TabContainer } from "./components/tab-container.tsx";
export { DisplayRenderer } from "./components/display-renderer.tsx";
export { Link } from "./components/link.tsx";

export const theme: Theme = {
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
  Label,
  QuestionScaffold,
  OptionsLoading,
  Help,
  Legal,
  Flyover,
  AnswerList,
  AnswerRemoveButton,
  AnswerScaffold,
  Form,
  Stack,
  GroupList,
  GroupScaffold,
  Table,
  InputGroup,
  FileInput,
  TabContainer,
  DisplayRenderer,
  Link,
};
