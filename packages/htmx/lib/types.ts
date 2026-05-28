import type {
  FhirVersion,
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/fhir";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  NodePathSegment,
} from "@formbox/renderer";
import type { CustomExtensionDefinitions, Strings } from "@formbox/theme";

import type { RequiredTemplates } from "./template.ts";

export type AnswerValue = DataTypeToType<AnswerTypeToDataType<AnswerType>>;
export type PathSegment = NodePathSegment;

export type LaunchContext = Record<string, unknown>;
export type RenderMode = "capture" | "display";

export interface QuestionnaireRendererOptions<
  V extends FhirVersion = FhirVersion,
> {
  token: string;
  questionnaire: QuestionnaireOf<V>;
  questionnaireResponse?: QuestionnaireResponseOf<V> | undefined;
  fhirVersion: V;
  language?: string | undefined;
  strings?: Strings | undefined;
  terminologyServerUrl?: string | undefined;
  launchContext?: LaunchContext | undefined;
  mode?: RenderMode | undefined;
  customExtensions?: CustomExtensionDefinitions | undefined;
  templates: RequiredTemplates;
  action?: string | undefined;
}

export type ProcessResult =
  | { readonly submitted: false }
  | { readonly submitted: true; readonly valid: boolean };
