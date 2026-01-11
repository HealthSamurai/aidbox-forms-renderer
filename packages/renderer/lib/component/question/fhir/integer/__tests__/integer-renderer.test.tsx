import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../../../../store/form/form-store.ts";
import { isQuestionNode } from "../../../../../store/question/question-store.ts";
import { IntegerRenderer } from "../integer-renderer.tsx";
import {
  EXT,
  getItemControlCode,
  ITEM_CONTROL_SYSTEM,
} from "../../../../../utilities.ts";
import type { IQuestionNode } from "../../../../../types.ts";

function getIntegerQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected integer question");
  }
  return node as IQuestionNode<"integer">;
}

describe("integer-renderer", () => {
  describe("unit display", () => {
    it("uses the unit display child item instead of duplicating the extension", () => {
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
      const question = getIntegerQuestion(form, "dose-count");

      const child = question.template.item?.[0];
      expect(child).toBeTruthy();
      if (!child) {
        throw new Error("Missing unit display item");
      }

      expect(getItemControlCode(child)).toBe("unit");
      expect(question.unitDisplay).toBe("tablet");

      render(<IntegerRenderer node={question} />);

      const input = screen.getByLabelText("Dose count") as HTMLInputElement;
      const unit = screen.getByText("tablet");
      expect(unit).toBeInTheDocument();
      expect(unit.id).not.toBe("");

      const describedBy = input.getAttribute("aria-describedby") ?? "";
      expect(describedBy.split(" ")).toContain(unit.id);
    });
  });

  describe("constraints", () => {
    it("uses a step of 1 for integer inputs", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "count",
            text: "Count",
            type: "integer",
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getIntegerQuestion(form, "count");

      render(<IntegerRenderer node={question} />);

      const input = screen.getByLabelText("Count") as HTMLInputElement;
      expect(input).toHaveAttribute("step", "1");
    });

    it("applies min and max value constraints as input attributes", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "pills",
            text: "Pills per day",
            type: "integer",
            extension: [
              {
                url: EXT.MIN_VALUE,
                valueInteger: 1,
              },
              {
                url: EXT.MAX_VALUE,
                valueInteger: 12,
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getIntegerQuestion(form, "pills");

      render(<IntegerRenderer node={question} />);

      const input = screen.getByLabelText("Pills per day") as HTMLInputElement;
      expect(input).toHaveAttribute("min", "1");
      expect(input).toHaveAttribute("max", "12");
    });
  });
});
