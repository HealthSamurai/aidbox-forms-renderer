import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../../stores/form-store.ts";
import { isQuestionNode } from "../../../stores/question-store.ts";
import { QuestionNode } from "../../nodes/question-node.tsx";
import { EXT, getItemControl, ITEM_CONTROL_SYSTEM } from "../../../utils.ts";

function getNumericQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected numeric question");
  }
  return node;
}

describe("questionnaire-unit extension", () => {
  it("renders unit display for decimal questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "weight",
          text: "Weight",
          type: "decimal",
          extension: [
            {
              url: EXT.QUESTIONNAIRE_UNIT,
              valueCoding: {
                system: "http://unitsofmeasure.org",
                code: "kg",
                display: "kg",
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getNumericQuestion(form, "weight");

    const { container } = render(<QuestionNode item={question} />);

    const input = screen.getByLabelText("Weight") as HTMLInputElement;
    const unit = container.querySelector(
      ".af-number-unit",
    ) as HTMLSpanElement | null;
    expect(unit).not.toBeNull();
    if (!unit) throw new Error("Missing unit display");

    expect(unit.textContent).toBe("kg");
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(describedBy.split(" ")).toContain(unit.id);
    expect(unit.id).not.toBe("");
  });

  it("does not duplicate unit display when provided as a child display item", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "dose-count",
          text: "Dose count",
          type: "integer",
          extension: [
            {
              url: EXT.QUESTIONNAIRE_UNIT,
              valueCoding: {
                system: "http://example.org/units",
                code: "tablet",
                display: "tablets",
              },
            },
          ],
          item: [
            {
              linkId: "dose-count-unit",
              text: "tablet",
              type: "display",
              extension: [
                {
                  url: EXT.ITEM_CONTROL,
                  valueCodeableConcept: {
                    coding: [
                      {
                        system: ITEM_CONTROL_SYSTEM,
                        code: "unit",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getNumericQuestion(form, "dose-count");

    const child = question.template.item?.[0];
    expect(child).toBeTruthy();
    if (!child) return;
    expect(getItemControl(child)).toBe("unit");
    expect(question.unitDisplay).toBe("tablet");

    const { container } = render(<QuestionNode item={question} />);

    const unit = container.querySelector(
      ".af-number-unit",
    ) as HTMLSpanElement | null;
    expect(unit).not.toBeNull();
    if (!unit) throw new Error("Missing unit label");

    expect(unit.textContent).toBe("tablet");
    const input = screen.getByLabelText("Dose count");
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(describedBy.split(" ")).toContain(unit.id);
  });
});
