import { describe, expect, it } from "vitest";
import {
  type CodingOf,
  type ElementOf,
  type ExtensionOf,
  type QuestionnaireOf,
} from "@formbox/renderer";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { EXT } from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import en from "@formbox/strings/en";

type Questionnaire = QuestionnaireOf<"r5">;
type Extension = ExtensionOf<"r5">;
type Element = ElementOf<"r5">;
type Coding = CodingOf<"r5">;

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

function getQuestion<T extends "string" | "coding">(
  form: FormStore,
  linkId: string,
): IQuestionNode<T> {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected question node for ${linkId}`);
  }

  return node as IQuestionNode<T>;
}

describe("translation extension", () => {
  it("localizes core visible questionnaire and item texts for selected language", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      title: "Intake form",
      _title: makeTranslatedElement("es", "Formulario de ingreso"),
      description: "Please complete all fields.",
      _description: makeTranslatedElement(
        "es",
        "Por favor complete todos los campos.",
      ),
      item: [
        {
          linkId: "name",
          type: "string",
          text: "Patient name",
          _text: makeTranslatedElement("es", "Nombre del paciente"),
          prefix: "1.",
          _prefix: makeTranslatedElement("es", "1)"),
          extension: [
            {
              url: EXT.SDC_SHORT_TEXT,
              valueString: "Name",
              _valueString: makeTranslatedElement("es", "Nombre"),
            },
            {
              url: EXT.SDC_OPEN_LABEL,
              valueString: "Specify other",
              _valueString: makeTranslatedElement("es", "Especifique otro"),
            },
            {
              url: EXT.ENTRY_FORMAT,
              valueString: "Enter full legal name",
              _valueString: makeTranslatedElement(
                "es",
                "Ingrese el nombre legal completo",
              ),
            },
            {
              url: EXT.SUPPORT_HYPERLINK,
              extension: [
                {
                  url: "label",
                  valueString: "More info",
                  _valueString: makeTranslatedElement("es", "Mas informacion"),
                },
                {
                  url: "link",
                  valueUri: "https://example.com/help",
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
      "es",
    );
    const question = getQuestion<"string">(form, "name");

    expect(form.title).toBe("Formulario de ingreso");
    expect(form.description).toBe("Por favor complete todos los campos.");
    expect(question.text).toBe("Nombre del paciente");
    expect(question.prefix).toBe("1)");
    expect(question.shortText).toBe("Nombre");
    expect(question.openLabel).toBe("Especifique otro");
    expect(question.placeholder).toBe("Ingrese el nombre legal completo");
    expect(question.supportHyperlinks).toEqual([
      {
        href: "https://example.com/help",
        label: "Mas informacion",
      },
    ]);
  });

  it("falls back to base text when translation is missing", () => {
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

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
      "fr",
    );
    const question = getQuestion<"string">(form, "name");

    expect(form.title).toBe("Intake form");
    expect(question.text).toBe("Patient name");
  });

  it("matches language by primary subtag when exact locale is unavailable", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "name",
          type: "string",
          text: "Patient name",
          _text: makeTranslatedElement("es", "Nombre del paciente"),
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
      "es-MX",
    );
    const question = getQuestion<"string">(form, "name");

    expect(question.text).toBe("Nombre del paciente");
  });

  it("uses translated valueString as option value", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "material",
          type: "string",
          text: "Preferred follow-up material",
          answerOption: [
            {
              valueString: "Discharge instructions",
              _valueString: makeTranslatedElement(
                "es",
                "Instrucciones de alta",
              ),
            },
          ],
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
      "es",
    );
    const question = getQuestion<"string">(form, "material");
    const option = question.answerOption.inherentOptions[0];
    if (!option) {
      throw new Error("Expected one answer option");
    }

    expect(option.value).toBe("Instrucciones de alta");

    question.answerOption.select.selectOption(option.token);
    const answer = question.answers[0];
    if (!answer) {
      throw new Error("Expected an answer slot");
    }

    expect(answer.value).toBe("Instrucciones de alta");
    expect(question.answerOption.select.getSelectedOption(answer)?.value).toBe(
      "Instrucciones de alta",
    );
  });

  it("searches options by localized display text", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "material",
          type: "string",
          text: "Preferred follow-up material",
          answerOption: [
            {
              valueString: "Discharge instructions",
              _valueString: makeTranslatedElement(
                "es",
                "Instrucciones de alta",
              ),
            },
          ],
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
      "es",
    );
    const question = getQuestion<"string">(form, "material");
    const select = question.answerOption.select;

    select.setSearchQuery("instrucciones");
    expect(select.filteredOptions).toHaveLength(1);
    expect(select.filteredOptions[0]?.value).toBe("Instrucciones de alta");

    select.setSearchQuery("discharge");
    expect(select.filteredOptions).toHaveLength(0);
  });

  it("uses translated coding display in option value", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "priority",
          type: "coding",
          text: "Visit priority",
          answerOption: [
            {
              valueCoding: {
                system: "http://example.org/priorities",
                code: "urgent",
                display: "Urgent",
                _display: makeTranslatedElement("es", "Urgente"),
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
      "es",
    );
    const question = getQuestion<"coding">(form, "priority");
    const option = question.answerOption.inherentOptions[0];
    if (!option) {
      throw new Error("Expected one answer option");
    }

    expect((option.value as Coding).display).toBe("Urgente");
    expect((option.value as Coding).code).toBe("urgent");

    question.answerOption.select.selectOption(option.token);
    const answer = question.answers[0];
    if (!answer) {
      throw new Error("Expected an answer slot");
    }

    expect((answer.value as Coding).display).toBe("Urgente");
    expect((answer.value as Coding).code).toBe("urgent");
  });

  it("updates localized text when form language changes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "name",
          type: "string",
          text: "Patient name",
          _text: makeTranslatedElement("es", "Nombre del paciente"),
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const question = getQuestion<"string">(form, "name");
    const answer = question.answers[0];
    if (!answer) {
      throw new Error("Expected an answer slot");
    }

    answer.setValueByUser("Alice");
    expect(question.text).toBe("Patient name");

    form.setLanguage("es");
    expect(question.text).toBe("Nombre del paciente");
    expect(answer.value).toBe("Alice");
  });
});
