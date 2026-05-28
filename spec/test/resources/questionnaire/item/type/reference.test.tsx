import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { ReferenceRenderer } from "@formbox/renderer/component/question/fhir/reference/reference-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
function getReferenceQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected reference question");
  }
  return node as IQuestionNode<"reference">;
}

describe("type.reference", () => {
  it("renders reference fields with placeholders", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "patient",
          text: "Patient",
          type: "reference",
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
    const question = getReferenceQuestion(form, "patient");

    render(<ReferenceRenderer node={question} />);

    expect(
      screen.getByPlaceholderText(en.inputs.referencePlaceholder),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(en.inputs.referenceDisplayPlaceholder),
    ).toBeInTheDocument();
  });

  it("updates the answer as reference fields change", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "patient",
          text: "Patient",
          type: "reference",
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
    const question = getReferenceQuestion(form, "patient");

    render(<ReferenceRenderer node={question} />);

    const referenceInput = screen.getByPlaceholderText(
      en.inputs.referencePlaceholder,
    );
    const displayInput = screen.getByPlaceholderText(
      en.inputs.referenceDisplayPlaceholder,
    );

    fireEvent.change(referenceInput, {
      target: { value: "Patient/123" },
    });
    fireEvent.change(displayInput, {
      target: { value: "Jane Doe" },
    });

    await waitFor(() =>
      expect(question.answers[0]?.value).toEqual({
        reference: "Patient/123",
        display: "Jane Doe",
      }),
    );

    fireEvent.change(referenceInput, { target: { value: "" } });
    fireEvent.change(displayInput, { target: { value: "" } });

    await waitFor(() => expect(question.answers[0]?.value).toBeUndefined());
  });
});
