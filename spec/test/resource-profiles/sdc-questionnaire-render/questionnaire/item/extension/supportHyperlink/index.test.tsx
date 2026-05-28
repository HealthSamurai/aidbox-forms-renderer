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
    throw new Error(`Expected string question for ${linkId}`);
  }
  return node as IQuestionNode<"string">;
}

describe("supportHyperlink", () => {
  it("reads supportHyperlink and deprecated supportLink extensions from questionnaire items", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "instructions",
          type: "string",
          text: "Read supporting details",
          extension: [
            {
              url: EXT.SUPPORT_HYPERLINK,
              extension: [
                {
                  url: "label",
                  valueString: "More info",
                },
                {
                  url: "link",
                  valueUri: "https://example.com/help",
                },
              ],
            },
            {
              url: EXT.SUPPORT_HYPERLINK,
              extension: [
                {
                  url: "label",
                  valueString: "FAQ",
                },
                {
                  url: "link",
                  valueUri: "https://example.com/faq",
                },
              ],
            },
            {
              url: EXT.SUPPORT_LINK,
              valueUri: "https://example.com/legacy",
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
    const question = getStringQuestion(form, "instructions");

    expect(question.supportHyperlinks).toEqual([
      {
        href: "https://example.com/help",
        label: "More info",
      },
      {
        href: "https://example.com/faq",
        label: "FAQ",
      },
      {
        href: "https://example.com/legacy",
        label: undefined,
      },
    ]);
  });

  it("renders support hyperlinks alongside item text", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "instructions",
          type: "string",
          text: "Read supporting details",
          extension: [
            {
              url: EXT.SUPPORT_HYPERLINK,
              extension: [
                {
                  url: "label",
                  valueString: "More info",
                },
                {
                  url: "link",
                  valueUri: "https://example.com/help",
                },
              ],
            },
            {
              url: EXT.SUPPORT_LINK,
              valueUri: "https://example.com/legacy",
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
    const question = getStringQuestion(form, "instructions");

    render(<StringRenderer node={question} />);

    expect(screen.getByRole("link", { name: /More info/ })).toHaveAttribute(
      "href",
      "https://example.com/help",
    );
    expect(
      screen.getByRole("link", { name: /https:\/\/example\.com\/legacy/ }),
    ).toHaveAttribute("href", "https://example.com/legacy");
  });
});
