import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { StringRenderer } from "@formbox/renderer/component/question/fhir/string/string-renderer.tsx";
import { EXT } from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
function getStringQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected question node");
  }
  return node as IQuestionNode<"string">;
}

describe("entryFormat", () => {
  it("uses entryFormat extension as placeholder", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "mrn",
          text: "Medical record number",
          type: "string",
          extension: [
            {
              url: EXT.ENTRY_FORMAT,
              valueString: "MRN-####",
            },
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
    const question = getStringQuestion(form, "mrn");

    render(<StringRenderer node={question} />);

    const input = screen.getByLabelText(
      "Medical record number",
    ) as HTMLInputElement;
    expect(input.placeholder).toBe("MRN-####");
  });
});
