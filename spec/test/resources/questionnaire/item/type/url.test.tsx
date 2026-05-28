import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { StringRenderer } from "@formbox/renderer/component/question/fhir/string/string-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

import type {
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;
function getUrlQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected url question");
  }
  return node as IQuestionNode<"url">;
}

describe("type.url", () => {
  it("renders a url input and seeds the response value", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "website",
          text: "Website",
          type: "url",
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#questionnaire",
      status: "in-progress",
      item: [
        {
          linkId: "website",
          answer: [{ valueUri: "https://example.org" }],
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
    const question = getUrlQuestion(form, "website");

    render(<StringRenderer node={question} />);

    const input = screen.getByLabelText("Website") as HTMLInputElement;
    expect(input.type).toBe("url");
    expect(input.value).toBe("https://example.org");
  });
});
