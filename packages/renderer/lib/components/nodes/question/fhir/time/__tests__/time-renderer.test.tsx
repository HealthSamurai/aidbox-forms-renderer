import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../../../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../../../stores/nodes/questions/question-store.ts";
import { TimeRenderer } from "../time-renderer.tsx";
import type { IQuestionNode } from "../../../../../../types.ts";

function getTimeQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected time question");
  }
  return node as IQuestionNode<"time">;
}

describe("time-renderer", () => {
  describe("rendering", () => {
    it("renders a time input and seeds the response value", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "dose-time",
            text: "Dose time",
            type: "time",
          },
        ],
      };

      const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#questionnaire",
        status: "in-progress",
        item: [
          {
            linkId: "dose-time",
            answer: [
              {
                valueTime: "08:45",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire, response);
      const question = getTimeQuestion(form, "dose-time");

      render(<TimeRenderer node={question} />);

      const input = screen.getByLabelText("Dose time") as HTMLInputElement;
      expect(input.type).toBe("time");
      expect(input.value).toBe("08:45");
    });
  });
});
