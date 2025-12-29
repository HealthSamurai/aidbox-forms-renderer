import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../../../stores/nodes/questions/question-store.ts";
import { CodingRenderer } from "../coding-renderer.tsx";
import type { IQuestionNode } from "../../../../../../types.ts";
import { strings } from "../../../../../../strings.ts";

afterEach(cleanup);

function getCodingQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected coding question");
  }
  return node as IQuestionNode<"coding">;
}

describe("coding-renderer", () => {
  describe("rendering", () => {
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
  });

  describe("answer updates", () => {
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

      const user = userEvent.setup();
      await user.type(systemInput, "http://loinc.org");
      await user.type(codeInput, "1234-5");

      await waitFor(() =>
        expect(question.answers[0]?.value).toEqual({
          system: "http://loinc.org",
          code: "1234-5",
        }),
      );

      await user.clear(systemInput);
      await user.clear(codeInput);

      await waitFor(() => expect(question.answers[0]?.value).toBeNull());
    });
  });
});
