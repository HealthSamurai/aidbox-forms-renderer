import type { FhirVersion, QuestionnaireResponseOf } from "@formbox/fhir";
import { FormStore } from "@formbox/renderer";
import bundledStrings from "@formbox/strings";
import type { Strings } from "@formbox/theme";

import { waitForOptions } from "./async-options.ts";
import { compileTemplates } from "./template-engine.ts";
import { processStoreFormData } from "./process.ts";
import { renderStoreFields } from "./render.ts";
import type { RequiredTemplates } from "./template.ts";
import type { ProcessResult, QuestionnaireRendererOptions } from "./types.ts";

export { htmlAttributes } from "./template.ts";
export {
  compileTemplate,
  compileTemplates,
  loadDefaultTemplates,
  loadTemplates,
  type TemplateSource,
  type TemplateSources,
} from "./template-engine.ts";

export type {
  LaunchContext,
  ProcessResult,
  QuestionnaireRendererOptions,
  RenderMode,
} from "./types.ts";
export type * from "./template.ts";

export class QuestionnaireRenderer<V extends FhirVersion = FhirVersion> {
  private readonly store: FormStore<V>;
  private readonly templates: RequiredTemplates;
  private readonly strings: Strings | undefined;
  private readonly action: string | undefined;

  constructor(options: QuestionnaireRendererOptions<V>) {
    const language = options.language ?? options.questionnaire.language;
    this.strings = options.strings;
    this.templates = compileTemplates(options.templates) as RequiredTemplates;
    this.action = options.action;
    this.store = new FormStore(
      resolveStrings(options.strings, language),
      options.fhirVersion,
      options.token,
      options.questionnaire,
      options.questionnaireResponse,
      options.terminologyServerUrl,
      language,
      options.launchContext,
      options.mode,
      options.customExtensions,
    );
  }

  async process(formData: FormData): Promise<ProcessResult> {
    await waitForOptions(this.store);
    const result = await processStoreFormData(this.store, formData);
    if (!this.strings) {
      this.store.setStrings(resolveStrings(undefined, this.store.language));
    }
    return result;
  }

  async render(): Promise<string> {
    await waitForOptions(this.store);
    return renderStoreFields(this.store, this.templates, this.action);
  }

  getQuestionnaireResponse(): QuestionnaireResponseOf<V> {
    return this.store.response as QuestionnaireResponseOf<V>;
  }

  dispose(): void {
    this.store.dispose();
  }
}

function resolveStrings(
  strings: Strings | undefined,
  language: string | undefined,
): Strings {
  if (strings) {
    return strings;
  }

  const primaryLanguage = language?.split("-")[0] as
    | keyof typeof bundledStrings
    | undefined;
  return primaryLanguage
    ? (bundledStrings[primaryLanguage] ?? bundledStrings.en)
    : bundledStrings.en;
}
