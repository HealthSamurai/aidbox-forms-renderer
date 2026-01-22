import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { CodingRenderer } from "@formbox/renderer/component/question/fhir/coding/coding-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { strings } from "@formbox/renderer/strings.ts";

function getCodingQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected coding question");
  }
  return node as IQuestionNode<"coding">;
}

describe("type.coding", () => {
  it("renders coding fields with placeholders", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "diagnosis",
          text: "Diagnosis",
          type: "coding",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getCodingQuestion(form, "diagnosis");

    render(<CodingRenderer node={question} />);

    expect(
      screen.getByPlaceholderText(strings.inputs.codingSystemPlaceholder),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(strings.inputs.codingCodePlaceholder),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(strings.inputs.codingDisplayPlaceholder),
    ).toBeInTheDocument();
  });

  it("updates the answer as coding fields change", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "diagnosis",
          text: "Diagnosis",
          type: "coding",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getCodingQuestion(form, "diagnosis");

    render(<CodingRenderer node={question} />);

    const systemInput = screen.getByPlaceholderText(
      strings.inputs.codingSystemPlaceholder,
    );
    const codeInput = screen.getByPlaceholderText(
      strings.inputs.codingCodePlaceholder,
    );

    fireEvent.change(systemInput, { target: { value: "http://loinc.org" } });
    fireEvent.change(codeInput, { target: { value: "1234-5" } });

    await waitFor(() =>
      expect(question.answers[0]?.value).toEqual({
        system: "http://loinc.org",
        code: "1234-5",
      }),
    );

    fireEvent.change(systemInput, { target: { value: "" } });
    fireEvent.change(codeInput, { target: { value: "" } });

    await waitFor(() => expect(question.answers[0]?.value).toBeUndefined());
  });
});
