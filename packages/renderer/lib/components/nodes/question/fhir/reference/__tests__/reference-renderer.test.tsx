import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../../../stores/nodes/questions/question-store.ts";
import { ReferenceRenderer } from "../reference-renderer.tsx";
import type { IQuestionNode } from "../../../../../../types.ts";
import { strings } from "../../../../../../strings.ts";

afterEach(cleanup);

function getReferenceQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected reference question");
  }
  return node as IQuestionNode<"reference">;
}

describe("reference-renderer", () => {
  describe("rendering", () => {
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

      const form = new FormStore(questionnaire);
      const question = getReferenceQuestion(form, "patient");

      render(<ReferenceRenderer node={question} />);

      expect(
        screen.getByPlaceholderText(strings.inputs.referencePlaceholder),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(strings.inputs.referenceDisplayPlaceholder),
      ).toBeInTheDocument();
    });
  });

  describe("answer updates", () => {
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

      const form = new FormStore(questionnaire);
      const question = getReferenceQuestion(form, "patient");

      render(<ReferenceRenderer node={question} />);

      const referenceInput = screen.getByPlaceholderText(
        strings.inputs.referencePlaceholder,
      );
      const displayInput = screen.getByPlaceholderText(
        strings.inputs.referenceDisplayPlaceholder,
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

      await waitFor(() => expect(question.answers[0]?.value).toBeNull());
    });
  });
});
