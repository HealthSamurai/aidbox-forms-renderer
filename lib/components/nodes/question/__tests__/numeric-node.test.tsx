import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../stores/nodes/questions/question-store.ts";
import { Node } from "../../../form/node.tsx";
import {
  EXT,
  getItemControlCode,
  ITEM_CONTROL_SYSTEM,
} from "../../../../utils.ts";

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

    const { container } = render(<Node node={question} />);

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
    expect(getItemControlCode(child)).toBe("unit");
    expect(question.unitDisplay).toBe("tablet");

    const { container } = render(<Node node={question} />);

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

describe("itemControl rendering for numeric questions", () => {
  const baseQuestionnaire: Questionnaire = {
    resourceType: "Questionnaire",
    status: "active",
    item: [],
  };

  it("renders slider layout with lower/upper labels", () => {
    const questionnaire: Questionnaire = {
      ...baseQuestionnaire,
      item: [
        {
          linkId: "pain",
          text: "Pain score",
          type: "integer",
          extension: [
            {
              url: EXT.MIN_VALUE,
              valueInteger: 0,
            },
            {
              url: EXT.MAX_VALUE,
              valueInteger: 10,
            },
            {
              url: EXT.SLIDER_STEP_VALUE,
              valueInteger: 1,
            },
            {
              url: EXT.ITEM_CONTROL,
              valueCodeableConcept: {
                coding: [
                  {
                    system: ITEM_CONTROL_SYSTEM,
                    code: "slider",
                  },
                ],
              },
            },
          ],
          item: [
            {
              linkId: "pain-lower",
              type: "display",
              text: "No pain",
              extension: [
                {
                  url: EXT.ITEM_CONTROL,
                  valueCodeableConcept: {
                    coding: [
                      {
                        system: ITEM_CONTROL_SYSTEM,
                        code: "lower",
                      },
                    ],
                  },
                },
              ],
            },
            {
              linkId: "pain-upper",
              type: "display",
              text: "Worst pain",
              extension: [
                {
                  url: EXT.ITEM_CONTROL,
                  valueCodeableConcept: {
                    coding: [
                      {
                        system: ITEM_CONTROL_SYSTEM,
                        code: "upper",
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
    const question = getNumericQuestion(form, "pain");

    const { container } = render(<Node node={question} />);
    const slider = container.querySelector(".af-slider input[type='range']");
    expect(slider).not.toBeNull();
    const labels = Array.from(
      container.querySelectorAll(".af-slider-labels span"),
    ).map((node) => node.textContent);
    expect(labels).toEqual(["No pain", "Worst pain"]);
  });

  it("renders spinner when spinner control is set", () => {
    const questionnaire: Questionnaire = {
      ...baseQuestionnaire,
      item: [
        {
          linkId: "frequency",
          text: "Dose frequency",
          type: "integer",
          extension: [
            {
              url: EXT.ITEM_CONTROL,
              valueCodeableConcept: {
                coding: [
                  {
                    system: ITEM_CONTROL_SYSTEM,
                    code: "spinner",
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getNumericQuestion(form, "frequency");

    const { container } = render(<Node node={question} />);
    const spinner = container.querySelector(".af-spinner");
    expect(spinner).not.toBeNull();
  });
});
