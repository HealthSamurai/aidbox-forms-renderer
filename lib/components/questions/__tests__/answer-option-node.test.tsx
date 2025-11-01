import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../../../stores/form-store.ts";
import { isQuestionNode } from "../../../stores/question-store.ts";
import { QuestionNode } from "../../nodes/question-node.tsx";

function getQuestionNode(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected question node for ${linkId}`);
  }
  return node;
}

describe("AnswerOptionNode", () => {
  it("renders a select for string answer options", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "favorite-color",
          text: "Favorite color",
          type: "string",
          answerOption: [
            { valueString: "Red" },
            { valueString: "Green" },
            { valueString: "Blue" },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getQuestionNode(form, "favorite-color");

    render(<QuestionNode item={question} />);

    const combobox = screen.getByRole("combobox", { name: /favorite color/i });
    expect(combobox).toBeInTheDocument();
    expect(combobox).toHaveValue("");

    const user = userEvent.setup();
    const greenOption = screen.getByRole("option", { name: "Green" }) as HTMLOptionElement;
    await user.selectOptions(combobox, greenOption.value);

    expect(greenOption.selected).toBe(true);
    expect(question.answers.at(0)?.value).toBe("Green");
  });

  it("selects the matching option for coding answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "severity",
          text: "Severity",
          type: "coding",
          answerOption: [
            { valueCoding: { code: "mild", display: "Mild" } },
            { valueCoding: { code: "moderate", display: "Moderate" } },
            { valueCoding: { code: "severe", display: "Severe" } },
          ],
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "in-progress",
      item: [
        {
          linkId: "severity",
          answer: [{ valueCoding: { code: "moderate", display: "Moderate" } }],
        },
      ],
    };

    const form = new FormStore(questionnaire, response);
    const question = getQuestionNode(form, "severity");

    render(<QuestionNode item={question} />);

    const combobox = screen.getByRole("combobox", { name: /severity/i });
    const selectedOption = screen.getByRole("option", { name: "Moderate" }) as HTMLOptionElement;
    expect(combobox).toBeInTheDocument();
    expect(selectedOption.selected).toBe(true);
    expect(question.answers.at(0)?.value).toMatchObject({
      code: "moderate",
      display: "Moderate",
    });
  });

  it("shows a disabled option for legacy answers until a new selection is made", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "ice-cream",
          text: "Ice cream",
          type: "string",
          answerOption: [{ valueString: "Vanilla" }],
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "completed",
      item: [
        {
          linkId: "ice-cream",
          answer: [{ valueString: "Chocolate" }],
        },
      ],
    };

    const form = new FormStore(questionnaire, response);
    const question = getQuestionNode(form, "ice-cream");

    render(<QuestionNode item={question} />);

    const combobox = screen.getByRole("combobox", { name: /ice cream/i });
    const legacyOption = screen.getByRole("option", {
      name: "Chocolate",
      hidden: true,
    }) as HTMLOptionElement;
    expect(legacyOption.disabled).toBe(true);
    expect(legacyOption.selected).toBe(true);
    expect(combobox).toHaveValue(legacyOption.value);
    expect(question.answers.at(0)?.value).toBe("Chocolate");

    const user = userEvent.setup();
    await user.selectOptions(
      combobox,
      screen.getByRole("option", { name: "Vanilla" }),
    );

    expect(
      screen.queryByRole("option", { name: "Chocolate", hidden: true }),
    ).toBeNull();
    expect(question.answers.at(0)?.value).toBe("Vanilla");
  });
});
