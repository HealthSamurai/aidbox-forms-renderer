import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../../../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../../../stores/nodes/questions/question-store.ts";
import { DateTimeRenderer } from "../date-time-renderer.tsx";
import type { IQuestionNode } from "../../../../../../types.ts";

function getDateTimeQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected dateTime question");
  }
  return node as IQuestionNode<"dateTime">;
}

describe("date-time-renderer", () => {
  describe("rendering", () => {
    it("renders a datetime-local input and seeds the response value", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "appointment",
            text: "Appointment time",
            type: "dateTime",
          },
        ],
      };

      const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#questionnaire",
        status: "in-progress",
        item: [
          {
            linkId: "appointment",
            answer: [
              {
                valueDateTime: "2024-07-12T14:30",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire, response);
      const question = getDateTimeQuestion(form, "appointment");

      render(<DateTimeRenderer node={question} />);

      const input = screen.getByLabelText(
        "Appointment time",
      ) as HTMLInputElement;
      expect(input.type).toBe("datetime-local");
      expect(input.value).toBe("2024-07-12T14:30");
    });
  });
});
