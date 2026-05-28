import { reaction } from "mobx";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  FhirVersion,
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/fhir";
import {
  CustomQuestionnaireExtensionsProvider,
  type Strings,
  StringsContext,
  type Theme,
} from "@formbox/theme";
import type { LaunchContext, RenderMode } from "./types.ts";
import { Form } from "./component/form/form.tsx";
import { FormStore } from "./store/form/form-store.ts";
import { ThemeProvider } from "./ui/theme.tsx";
import { buildId, randomToken } from "./utilities.ts";

export type RendererProperties<V extends FhirVersion> = {
  token?: string | undefined;
  questionnaire: QuestionnaireOf<V>;
  defaultQuestionnaireResponse?: QuestionnaireResponseOf<V> | undefined;
  language?: string | undefined;
  strings: Strings;
  onChange?: ((response: QuestionnaireResponseOf<V>) => void) | undefined;
  onSubmit?: ((response: QuestionnaireResponseOf<V>) => void) | undefined;
  onLanguageChange?: ((language: string) => void) | undefined;
  terminologyServerUrl?: string | undefined;
  launchContext?: LaunchContext | undefined;
  mode?: RenderMode | undefined;
  fhirVersion: V;
  theme: Theme;
};

function Renderer<V extends FhirVersion>({
  token,
  questionnaire,
  defaultQuestionnaireResponse,
  language,
  strings,
  onChange,
  onSubmit,
  onLanguageChange,
  terminologyServerUrl,
  launchContext,
  mode,
  fhirVersion,
  theme,
}: RendererProperties<V>) {
  const defaultTokenReference = useRef<string | undefined>(undefined);
  const storeToken =
    token ?? (defaultTokenReference.current ??= buildId("form", randomToken()));
  const onChangeReference = useRef(onChange);
  // These refs are intentionally excluded from store recreation triggers.
  const stringsReference = useRef(strings);
  const languageReference = useRef(language);
  const responseReference = useRef(defaultQuestionnaireResponse);
  const launchContextReference = useRef(launchContext);
  const modeReference = useRef(mode);
  const isInitialStoreSetupReference = useRef(true);

  useEffect(() => {
    onChangeReference.current = onChange;
  }, [onChange]);

  useEffect(() => {
    stringsReference.current = strings;
    languageReference.current = language;
    responseReference.current = defaultQuestionnaireResponse;
    launchContextReference.current = launchContext;
    modeReference.current = mode;
  }, [defaultQuestionnaireResponse, language, strings, launchContext, mode]);

  const [store, setStore] = useState<FormStore<V>>(
    () =>
      new FormStore(
        strings,
        fhirVersion,
        storeToken,
        questionnaire,
        defaultQuestionnaireResponse,
        terminologyServerUrl,
        language,
        launchContext,
        mode,
        theme.customExtensions,
      ),
  );

  useEffect(() => {
    if (isInitialStoreSetupReference.current) {
      isInitialStoreSetupReference.current = false;
      return;
    }

    setStore(
      new FormStore(
        stringsReference.current,
        fhirVersion,
        storeToken,
        questionnaire,
        responseReference.current,
        terminologyServerUrl,
        languageReference.current,
        launchContextReference.current,
        modeReference.current,
        theme.customExtensions,
      ),
    );
  }, [
    fhirVersion,
    storeToken,
    questionnaire,
    terminologyServerUrl,
    theme.customExtensions,
  ]);

  useEffect(() => {
    store.setStrings(strings);
  }, [store, strings]);

  useEffect(() => {
    store.setLanguage(language);
  }, [store, language]);

  useEffect(() => {
    store.setLaunchContext(launchContext);
  }, [store, launchContext]);

  useEffect(() => {
    store.setMode(mode);
  }, [store, mode]);

  useEffect(() => {
    const dispose = reaction(
      () => store.response as QuestionnaireResponseOf<V>,
      (response) => {
        onChangeReference.current?.(response);
      },
    );

    return () => {
      dispose();
      store.dispose();
    };
  }, [store]);

  const handleSubmit = useCallback(() => {
    if (store.validateAll()) {
      onSubmit?.(store.response as QuestionnaireResponseOf<V>);
    }
  }, [onSubmit, store]);

  return (
    <ThemeProvider theme={theme}>
      <CustomQuestionnaireExtensionsProvider value={store.customExtensions}>
        <StringsContext.Provider value={strings}>
          <Form
            store={store}
            onSubmit={handleSubmit}
            onLanguageChange={onLanguageChange}
          />
        </StringsContext.Provider>
      </CustomQuestionnaireExtensionsProvider>
    </ThemeProvider>
  );
}

export default Renderer;
