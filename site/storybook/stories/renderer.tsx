import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { IPresentableNode } from "@formbox/renderer/types.ts";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import es from "@formbox/strings/es";
import fr from "@formbox/strings/fr";
import de from "@formbox/strings/de";
import { Form } from "@formbox/renderer/component/form/form.tsx";
import { Node } from "@formbox/renderer/component/node/node.tsx";
import { StringsContext, type Strings } from "@formbox/theme";
import {
  useQuestionnaireBroadcaster,
  useQuestionnaireResponseBroadcaster,
} from "./story-channel-hooks.ts";

import type {
  FhirVersion,
  LaunchContext,
  QuestionnaireOf,
  QuestionnaireResponseOf,
  RenderMode,
} from "@formbox/renderer";
type RendererMode = "node" | "form";

type RendererProperties<V extends FhirVersion = "r5"> = {
  questionnaire: QuestionnaireOf<V>;
  defaultQuestionnaireResponse?: QuestionnaireResponseOf<V> | undefined;
  launchContext?: LaunchContext | undefined;
  formMode?: RenderMode | undefined;
  fhirVersion: V;
  storyId: string;
  mode: RendererMode;
};

const STRINGS_BY_LANGUAGE = {
  en,
  es,
  fr,
  de,
} as const satisfies Record<string, Strings>;
type StoryLanguage = keyof typeof STRINGS_BY_LANGUAGE;

function isStoryLanguage(value: string): value is StoryLanguage {
  return value in STRINGS_BY_LANGUAGE;
}

function resolveStrings(language: string | undefined): Strings {
  const primaryLanguage = language?.split("-")[0];
  return primaryLanguage && isStoryLanguage(primaryLanguage)
    ? STRINGS_BY_LANGUAGE[primaryLanguage]
    : en;
}

export function Renderer<V extends FhirVersion = "r5">({
  questionnaire,
  defaultQuestionnaireResponse,
  launchContext,
  formMode,
  fhirVersion,
  storyId,
  mode,
}: RendererProperties<V>) {
  const [language, setLanguage] = useState<string | undefined>(
    questionnaire.language,
  );
  const strings = useMemo(
    () => resolveStrings(language ?? questionnaire.language),
    [language, questionnaire.language],
  );
  const store = useMemo(
    () =>
      new FormStore(
        en,
        fhirVersion,
        "form",
        questionnaire,
        defaultQuestionnaireResponse,
      ),
    [defaultQuestionnaireResponse, fhirVersion, questionnaire],
  );

  useEffect(() => () => store.dispose(), [store]);
  useEffect(() => {
    store.setLanguage(language);
  }, [store, language]);
  useEffect(() => {
    store.setStrings(strings);
  }, [store, strings]);
  useEffect(() => {
    store.setLaunchContext(launchContext);
  }, [store, launchContext]);
  useEffect(() => {
    store.setMode(formMode);
  }, [store, formMode]);

  useQuestionnaireResponseBroadcaster(store, storyId);
  useQuestionnaireBroadcaster(questionnaire, storyId);

  if (mode === "form") {
    return (
      <StringsContext.Provider value={strings}>
        <div style={storyFrameStyle}>
          <Form
            store={store}
            onSubmit={() => store.validateAll()}
            onLanguageChange={setLanguage}
          />
        </div>
      </StringsContext.Provider>
    );
  }

  if (store.nodes.length !== 1) {
    throw new Error(
      `Expected a single root node, but got ${store.nodes.length}.`,
    );
  }

  const node = store.nodes[0];
  return (
    <StringsContext.Provider value={strings}>
      <div style={storyFrameStyle}>
        <Node node={node as IPresentableNode} />
      </div>
    </StringsContext.Provider>
  );
}

const storyFrameStyle: CSSProperties = {
  width: "100%",
  padding: "24px",
};
