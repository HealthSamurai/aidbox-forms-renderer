import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../../../stores/nodes/questions/question-store.ts";
import { IntegerRenderer } from "../integer-renderer.tsx";
import {
  EXT,
  getItemControlCode,
  ITEM_CONTROL_SYSTEM,
} from "../../../../../../utils.ts";
import type { IQuestionNode } from "../../../../../../types.ts";

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
});
