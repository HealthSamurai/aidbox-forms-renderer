import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";
import { FormStore } from "./stores/form/form-store.ts";
import { Form } from "./components/form/form.tsx";
import { FormEvent, useCallback, useEffect, useMemo } from "react";
import { autorun } from "mobx";
import type { Theme } from "@aidbox-forms/theme";
import { ThemeProvider } from "./ui/theme.tsx";

type RendererProps = {
  questionnaire: Questionnaire;
  initialResponse?: QuestionnaireResponse | undefined;
  onChange?: ((response: QuestionnaireResponse) => void) | undefined;
  onSubmit?: ((response: QuestionnaireResponse) => void) | undefined;
  terminologyServerUrl?: string | undefined;
  theme?: Theme | undefined;
};

function Renderer({
  questionnaire,
  initialResponse,
  onSubmit,
  onChange,
  terminologyServerUrl,
  theme,
}: RendererProps) {
  const store = useMemo(
    () => new FormStore(questionnaire, initialResponse, terminologyServerUrl),
    [questionnaire, initialResponse, terminologyServerUrl],
  );

  useEffect(() => () => store.dispose(), [store]);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    const dispose = autorun(() => {
      onChange(store.response);
    });

    return () => {
      dispose();
    };
  }, [onChange, store]);

  const handleValidSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(store.response);
    }
  }, [onSubmit, store]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const isValid = store.validateAll();
      if (isValid) {
        handleValidSubmit();
      }
    },
    [handleValidSubmit, store],
  );

  return (
    <ThemeProvider theme={theme}>
      <Form store={store} onSubmit={handleSubmit} />
    </ThemeProvider>
  );
}

export default Renderer;
