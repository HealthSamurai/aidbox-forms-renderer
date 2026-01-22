import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "@formbox/renderer/store/question/question-store.ts";

const minOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs",
  valueInteger: value,
});

const maxOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
  valueInteger: value,
});

describe("initial", () => {
  it("seeds non-repeating questions from questionnaire initial values", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "greeting",
          text: "Greeting",
          type: "string",
          initial: [{ valueString: "Hello" }],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("greeting");
    expect(node && isQuestionNode(node)).toBe(true);
    assertQuestionNode(node);

    expect(node.answers).toHaveLength(1);
    expect(node.answers[0]?.value).toBe("Hello");
  });

  it("materializes multiple initial values for repeating questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "symptom",
          text: "Symptoms",
          type: "string",
          repeats: true,
          initial: [{ valueString: "Cough" }, { valueString: "Fever" }],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("symptom");
    expect(node && isQuestionNode(node)).toBe(true);
    assertQuestionNode(node);

    expect(node.answers.map((answer) => answer.value)).toEqual([
      "Cough",
      "Fever",
    ]);
  });

  it("preserves response answers over questionnaire initial values", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "nickname",
          text: "Nickname",
          type: "string",
          initial: [{ valueString: "Buddy" }],
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "completed",
      item: [
        {
          linkId: "nickname",
          answer: [{ valueString: "Captain" }],
        },
      ],
    };

    const form = new FormStore(questionnaire, response);
    const node = form.scope.lookupNode("nickname");
    expect(node && isQuestionNode(node)).toBe(true);
    assertQuestionNode(node);

    expect(node.answers).toHaveLength(1);
    expect(node.answers[0]?.value).toBe("Captain");
  });

  it("pads answers to minOccurs when template initials underfill", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "symptom",
          text: "Symptoms",
          type: "string",
          repeats: true,
          extension: [minOccurs(3)],
          initial: [{ valueString: "Cough" }, { valueString: "Fever" }],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("symptom");
    expect(node && isQuestionNode(node)).toBe(true);
    assertQuestionNode(node);

    expect(node.answers.map((answer) => answer.value)).toEqual([
      "Cough",
      "Fever",
      undefined,
    ]);
    expect(node.canRemove).toBe(false);
  });

  it("respects maxOccurs when template overflows repeated answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "meds",
          text: "Medications",
          type: "string",
          repeats: true,
          extension: [maxOccurs(2)],
          initial: [
            { valueString: "Aspirin" },
            { valueString: "Ibuprofen" },
            { valueString: "Naproxen" },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("meds");
    expect(node && isQuestionNode(node)).toBe(true);
    assertQuestionNode(node);

    expect(node.answers.map((answer) => answer.value)).toEqual([
      "Aspirin",
      "Ibuprofen",
    ]);
    expect(node.canAdd).toBe(false);
  });
});
