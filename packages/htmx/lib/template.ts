import type {
  AnswerListProperties,
  AnswerScaffoldProperties,
  Attachment,
  CheckboxListProperties,
  CheckboxProperties,
  CustomOptionFormProperties,
  DateInputProperties,
  DateTimeInputProperties,
  DisplayRendererProperties,
  ErrorsProperties,
  FileInputProperties,
  FlyoverProperties,
  FooterProperties,
  FormPagination,
  FormProperties,
  GroupListProperties,
  GroupScaffoldProperties,
  HeaderProperties,
  HelpProperties,
  InputGroupProperties,
  LabelProperties,
  LanguageSelectorProperties,
  LegalProperties,
  LinkProperties,
  MultiSelectInputProperties,
  NodePath,
  NumberInputProperties,
  OptionDisplayProperties,
  OptionItem,
  OptionsLoadingProperties,
  QuestionScaffoldProperties,
  RadioButtonListProperties,
  RadioButtonProperties,
  SelectInputProperties,
  SelectedOptionItem,
  SignatureInputProperties,
  SliderInputProperties,
  SpinnerInputProperties,
  StackProperties,
  Strings,
  TabContainerProperties,
  TableCell,
  TableColumn,
  TableProperties,
  TableRow,
  TextAreaProperties,
  TextInputProperties,
  TimeInputProperties,
} from "@formbox/theme";
import type { ReactNode } from "react";

import {
  dateTimeLocalInputValue,
  isDateTimeLocalInputValue,
} from "./date-time.ts";

export type HtmlAttributeValue = string | number | boolean | null | undefined;
export type HtmlAttributes = Readonly<Record<string, HtmlAttributeValue>>;
export type RenderHtml = (node: ReactNode) => string;
export type InputGroupState = {
  readonly size: number;
  readonly index: number;
};

export type Template<
  TProperties extends TemplateProperties = TemplateProperties,
> = (properties: TProperties) => string;

export type AnswerField =
  | "value"
  | "system"
  | "code"
  | "display"
  | "unit"
  | "baseline"
  | "signature";

export interface TemplateFieldAttributes {
  readonly field: AnswerField;
  readonly name?: string | undefined;
  readonly "data-fb-link-id"?: string | undefined;
  readonly "data-fb-field"?: AnswerField | undefined;
  readonly "hx-include": "closest form";
}

type RuntimeProperties =
  | "onAdd"
  | "onCancel"
  | "onChange"
  | "onDeselect"
  | "onNext"
  | "onPrev"
  | "onRemove"
  | "onSearch"
  | "onSelect"
  | "onSubmit"
  | "onToggleExpanded";

type TemplateBase<TProperties> = Readonly<Omit<TProperties, RuntimeProperties>>;

type FieldTemplateProperties<TProperties> = TemplateBase<TProperties> &
  TemplateFieldAttributes;

export type TemplateOptionItem = Omit<OptionItem, "label"> & {
  readonly label: string;
};

export type TemplateSelectedOptionItem = TemplateOptionItem & {
  readonly ariaDescribedBy?: string | undefined;
  readonly errors?: string | undefined;
};

export type TextInputTemplateProperties =
  FieldTemplateProperties<TextInputProperties> & {
    readonly inputType: string;
  };
export type TextAreaTemplateProperties =
  FieldTemplateProperties<TextAreaProperties>;
export type NumberInputTemplateProperties =
  FieldTemplateProperties<NumberInputProperties> & NumberInputViewProperties;
export type DateInputTemplateProperties =
  FieldTemplateProperties<DateInputProperties> & {
    readonly inputType: "date" | "text";
    readonly step: undefined;
  };
export type DateTimeInputTemplateProperties =
  FieldTemplateProperties<DateTimeInputProperties> & {
    readonly baselineName?: string | undefined;
    readonly baselineValue?: string | undefined;
    readonly inputType: "datetime-local" | "text";
    readonly step?: "any" | undefined;
    readonly inputValue: string;
    readonly inputMin?: string | undefined;
    readonly inputMax?: string | undefined;
  };
export type TimeInputTemplateProperties =
  FieldTemplateProperties<TimeInputProperties>;
export type SliderInputTemplateProperties =
  FieldTemplateProperties<SliderInputProperties> & NumberInputViewProperties;
export type SpinnerInputTemplateProperties =
  FieldTemplateProperties<SpinnerInputProperties> & NumberInputViewProperties;

type NumberInputViewProperties = {
  readonly inputValue: number | "";
  readonly unitId?: string | undefined;
  readonly describedBy?: string | undefined;
};

export type OptionDisplayTemplateProperties = Omit<
  TemplateBase<OptionDisplayProperties>,
  "children" | "media"
> & {
  readonly attachmentLabel: string;
  readonly children: string;
  readonly media: string;
};

export type SelectInputTemplateProperties = Omit<
  FieldTemplateProperties<SelectInputProperties>,
  "customOptionForm" | "options" | "selectedOption" | "specifyOtherOption"
> & {
  readonly baselineName?: string | undefined;
  readonly baselineValue?: string | undefined;
  readonly hiddenValue: boolean;
  readonly isBusy?: "true" | undefined;
  readonly searchLabel: string;
  readonly searchName?: string | undefined;
  readonly value: string;
  readonly options: readonly SelectOptionTemplateItem[];
  readonly selectedOption: TemplateSelectedOptionItem | undefined;
  readonly specifyOtherOption?: TemplateOptionItem | undefined;
  readonly customOptionForm?: string | undefined;
};

export type SelectOptionTemplateItem = TemplateOptionItem & {
  readonly selected: boolean;
};

export type RadioButtonTemplateProperties = Omit<
  FieldTemplateProperties<RadioButtonProperties>,
  "label"
> & {
  readonly hiddenValue?: string | undefined;
  readonly label?: string | undefined;
};

export type RadioButtonListTemplateProperties = Omit<
  FieldTemplateProperties<RadioButtonListProperties>,
  "customOptionForm" | "options" | "selectedOption" | "specifyOtherOption"
> & {
  readonly baselineName?: string | undefined;
  readonly baselineValue?: string | undefined;
  readonly hiddenValue?: string | undefined;
  readonly options: readonly RadioOptionTemplateItem[];
  readonly selectedOption: TemplateSelectedOptionItem | undefined;
  readonly specifyOtherOption?: TemplateOptionItem | undefined;
  readonly customOptionForm?: string | undefined;
};

export type RadioOptionTemplateItem = TemplateOptionItem & {
  readonly id: string;
  readonly checked: boolean;
  readonly disabled?: boolean | undefined;
};

export type CheckboxTemplateProperties = Omit<
  FieldTemplateProperties<CheckboxProperties>,
  "label"
> & {
  readonly hiddenValue?: string | undefined;
  readonly label?: string | undefined;
};

export type CheckboxListTemplateProperties = Omit<
  FieldTemplateProperties<CheckboxListProperties>,
  "customOptionForm" | "options" | "selectedOptions" | "specifyOtherOption"
> & {
  readonly baselineName?: string | undefined;
  readonly hiddenInputs: readonly HiddenTemplateInput[];
  readonly trailingHiddenInputs: readonly HiddenTemplateInput[];
  readonly options: readonly CheckboxOptionTemplateItem[];
  readonly selectedOptions: readonly TemplateSelectedOptionItem[];
  readonly selectedName?: string | undefined;
  readonly specifyOtherOption?: TemplateOptionItem | undefined;
  readonly customOptionForm?: string | undefined;
};

export type MultiSelectInputTemplateProperties = Omit<
  FieldTemplateProperties<MultiSelectInputProperties>,
  "customOptionForm" | "options" | "selectedOptions" | "specifyOtherOption"
> & {
  readonly baselineName?: string | undefined;
  readonly searchLabel: string;
  readonly searchName?: string | undefined;
  readonly hiddenInputs: readonly HiddenTemplateInput[];
  readonly trailingHiddenInputs: readonly HiddenTemplateInput[];
  readonly options: readonly CheckboxOptionTemplateItem[];
  readonly selectedOptions: readonly TemplateSelectedOptionItem[];
  readonly selectedName?: string | undefined;
  readonly specifyOtherOption?: TemplateOptionItem | undefined;
  readonly customOptionForm?: string | undefined;
};

export type HiddenTemplateInput = {
  readonly name: string;
  readonly value: string;
};

export type MediaKind = "fallback" | "image" | "audio" | "video" | "link";

export type MediaTemplateProperties = {
  readonly attachment: Attachment;
  readonly id?: string | undefined;
  readonly label: string;
  readonly source?: string | undefined;
  readonly contentType?: string | undefined;
  readonly kind: MediaKind;
  readonly isFallback: boolean;
  readonly isImage: boolean;
  readonly isAudio: boolean;
  readonly isVideo: boolean;
  readonly isLink: boolean;
};

export type CheckboxOptionTemplateItem = TemplateOptionItem & {
  readonly id: string;
  readonly selected: boolean;
  readonly disabled?: boolean | undefined;
  readonly hiddenInput?: HiddenTemplateInput | undefined;
};

export type CustomOptionFormTemplateProperties = Omit<
  TemplateBase<CustomOptionFormProperties>,
  "content" | "errors"
> & {
  readonly actionName: string;
  readonly cancelLabel: string;
  readonly cancelId?: string | undefined;
  readonly content: string;
  readonly errors?: string | undefined;
  readonly submitId?: string | undefined;
  readonly submitLabel: string;
};

export type ErrorsTemplateProperties = Omit<
  TemplateBase<ErrorsProperties>,
  "messages"
> & {
  readonly hasMessages: boolean;
  readonly messages: readonly { readonly html: string }[];
};

export type LabelTemplateProperties = Omit<
  TemplateBase<LabelProperties>,
  "children" | "flyover" | "help" | "legal" | "prefix"
> & {
  readonly attachmentLabel: string;
  readonly prefix?: string | undefined;
  readonly children: string;
  readonly content: string;
  readonly isLegend: boolean;
  readonly isText: boolean;
  readonly help?: string | undefined;
  readonly legal?: string | undefined;
  readonly flyover?: string | undefined;
  readonly media: string;
  readonly supportHyperlinks?: ReadonlyArray<
    NonNullable<LabelProperties["supportHyperlinks"]>[number] & {
      readonly id: string;
      readonly labelHtml: string;
    }
  >;
};

export type LabelContentTemplateProperties = {
  readonly children: string;
  readonly prefix?: string | undefined;
  readonly shortText?: string | undefined;
  readonly required?: boolean | undefined;
  readonly help?: string | undefined;
  readonly legal?: string | undefined;
  readonly flyover?: string | undefined;
  readonly hasShortText: boolean;
};

export type QuestionScaffoldTemplateProperties = Omit<
  TemplateBase<QuestionScaffoldProperties>,
  "children" | "errors" | "header" | "signature"
> & {
  readonly header?: string | undefined;
  readonly children: string;
  readonly expandedChildren: string;
  readonly expandedValue?: string | undefined;
  readonly errors?: string | undefined;
  readonly summaryLabel?: string | undefined;
  readonly signature?: string | undefined;
} & CollapsibleActionProperties;

export type OptionsLoadingTemplateProperties =
  TemplateBase<OptionsLoadingProperties> & {
    readonly loadingLabel: string;
  };

export type HelpTemplateProperties = Omit<
  TemplateBase<HelpProperties>,
  "children"
> & {
  readonly ariaLabel: string;
  readonly buttonId?: string | undefined;
  readonly children: string;
};

export type LegalTemplateProperties = Omit<
  TemplateBase<LegalProperties>,
  "children"
> & {
  readonly ariaLabel: string;
  readonly buttonId?: string | undefined;
  readonly children: string;
};

export type FlyoverTemplateProperties = Omit<
  TemplateBase<FlyoverProperties>,
  "children"
> & {
  readonly ariaLabel: string;
  readonly buttonId?: string | undefined;
  readonly children: string;
};

export type HeaderTemplateProperties = Omit<
  TemplateBase<HeaderProperties>,
  "children"
> & {
  readonly children: string;
};

export type FooterTemplateProperties = Omit<
  TemplateBase<FooterProperties>,
  "children"
> & {
  readonly children: string;
};

export type TemplateFormPagination = Omit<
  FormPagination,
  "onNext" | "onPrev"
> & {
  readonly nextId?: string | undefined;
  readonly nextLabel: string;
  readonly previousId?: string | undefined;
  readonly previousLabel: string;
};

export type FormTitleTemplateProperties = {
  readonly title: string;
};

export type FormDescriptionTemplateProperties = {
  readonly description: string;
};

export type PaginationTemplateProperties = TemplateFormPagination & {
  readonly actionName: string;
  readonly previousAction: "page-prev";
  readonly nextAction: "page-next";
  readonly navigationLabel: string;
  readonly currentLabel: string;
  readonly previousTargetLabel: string;
  readonly nextTargetLabel: string;
};

export type SubmitButtonTemplateProperties = {
  readonly id?: string | undefined;
  readonly actionName: string;
  readonly value: "submit";
  readonly label: string;
};

export type ShortTextStyleTemplateProperties = Record<string, never>;

export type FormTemplateProperties = Omit<
  TemplateBase<FormProperties>,
  | "after"
  | "before"
  | "children"
  | "errors"
  | "languageSelector"
  | "pagination"
  | "signature"
> & {
  readonly after?: string | undefined;
  readonly before?: string | undefined;
  readonly children: string;
  readonly errors?: string | undefined;
  readonly fields: string;
  readonly hiddenFields: string;
  readonly attributes: HtmlAttributes;
  readonly titleHtml?: string | undefined;
  readonly descriptionHtml?: string | undefined;
  readonly languageSelector?: string | undefined;
  readonly pagination?: TemplateFormPagination | undefined;
  readonly paginationHtml?: string | undefined;
  readonly shortTextStyle: string;
  readonly signature?: string | undefined;
  readonly submitLabel: string;
  readonly submitButton: string;
};

export type StackTemplateProperties = Omit<
  TemplateBase<StackProperties>,
  "children"
> & {
  readonly children: string;
};

export type AddActionProperties = {
  readonly actionName: string;
  readonly addAction?: string | undefined;
  readonly addId?: string | undefined;
  readonly addLabel: string;
  readonly count?: number | undefined;
  readonly countName?: string | undefined;
  readonly linkId?: string | undefined;
};

export type RemoveActionProperties = {
  readonly actionName: string;
  readonly linkId?: string | undefined;
  readonly removeAction?: string | undefined;
  readonly removeId?: string | undefined;
  readonly removeLabel: string;
};

export type CollapsibleActionProperties = {
  readonly actionName?: string | undefined;
  readonly collapseLabel?: string | undefined;
  readonly expandedName?: string | undefined;
  readonly expandLabel?: string | undefined;
  readonly toggleAction?: string | undefined;
  readonly toggleId?: string | undefined;
};

export type AnswerListTemplateProperties = Omit<
  TemplateBase<AnswerListProperties>,
  "children"
> & {
  readonly children: string;
  readonly hasCount: boolean;
} & AddActionProperties;

export type AnswerScaffoldTemplateProperties = Omit<
  TemplateBase<AnswerScaffoldProperties>,
  "children" | "control" | "errors"
> & {
  readonly control: string;
  readonly errors?: string | undefined;
  readonly children?: string | undefined;
} & RemoveActionProperties;

export type GroupListTemplateProperties = Omit<
  TemplateBase<GroupListProperties>,
  "children" | "errors" | "header"
> & {
  readonly header?: string | undefined;
  readonly errors?: string | undefined;
  readonly children: string;
  readonly hasCount: boolean;
} & AddActionProperties;

export type GroupScaffoldTemplateProperties = Omit<
  TemplateBase<GroupScaffoldProperties>,
  "children" | "errors" | "header" | "signature"
> & {
  readonly header?: string | undefined;
  readonly children?: string | undefined;
  readonly expandedChildren: string;
  readonly expandedValue?: string | undefined;
  readonly errors?: string | undefined;
  readonly summaryLabel?: string | undefined;
  readonly signature?: string | undefined;
} & RemoveActionProperties &
  CollapsibleActionProperties;

export type TemplateTableColumn = Omit<TableColumn, "content" | "errors"> & {
  readonly content: string;
  readonly errors?: string | undefined;
  readonly widthStyle?: string | undefined;
};

export type TemplateTableCell = Omit<TableCell, "content"> & {
  readonly content?: string | undefined;
};

export type TemplateTableRow = Omit<
  TableRow,
  "cells" | "content" | "errors" | "onRemove"
> & {
  readonly content?: string | undefined;
  readonly errors?: string | undefined;
  readonly cells: readonly TemplateTableCell[];
  readonly removeLabelHtml: string;
} & RemoveActionProperties;

export type TableTemplateProperties = Omit<
  TemplateBase<TableProperties>,
  "columns" | "rows"
> & {
  readonly hasRowHeader: boolean;
  readonly columns: readonly TemplateTableColumn[];
  readonly rows: readonly TemplateTableRow[];
};

export type InputGroupTemplateProperties = Omit<
  TemplateBase<InputGroupProperties>,
  "children"
> & {
  readonly children: string;
};

export type FileInputTemplateProperties =
  FieldTemplateProperties<FileInputProperties> & {
    readonly clearId?: string | undefined;
    readonly clearLabel: string;
    readonly hiddenValue?: string | undefined;
    readonly clearAction: boolean;
    readonly dataLinkId?: string | undefined;
    readonly hxInclude: "closest form";
  };
export type SignatureInputTemplateProperties =
  FieldTemplateProperties<SignatureInputProperties> & {
    readonly inputValue: string;
  };

export type DisplayRendererTemplateProperties = Omit<
  TemplateBase<DisplayRendererProperties>,
  "children"
> & {
  readonly children: string;
};

export type TemplateTabItem = Omit<
  TabContainerProperties["items"][number],
  "content" | "label"
> & {
  readonly label: string;
  readonly content: string;
  readonly selected?: boolean | undefined;
  readonly ariaSelected: "true" | "false";
  readonly tabAction?: string | undefined;
};

export type TabContainerTemplateProperties = Omit<
  TemplateBase<TabContainerProperties>,
  "errors" | "header" | "items"
> & {
  readonly header?: string | undefined;
  readonly errors?: string | undefined;
  readonly items: readonly TemplateTabItem[];
  readonly active?: TemplateTabItem | undefined;
  readonly actionName?: string | undefined;
  readonly tabName?: string | undefined;
};

export type LinkTemplateProperties = Omit<
  TemplateBase<LinkProperties>,
  "children"
> & {
  readonly children: string;
};

export type LanguageSelectorTemplateProperties = Omit<
  TemplateBase<LanguageSelectorProperties>,
  "options"
> & {
  readonly id?: string | undefined;
  readonly name: string;
  readonly options: ReadonlyArray<
    LanguageSelectorProperties["options"][number] & {
      readonly selected: boolean;
    }
  >;
};

export type TemplateProperties =
  | TextInputTemplateProperties
  | TextAreaTemplateProperties
  | NumberInputTemplateProperties
  | DateInputTemplateProperties
  | DateTimeInputTemplateProperties
  | TimeInputTemplateProperties
  | SliderInputTemplateProperties
  | SpinnerInputTemplateProperties
  | OptionDisplayTemplateProperties
  | SelectInputTemplateProperties
  | RadioButtonTemplateProperties
  | RadioButtonListTemplateProperties
  | CheckboxTemplateProperties
  | CheckboxListTemplateProperties
  | MultiSelectInputTemplateProperties
  | CustomOptionFormTemplateProperties
  | MediaTemplateProperties
  | ErrorsTemplateProperties
  | LabelTemplateProperties
  | LabelContentTemplateProperties
  | QuestionScaffoldTemplateProperties
  | OptionsLoadingTemplateProperties
  | HelpTemplateProperties
  | LegalTemplateProperties
  | FlyoverTemplateProperties
  | HeaderTemplateProperties
  | FooterTemplateProperties
  | FormTitleTemplateProperties
  | FormDescriptionTemplateProperties
  | PaginationTemplateProperties
  | SubmitButtonTemplateProperties
  | ShortTextStyleTemplateProperties
  | FormTemplateProperties
  | StackTemplateProperties
  | AnswerListTemplateProperties
  | AnswerScaffoldTemplateProperties
  | GroupListTemplateProperties
  | GroupScaffoldTemplateProperties
  | TableTemplateProperties
  | InputGroupTemplateProperties
  | FileInputTemplateProperties
  | SignatureInputTemplateProperties
  | DisplayRendererTemplateProperties
  | TabContainerTemplateProperties
  | LinkTemplateProperties
  | LanguageSelectorTemplateProperties;

export interface Templates {
  readonly TextInput?: Template<TextInputTemplateProperties> | undefined;
  readonly TextArea?: Template<TextAreaTemplateProperties> | undefined;
  readonly NumberInput?: Template<NumberInputTemplateProperties> | undefined;
  readonly DateInput?: Template<DateInputTemplateProperties> | undefined;
  readonly DateTimeInput?:
    | Template<DateTimeInputTemplateProperties>
    | undefined;
  readonly TimeInput?: Template<TimeInputTemplateProperties> | undefined;
  readonly SliderInput?: Template<SliderInputTemplateProperties> | undefined;
  readonly SpinnerInput?: Template<SpinnerInputTemplateProperties> | undefined;
  readonly OptionDisplay?:
    | Template<OptionDisplayTemplateProperties>
    | undefined;
  readonly SelectInput?: Template<SelectInputTemplateProperties> | undefined;
  readonly RadioButton?: Template<RadioButtonTemplateProperties> | undefined;
  readonly RadioButtonList?:
    | Template<RadioButtonListTemplateProperties>
    | undefined;
  readonly Checkbox?: Template<CheckboxTemplateProperties> | undefined;
  readonly CheckboxList?: Template<CheckboxListTemplateProperties> | undefined;
  readonly MultiSelectInput?:
    | Template<MultiSelectInputTemplateProperties>
    | undefined;
  readonly CustomOptionForm?:
    | Template<CustomOptionFormTemplateProperties>
    | undefined;
  readonly Media?: Template<MediaTemplateProperties> | undefined;
  readonly Errors?: Template<ErrorsTemplateProperties> | undefined;
  readonly Label?: Template<LabelTemplateProperties> | undefined;
  readonly LabelContent?: Template<LabelContentTemplateProperties> | undefined;
  readonly QuestionScaffold?:
    | Template<QuestionScaffoldTemplateProperties>
    | undefined;
  readonly OptionsLoading?:
    | Template<OptionsLoadingTemplateProperties>
    | undefined;
  readonly Help?: Template<HelpTemplateProperties> | undefined;
  readonly Legal?: Template<LegalTemplateProperties> | undefined;
  readonly Flyover?: Template<FlyoverTemplateProperties> | undefined;
  readonly Header?: Template<HeaderTemplateProperties> | undefined;
  readonly Footer?: Template<FooterTemplateProperties> | undefined;
  readonly FormTitle?: Template<FormTitleTemplateProperties> | undefined;
  readonly FormDescription?:
    | Template<FormDescriptionTemplateProperties>
    | undefined;
  readonly Pagination?: Template<PaginationTemplateProperties> | undefined;
  readonly SubmitButton?: Template<SubmitButtonTemplateProperties> | undefined;
  readonly ShortTextStyle?:
    | Template<ShortTextStyleTemplateProperties>
    | undefined;
  readonly Form?: Template<FormTemplateProperties> | undefined;
  readonly Stack?: Template<StackTemplateProperties> | undefined;
  readonly AnswerList?: Template<AnswerListTemplateProperties> | undefined;
  readonly AnswerScaffold?:
    | Template<AnswerScaffoldTemplateProperties>
    | undefined;
  readonly GroupList?: Template<GroupListTemplateProperties> | undefined;
  readonly GroupScaffold?:
    | Template<GroupScaffoldTemplateProperties>
    | undefined;
  readonly Table?: Template<TableTemplateProperties> | undefined;
  readonly InputGroup?: Template<InputGroupTemplateProperties> | undefined;
  readonly FileInput?: Template<FileInputTemplateProperties> | undefined;
  readonly SignatureInput?:
    | Template<SignatureInputTemplateProperties>
    | undefined;
  readonly DisplayRenderer?:
    | Template<DisplayRendererTemplateProperties>
    | undefined;
  readonly TabContainer?: Template<TabContainerTemplateProperties> | undefined;
  readonly Link?: Template<LinkTemplateProperties> | undefined;
  readonly LanguageSelector?:
    | Template<LanguageSelectorTemplateProperties>
    | undefined;
}

export type RequiredTemplates = {
  readonly [K in keyof Templates]-?: NonNullable<Templates[K]>;
};

export type TemplateName = keyof Templates;

export const templateNames = [
  "TextInput",
  "TextArea",
  "NumberInput",
  "DateInput",
  "DateTimeInput",
  "TimeInput",
  "SliderInput",
  "SpinnerInput",
  "OptionDisplay",
  "SelectInput",
  "RadioButton",
  "RadioButtonList",
  "Checkbox",
  "CheckboxList",
  "MultiSelectInput",
  "CustomOptionForm",
  "Media",
  "Errors",
  "Label",
  "LabelContent",
  "QuestionScaffold",
  "OptionsLoading",
  "Help",
  "Legal",
  "Flyover",
  "Header",
  "Footer",
  "FormTitle",
  "FormDescription",
  "Pagination",
  "SubmitButton",
  "ShortTextStyle",
  "Form",
  "Stack",
  "AnswerList",
  "AnswerScaffold",
  "GroupList",
  "GroupScaffold",
  "Table",
  "InputGroup",
  "FileInput",
  "SignatureInput",
  "DisplayRenderer",
  "TabContainer",
  "Link",
  "LanguageSelector",
] as const satisfies readonly TemplateName[];

export const ACTION_FIELD = "fb[action]";
export const LANGUAGE_FIELD = "fb[language]";
export const PAGE_FIELD = "fb[page]";
export const SUBMIT_ATTEMPTED_FIELD = "fb[submitAttempted]";

export type ActionKind =
  | "add-group"
  | "remove-group"
  | "add-answer"
  | "remove-answer"
  | "toggle-expanded"
  | "select-tab";

export function valueName(path: NodePath, field: AnswerField): string {
  return bracketName(["fb", "answer", ...pathParts(path), field]);
}

export function countName(path: NodePath): string {
  return bracketName(["fb", "count", ...pathParts(path)]);
}

export function calculatedName(path: NodePath): string {
  return bracketName(["fb", "calculated", ...pathParts(path)]);
}

export function readOnlyName(path: NodePath): string {
  return bracketName(["fb", "readonly", ...pathParts(path)]);
}

export function selectedName(path: NodePath): string {
  return bracketName(["fb", "selected", ...pathParts(path)]);
}

export function optionValueName(path: NodePath, token: string): string {
  return bracketName([
    "fb",
    "option",
    ...pathParts(path),
    encodeURIComponent(token),
  ]);
}

export function unitValueName(path: NodePath, token: string): string {
  return bracketName([
    "fb",
    "unit",
    ...pathParts(path),
    encodeURIComponent(token),
  ]);
}

export function unitValueNamePrefix(path: NodePath): string {
  return bracketName(["fb", "unit", ...pathParts(path)]);
}

export function searchName(path: NodePath): string {
  return bracketName(["fb", "search", ...pathParts(path)]);
}

export function customUnitFormName(path: NodePath): string {
  return bracketName(["fb", "custom-unit-form", ...pathParts(path)]);
}

export function expandedName(path: NodePath): string {
  return bracketName(["fb", "expanded", ...pathParts(path)]);
}

export function tabName(path: NodePath): string {
  return bracketName(["fb", "tab", ...pathParts(path)]);
}

export function signatureName(path: NodePath): string {
  return bracketName(["fb", "signature", ...pathParts(path)]);
}

export function actionValue(kind: ActionKind, path: NodePath): string {
  return `${kind}${pathParts(path)
    .map((part) => `[${part}]`)
    .join("")}`;
}

export function stableId(
  base: string | undefined,
  ...parts: Array<string | number | undefined>
): string | undefined {
  if (base === undefined) {
    return undefined;
  }

  return [base, ...parts]
    .filter((part): part is string | number => part !== undefined)
    .map(String)
    .join("__");
}

export function pathControlId(
  token: string,
  path: NodePath | undefined,
  ...parts: Array<string | number | undefined>
): string | undefined {
  if (path === undefined) {
    return undefined;
  }

  return stableId(
    token,
    ...path.flatMap((segment) =>
      segment.index === undefined
        ? [segment.linkId]
        : [segment.linkId, segment.index],
    ),
    ...parts,
  );
}

export function lastLinkId(path: NodePath): string {
  return path.at(-1)?.linkId ?? "";
}

export function htmlAttributes(values: HtmlAttributes): string {
  return Object.entries(values)
    .map(([name, value]) => attribute(name, value))
    .join("");
}

export function attribute(name: string, value: unknown): string {
  if (value === undefined || value === null || value === false) {
    return "";
  }

  if (value === true) {
    return ` ${name}`;
  }

  return ` ${name}="${escapeHtml(String(value))}"`;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function inputValue(value: unknown): string {
  if (value === undefined) {
    return "";
  }

  return typeof value === "object" && value !== null
    ? JSON.stringify(value)
    : String(value);
}

export function isPreservedOptionToken(token: string): boolean {
  return token.includes("__custom__") || token.includes("__legacy__");
}

export function mediaHtml(
  templates: Pick<RequiredTemplates, "Media">,
  attachment: Attachment | undefined,
  fallbackLabel: string,
  id?: string | undefined,
): string {
  if (attachment === undefined) {
    return "";
  }

  const label = attachment.title ?? attachment.url ?? fallbackLabel;
  const source = attachment.url ?? attachmentSource(attachment);
  const contentType = attachment.contentType?.toLowerCase();
  const kind: MediaKind =
    source === undefined
      ? "fallback"
      : contentType?.startsWith("image/")
        ? "image"
        : contentType?.startsWith("audio/")
          ? "audio"
          : contentType?.startsWith("video/")
            ? "video"
            : "link";

  return templates.Media({
    attachment,
    id,
    label,
    source,
    contentType,
    kind,
    isFallback: kind === "fallback",
    isImage: kind === "image",
    isAudio: kind === "audio",
    isVideo: kind === "video",
    isLink: kind === "link",
  });
}

type FormFieldsProperties = Omit<
  FormTemplateProperties,
  "attributes" | "fields"
>;

export function formFieldsTemplate(properties: FormFieldsProperties): string {
  return [
    properties.hiddenFields,
    properties.shortTextStyle,
    properties.titleHtml ?? "",
    properties.descriptionHtml ?? "",
    properties.languageSelector ?? "",
    properties.errors ?? "",
    properties.before ?? "",
    properties.children,
    properties.after ?? "",
    properties.signature ?? "",
    properties.paginationHtml ?? "",
    properties.submitButton,
  ].join("");
}

export function pageHiddenField(currentPage: number | undefined): string {
  return `<input type="hidden" name="${PAGE_FIELD}" value="${String(currentPage ?? 1)}">`;
}

export function fieldAttributes(
  path: NodePath | undefined,
  field: AnswerField,
): TemplateFieldAttributes {
  if (field === "signature") {
    const signaturePath = path ?? [];
    return {
      "data-fb-link-id": lastLinkId(signaturePath),
      "data-fb-field": field,
      field,
      name: signatureName(signaturePath),
      "hx-include": "closest form",
    };
  }

  if (!path) {
    return { field, "hx-include": "closest form" };
  }

  return {
    "data-fb-link-id": lastLinkId(path),
    "data-fb-field": field,
    field,
    name: valueName(path, field),
    "hx-include": "closest form",
  };
}

export function inferTextField(
  id: string,
  group: InputGroupState | undefined,
): AnswerField {
  if (id.includes("__unit__custom")) {
    if (group?.size === 3) {
      return ["system", "code", "display"][group.index] as AnswerField;
    }

    return "unit";
  }

  if (group?.size === 3) {
    return ["system", "value", "display"][group.index] as AnswerField;
  }

  if (id.endsWith("__display")) {
    return "display";
  }

  if (id.endsWith("__unit")) {
    return "unit";
  }

  return "value";
}

export function checkboxHiddenValue(
  properties: CheckboxProperties,
  checkedValue: string,
): string | undefined {
  if (properties.uncheckedValue !== undefined) {
    return properties.uncheckedValue;
  }

  if (properties.disabled && properties.checked) {
    return checkedValue;
  }

  return undefined;
}

export function dateTimeConstraint(
  value: string | undefined,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const localValue = dateTimeLocalInputValue(value);
  return isDateTimeLocalInputValue(localValue) ? localValue : undefined;
}

export function hiddenInputs(
  name: string | undefined,
  options: readonly TemplateOptionItem[],
): HiddenTemplateInput[] {
  return name ? options.map((option) => ({ name, value: option.token })) : [];
}

export function renderOption(
  option: OptionItem | undefined,
  renderHtml: RenderHtml,
): TemplateOptionItem | undefined {
  return option
    ? {
        token: option.token,
        disabled: option.disabled,
        exclusive: option.exclusive,
        label: renderHtml(option.label),
      }
    : undefined;
}

export function renderSelectedOption(
  option: SelectedOptionItem,
  renderHtml: RenderHtml,
): TemplateSelectedOptionItem;
export function renderSelectedOption(
  option: undefined,
  renderHtml: RenderHtml,
): undefined;
export function renderSelectedOption(
  option: SelectedOptionItem | undefined,
  renderHtml: RenderHtml,
): TemplateSelectedOptionItem | undefined;
export function renderSelectedOption(
  option: SelectedOptionItem | undefined,
  renderHtml: RenderHtml,
): TemplateSelectedOptionItem | undefined {
  const rendered = renderOption(option, renderHtml);
  return rendered
    ? {
        ...rendered,
        ariaDescribedBy: option?.ariaDescribedBy,
        errors: renderHtml(option?.errors),
      }
    : undefined;
}

export function numberTemplateProperties(
  properties: NumberInputProperties,
): NumberInputTemplateProperties;
export function numberTemplateProperties(
  properties: SliderInputProperties,
): SliderInputTemplateProperties;
export function numberTemplateProperties(
  properties: SpinnerInputProperties,
): SpinnerInputTemplateProperties;
export function numberTemplateProperties(
  properties:
    | NumberInputProperties
    | SliderInputProperties
    | SpinnerInputProperties,
):
  | NumberInputTemplateProperties
  | SliderInputTemplateProperties
  | SpinnerInputTemplateProperties {
  const unitId = properties.unitLabel
    ? `${String(properties.id)}-unit`
    : undefined;
  const describedBy = [properties.ariaDescribedBy, unitId]
    .filter(Boolean)
    .join(" ");

  return {
    id: properties.id,
    path: properties.path,
    value: properties.value,
    disabled: properties.disabled,
    placeholder:
      "placeholder" in properties ? properties.placeholder : undefined,
    step: properties.step,
    min: properties.min,
    max: properties.max,
    ariaLabelledBy: properties.ariaLabelledBy,
    ariaDescribedBy: properties.ariaDescribedBy,
    lowerLabel: "lowerLabel" in properties ? properties.lowerLabel : undefined,
    upperLabel: "upperLabel" in properties ? properties.upperLabel : undefined,
    unitLabel: properties.unitLabel,
    inputValue: properties.value ?? "",
    unitId,
    describedBy: describedBy || undefined,
    ...fieldAttributes(properties.path, "value"),
  } as
    | NumberInputTemplateProperties
    | SliderInputTemplateProperties
    | SpinnerInputTemplateProperties;
}

export function tableColumn(
  column: TableColumn,
  renderHtml: RenderHtml,
): TemplateTableColumn {
  return {
    token: column.token,
    width: column.width,
    isLoading: column.isLoading,
    content: renderHtml(column.content),
    errors: renderHtml(column.errors),
    widthStyle: column.width ? `width:${column.width}` : undefined,
  };
}

export function tableRow(
  row: TableRow,
  renderHtml: RenderHtml,
  strings: Strings,
  token: string,
): TemplateTableRow {
  const path = row.path;
  return {
    token: row.token,
    path,
    isLoading: row.isLoading,
    content: renderHtml(row.content),
    errors: renderHtml(row.errors),
    cells: row.cells.map((cell) => tableCell(cell, renderHtml)),
    actionName: ACTION_FIELD,
    linkId: path ? lastLinkId(path) : undefined,
    removeAction:
      row.onRemove !== undefined && row.canRemove === true && path
        ? actionValue("remove-group", path)
        : undefined,
    removeId: pathControlId(token, path, "remove-group"),
    removeLabel: strings.group.removeSection,
    removeLabelHtml: escapeHtml(strings.group.removeSection),
  };
}

export function defaultAttributes(action: string | undefined): HtmlAttributes {
  return {
    method: "post",
    action,
    enctype: "multipart/form-data",
    "hx-post": action,
    "hx-trigger": "submit, change delay:100ms",
    "hx-encoding": "multipart/form-data",
    "hx-swap": "outerHTML",
    "hx-include": "closest form",
  };
}

function tableCell(cell: TableCell, renderHtml: RenderHtml): TemplateTableCell {
  return {
    token: cell.token,
    content: renderHtml(cell.content),
  };
}

function attachmentSource(attachment: Attachment): string | undefined {
  if (attachment.data === undefined) {
    return undefined;
  }

  return `data:${attachment.contentType ?? "application/octet-stream"};base64,${attachment.data}`;
}

function bracketName(parts: readonly string[]): string {
  const [root, ...rest] = parts;
  return `${root ?? ""}${rest.map((part) => `[${part}]`).join("")}`;
}

function pathParts(path: NodePath): string[] {
  return path.flatMap((segment) => [
    encodeURIComponent(segment.linkId),
    ...(segment.index === undefined ? [] : [`i:${segment.index}`]),
  ]);
}
