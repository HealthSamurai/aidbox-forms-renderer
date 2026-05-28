import type { Theme } from "@formbox/theme";

import { AnswerList } from "./answer-list.ts";
import { AnswerScaffold } from "./answer-scaffold.ts";
import { Checkbox } from "./checkbox.ts";
import { CheckboxList } from "./checkbox-list.ts";
import { CustomOptionForm } from "./custom-option-form.ts";
import { DateInput } from "./date-input.ts";
import { DateTimeInput } from "./date-time-input.ts";
import { DisplayRenderer } from "./display-renderer.ts";
import { Errors } from "./errors.ts";
import { FileInput } from "./file-input.ts";
import { Flyover } from "./flyover.ts";
import { Footer } from "./footer.ts";
import { Form } from "./form.ts";
import { GroupList } from "./group-list.ts";
import { GroupScaffold } from "./group-scaffold.ts";
import { Header } from "./header.ts";
import { Help } from "./help.ts";
import { InputGroup } from "./input-group.ts";
import { Label } from "./label.ts";
import { LanguageSelector } from "./language-selector.ts";
import { Legal } from "./legal.ts";
import { Link } from "./link.ts";
import { MultiSelectInput } from "./multi-select-input.ts";
import { NumberInput } from "./number-input.ts";
import { OptionDisplay } from "./option-display.ts";
import { OptionsLoading } from "./options-loading.ts";
import { QuestionScaffold } from "./question-scaffold.ts";
import { RadioButton } from "./radio-button.ts";
import { RadioButtonList } from "./radio-button-list.ts";
import { SelectInput } from "./select-input.ts";
import { SignatureInput } from "./signature-input.ts";
import { SliderInput } from "./slider-input.ts";
import { SpinnerInput } from "./spinner-input.ts";
import { Stack } from "./stack.ts";
import { TabContainer } from "./tab-container.ts";
import { Table } from "./table.ts";
import { TextArea } from "./text-area.ts";
import { TextInput } from "./text-input.ts";
import { TimeInput } from "./time-input.ts";

export {
  HtmlProvider,
  HtmxThemeProvider,
  type HtmxThemeValue,
} from "../theme-runtime.ts";
export { stripHtmlTag } from "../theme-runtime.ts";

export const theme: Theme = {
  TextInput,
  TextArea,
  NumberInput,
  DateInput,
  DateTimeInput,
  TimeInput,
  SliderInput,
  SpinnerInput,
  OptionDisplay,
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
  Header,
  Footer,
  Form,
  Stack,
  AnswerList,
  AnswerScaffold,
  GroupList,
  GroupScaffold,
  Table,
  InputGroup,
  FileInput,
  SignatureInput,
  DisplayRenderer,
  TabContainer,
  Link,
  LanguageSelector,
};

export function createTheme(): Theme {
  return theme;
}
