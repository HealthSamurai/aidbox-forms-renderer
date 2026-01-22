import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { StringRenderer } from "@formbox/renderer/component/question/fhir/string/string-renderer.tsx";
import { EXT } from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

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

    const form = new FormStore(questionnaire);
    const question = getStringQuestion(form, "mrn");

    render(<StringRenderer node={question} />);

    const input = screen.getByLabelText(
      "Medical record number",
    ) as HTMLInputElement;
    expect(input.placeholder).toBe("MRN-####");
  });
});
