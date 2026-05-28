/* eslint-disable react-refresh/only-export-components */
import { useCallback, useMemo, useState } from "react";
import bundledStrings from "@formbox/strings";
import type {
  FhirVersion,
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/fhir";
import type { Theme } from "@formbox/theme";
import ControlledRenderer from "./controlled.tsx";
import type { LaunchContext, RenderMode } from "./types.ts";

export type RendererProperties<V extends FhirVersion> = {
  token?: string | undefined;
  questionnaire: QuestionnaireOf<V>;
  defaultQuestionnaireResponse?: QuestionnaireResponseOf<V> | undefined;
  defaultLanguage?: string | undefined;
  onChange?: ((response: QuestionnaireResponseOf<V>) => void) | undefined;
  onSubmit?: ((response: QuestionnaireResponseOf<V>) => void) | undefined;
  onLanguageChange?: ((language: string) => void) | undefined;
  terminologyServerUrl?: string | undefined;
  launchContext?: LaunchContext | undefined;
  mode?: RenderMode | undefined;
  fhirVersion: V;
  theme: Theme;
};

function resolveBundledStrings(language: string | undefined) {
  const primaryLanguage = language?.split(
    "-",
  )[0] as keyof typeof bundledStrings;
  return bundledStrings[primaryLanguage] ?? bundledStrings.en;
}

function Renderer<V extends FhirVersion>({
  token,
  questionnaire,
  defaultQuestionnaireResponse,
  defaultLanguage,
  onChange,
  onSubmit,
  onLanguageChange,
  terminologyServerUrl,
  launchContext,
  mode,
  fhirVersion,
  theme,
}: RendererProperties<V>) {
  const [language, setLanguage] = useState<string | undefined>(
    defaultLanguage ?? questionnaire.language,
  );

  const strings = useMemo(() => resolveBundledStrings(language), [language]);

  const handleChange = useCallback(
    (response: QuestionnaireResponseOf<V>) => {
      onChange?.(response);
    },
    [onChange],
  );

  const handleLanguageChange = useCallback(
    (nextLanguage: string) => {
      setLanguage(nextLanguage);
      onLanguageChange?.(nextLanguage);
    },
    [onLanguageChange],
  );

  return (
    <ControlledRenderer
      token={token}
      questionnaire={questionnaire}
      defaultQuestionnaireResponse={defaultQuestionnaireResponse}
      language={language}
      strings={strings}
      onChange={handleChange}
      onSubmit={onSubmit}
      onLanguageChange={handleLanguageChange}
      terminologyServerUrl={terminologyServerUrl}
      launchContext={launchContext}
      mode={mode}
      fhirVersion={fhirVersion}
      theme={theme}
    />
  );
}

export default Renderer;

export { FormStore } from "./store/form/form-store.ts";
export { Form } from "./component/form/form.tsx";
export { ThemeProvider } from "./ui/theme.tsx";
export {
  CustomQuestionnaireExtensionsProvider,
  StringsContext,
  useStrings,
} from "@formbox/theme";
export { isGroupListStore } from "./store/group/group-list-store.ts";
export { isGroupNode } from "./store/group/group-store.ts";
export { isQuestionNode } from "./store/question/question-store.ts";
export {
  ANSWER_TYPE_TO_DATA_TYPE,
  DATA_TYPE_TO_SUFFIX,
  EXT,
  asAnswerFragment,
  getIssueMessage,
  getValue,
  prepareDataUrlFromSignature,
  prepareSignatureFromDataUrl,
} from "./utilities.ts";
export { R4Adapter } from "./fhir/r4-adapter.ts";
export { R5Adapter } from "./fhir/r5-adapter.ts";

export type {
  AttachmentOf,
  CodingOf,
  ElementOf,
  ExtensionOf,
  FhirVersion,
  FhirTypesByVersion,
  OperationOutcomeIssueOf,
  QuantityOf,
  QuestionnaireItemAnswerOptionOf,
  QuestionnaireItemEnableWhenOf,
  QuestionnaireItemInitialOf,
  QuestionnaireItemOf,
  QuestionnaireOf,
  QuestionnaireResponseItemAnswerOf,
  QuestionnaireResponseItemOf,
  QuestionnaireResponseOf,
  ReferenceOf,
} from "@formbox/fhir";

export type { NodePath, NodePathSegment, Strings } from "@formbox/theme";
export type {
  AnswerType,
  AnswerTypeToDataType,
  DataType,
  DataTypeToType,
  HasNodePath,
  IAnswer,
  IForm,
  IGroupList,
  IGroupNode,
  INode,
  IPresentableNode,
  IQuestionNode,
  LaunchContext,
  NodeVisitor,
  QuestionnaireUsageMode,
  RenderMode,
} from "./types.ts";
