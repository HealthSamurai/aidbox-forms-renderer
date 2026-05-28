import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { DateRenderer } from "@formbox/renderer/component/question/fhir/date/date-renderer.tsx";
import { EXT } from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

import type {
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;
function getDateQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected date question");
  }
  return node as IQuestionNode<"date">;
}

describe("type.date", () => {
  it("renders a date input and seeds the response value", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "dob",
          text: "Date of birth",
          type: "date",
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "in-progress",
      item: [
        {
          linkId: "dob",
          answer: [{ valueDate: "1984-11-02" }],
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      response,
      undefined,
    );
    const question = getDateQuestion(form, "dob");

    render(<DateRenderer node={question} />);

    const input = screen.getByLabelText("Date of birth") as HTMLInputElement;
    expect(input.type).toBe("date");
    expect(input.value).toBe("1984-11-02");
  });

  it("applies min and max date bounds as input attributes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "visit",
          text: "Visit date",
          type: "date",
          extension: [
            { url: EXT.MIN_VALUE, valueDate: "2024-01-01" },
            { url: EXT.MAX_VALUE, valueDate: "2024-12-31" },
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
    );
    const question = getDateQuestion(form, "visit");

    render(<DateRenderer node={question} />);

    const input = screen.getByLabelText("Visit date") as HTMLInputElement;
    expect(input).toHaveAttribute("min", "2024-01-01");
    expect(input).toHaveAttribute("max", "2024-12-31");
  });
});
