import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Renderer, {
  type ElementOf,
  type ExtensionOf,
  type QuestionnaireOf,
} from "@formbox/renderer";
import ControlledRenderer from "@formbox/renderer/controlled";
import { useState } from "react";
import { autorun } from "mobx";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { theme as hsTheme } from "@formbox/hs-theme";
import { EXT } from "@formbox/renderer/utilities.ts";
import en from "@formbox/strings/en";
import es from "@formbox/strings/es";

type Questionnaire = QuestionnaireOf<"r5">;
type Extension = ExtensionOf<"r5">;
type Element = ElementOf<"r5">;

function getLanguageLabel(code: string): string {
  if (typeof Intl === "object" && "DisplayNames" in Intl) {
    return new Intl.DisplayNames(["en"], { type: "language" }).of(code) ?? code;
  }

  return code;
}

function makeTranslation(language: string, content: string): Extension {
  return {
    url: EXT.TRANSLATION,
    extension: [
      {
        url: "lang",
        valueCode: language,
      },
      {
        url: "content",
        valueString: content,
      },
    ],
  };
}

function makeTranslatedElement(language: string, content: string): Element {
  return {
    extension: [makeTranslation(language, content)],
  };
}

const translatedQuestionnaire: Questionnaire = {
  resourceType: "Questionnaire",
  status: "active",
  language: "en",
  title: "Intake form",
  _title: makeTranslatedElement("es", "Formulario de ingreso"),
  item: [
    {
      linkId: "name",
      type: "string",
      text: "Patient name",
      _text: makeTranslatedElement("es", "Nombre del paciente"),
    },
  ],
};

function getQuestion(form: FormStore, linkId: string): IQuestionNode<"string"> {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected question node for ${linkId}`);
  }

  return node as IQuestionNode<"string">;
}

describe("renderer.language", () => {
  it("uses controlled language prop", () => {
    const { rerender } = render(
      <ControlledRenderer
        fhirVersion="r5"
        questionnaire={translatedQuestionnaire}
        strings={en}
        theme={hsTheme}
        language="es"
      />,
    );

    expect(screen.getByLabelText("Nombre del paciente")).toBeInTheDocument();

    rerender(
      <ControlledRenderer
        fhirVersion="r5"
        questionnaire={translatedQuestionnaire}
        strings={en}
        theme={hsTheme}
        language="fr"
      />,
    );

    expect(screen.getByLabelText("Patient name")).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Nombre del paciente"),
    ).not.toBeInTheDocument();
  });

  it("updates translated content when language is changed", () => {
    const form = new FormStore(en, "r5", "form", translatedQuestionnaire);
    const question = getQuestion(form, "name");

    expect(question.text).toBe("Patient name");

    form.setLanguage("es");

    expect(question.text).toBe("Nombre del paciente");
  });

  it("reacts to language changes", () => {
    const form = new FormStore(en, "r5", "form", translatedQuestionnaire);
    const seen: Array<string | undefined> = [];

    const dispose = autorun(() => {
      seen.push(form.language);
    });

    form.setLanguage("es");

    expect(seen).toEqual(["en", "es"]);
    dispose();
  });

  it("renders language selector in autonomous mode", () => {
    render(
      <Renderer
        fhirVersion="r5"
        questionnaire={translatedQuestionnaire}
        theme={hsTheme}
      />,
    );

    expect(screen.getByLabelText("Patient name")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Language" }),
    ).toBeInTheDocument();
  });

  it("emits language changes from selector in controlled mode", () => {
    const enLabel = getLanguageLabel("en");
    const esLabel = getLanguageLabel("es");
    const onLanguageChange = vi.fn();

    render(
      <ControlledRenderer
        fhirVersion="r5"
        questionnaire={translatedQuestionnaire}
        strings={en}
        theme={hsTheme}
        language="en"
        onLanguageChange={onLanguageChange}
      />,
    );

    const selector = screen.getByRole("button", { name: "Language" });
    expect(selector).toHaveTextContent(enLabel);
    expect(screen.getAllByRole("button", { name: "Language" })).toHaveLength(1);
    expect(screen.getByLabelText("Patient name")).toBeInTheDocument();

    fireEvent.click(selector);
    fireEvent.click(screen.getByRole("menuitemradio", { name: esLabel }));

    expect(onLanguageChange).toHaveBeenCalledWith("es");
    expect(screen.getByLabelText("Patient name")).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Nombre del paciente"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Language" })).toHaveTextContent(
      enLabel,
    );
  });

  it("updates rendered language when parent applies emitted language", () => {
    const esLabel = getLanguageLabel("es");

    function ControlledHost() {
      const [language, setLanguage] = useState<string | undefined>("en");
      return (
        <ControlledRenderer
          fhirVersion="r5"
          questionnaire={translatedQuestionnaire}
          strings={en}
          theme={hsTheme}
          language={language ?? "en"}
          onLanguageChange={setLanguage}
        />
      );
    }

    render(<ControlledHost />);

    fireEvent.click(screen.getByRole("button", { name: "Language" }));
    fireEvent.click(screen.getByRole("menuitemradio", { name: esLabel }));

    expect(screen.getByLabelText("Nombre del paciente")).toBeInTheDocument();
    expect(screen.queryByLabelText("Patient name")).not.toBeInTheDocument();
  });

  it("updates form action labels when language is changed", () => {
    const esLabel = getLanguageLabel("es");

    render(
      <Renderer
        fhirVersion="r5"
        questionnaire={translatedQuestionnaire}
        theme={hsTheme}
      />,
    );

    expect(
      screen.getByRole("button", { name: en.form.submit }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: en.form.cancel }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Language" }));
    fireEvent.click(screen.getByRole("menuitemradio", { name: esLabel }));

    expect(
      screen.getByRole("button", { name: es.form.submit }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: es.form.cancel }),
    ).toBeInTheDocument();
  });

  it("does not render language selector without translations", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      language: "en",
      item: [
        {
          linkId: "name",
          type: "string",
          text: "Patient name",
        },
      ],
    };

    render(
      <Renderer
        fhirVersion="r5"
        questionnaire={questionnaire}
        theme={hsTheme}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Language" }),
    ).not.toBeInTheDocument();
  });

  it("does not render language selector when questionnaire.language is missing", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      title: "Intake form",
      _title: makeTranslatedElement("es", "Formulario de ingreso"),
      item: [
        {
          linkId: "name",
          type: "string",
          text: "Patient name",
          _text: makeTranslatedElement("es", "Nombre del paciente"),
        },
      ],
    };

    render(
      <Renderer
        fhirVersion="r5"
        questionnaire={questionnaire}
        theme={hsTheme}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Language" }),
    ).not.toBeInTheDocument();
  });
});
