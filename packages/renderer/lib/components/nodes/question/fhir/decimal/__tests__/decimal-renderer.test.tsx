import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../../../stores/nodes/questions/question-store.ts";
import { DecimalRenderer } from "../decimal-renderer.tsx";
import { EXT } from "../../../../../../utils.ts";
import type { IQuestionNode } from "../../../../../../types.ts";

function getDecimalQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected decimal question");
  }
  return node as IQuestionNode<"decimal">;
}

describe("decimal-renderer", () => {
  describe("unit display", () => {
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
      const question = getDecimalQuestion(form, "weight");

      expect(question.unitDisplay).toBe("kg");

      render(<DecimalRenderer node={question} />);

      const input = screen.getByLabelText("Weight") as HTMLInputElement;
      const unit = screen.getByText("kg");
      expect(unit).toBeInTheDocument();
      expect(unit.id).not.toBe("");

      const describedBy = input.getAttribute("aria-describedby") ?? "";
      expect(describedBy.split(" ")).toContain(unit.id);
    });
  });

  describe("constraints", () => {
    it("applies min and max value constraints as input attributes", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "dosage",
            text: "Dosage",
            type: "decimal",
            extension: [
              {
                url: EXT.MIN_VALUE,
                valueDecimal: 0.5,
              },
              {
                url: EXT.MAX_VALUE,
                valueDecimal: 12.5,
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getDecimalQuestion(form, "dosage");

      render(<DecimalRenderer node={question} />);

      const input = screen.getByLabelText("Dosage") as HTMLInputElement;
      expect(input).toHaveAttribute("min", "0.5");
      expect(input).toHaveAttribute("max", "12.5");
    });

    it("derives step from maxDecimalPlaces", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "glucose",
            text: "Glucose",
            type: "decimal",
            extension: [
              {
                url: EXT.MAX_DECIMAL_PLACES,
                valueInteger: 2,
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getDecimalQuestion(form, "glucose");

      render(<DecimalRenderer node={question} />);

      const input = screen.getByLabelText("Glucose") as HTMLInputElement;
      expect(input).toHaveAttribute("step", "0.01");
    });
  });
});
