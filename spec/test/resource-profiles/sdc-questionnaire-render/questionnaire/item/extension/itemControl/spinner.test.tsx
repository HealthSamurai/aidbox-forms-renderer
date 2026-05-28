import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { NumberSpinnerRenderer } from "@formbox/renderer/component/question/renderer/number-spinner-renderer.tsx";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { getQuestionNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

describe("itemControl.spinner", () => {
  it("renders spinner buttons and numeric input for numeric questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "count",
          text: "Count",
          type: "integer",
          extension: [itemControlExtension("spinner")],
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
    const question = getQuestionNode(form, "count") as IQuestionNode<"integer">;

    expect(question.control).toBe("spinner");

    render(<NumberSpinnerRenderer node={question} />);

    expect(
      screen.getByRole("button", { name: "Decrease value" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Increase value" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: "Count" }),
    ).toBeInTheDocument();
  });
});
