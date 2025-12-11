import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../stores/nodes/questions/question-store.ts";
import { ITEM_CONTROL_SYSTEM } from "../../../../utils.ts";
import { Node } from "../../../form/node.tsx";

function getCodingQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected coding question");
  }
  return node;
}

describe("coding item controls", () => {
  it("renders checkbox inputs for check-box control", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "allergies",
          text: "Allergy list",
          type: "coding",
          repeats: true,
          answerOption: [
            {
              valueCoding: {
                system: "http://loinc.org",
                code: "peanut",
                display: "Peanuts",
              },
            },
            {
              valueCoding: {
                system: "http://loinc.org",
                code: "pollen",
                display: "Pollen",
              },
            },
          ],
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
              valueCodeableConcept: {
                coding: [
                  {
                    system: ITEM_CONTROL_SYSTEM,
                    code: "check-box",
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getCodingQuestion(form, "allergies");

    render(<Node node={question} />);
    const peanutCheckbox = screen.getByLabelText("Peanuts") as HTMLInputElement;
    expect(peanutCheckbox.type).toBe("checkbox");
    fireEvent.click(peanutCheckbox);
    expect(question.answers.length).toBe(1);
    const selected = question.answers[0]?.value;
    if (!selected || typeof selected !== "object" || !("code" in selected)) {
      throw new Error("Expected coding answer");
    }
    expect(selected.code).toBe("peanut");
  });

  it("renders autocomplete search when autocomplete control is set", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "language",
          text: "Preferred language",
          type: "coding",
          answerOption: [
            {
              valueCoding: {
                system: "urn:ietf:bcp:47",
                code: "en",
                display: "English",
              },
            },
            {
              valueCoding: {
                system: "urn:ietf:bcp:47",
                code: "es",
                display: "Spanish",
              },
            },
          ],
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
              valueCodeableConcept: {
                coding: [
                  {
                    system: ITEM_CONTROL_SYSTEM,
                    code: "autocomplete",
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getCodingQuestion(form, "language");

    const { container } = render(<Node node={question} />);
    const search = container.querySelector(
      ".af-autocomplete input[type='search']",
    );
    expect(search).not.toBeNull();
  });
});
