import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { ListSelectRenderer } from "@formbox/renderer/component/question/renderer/list-select-renderer.tsx";
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

describe("itemAnswerMedia", () => {
  it("reads itemAnswerMedia attachment from direct answerOption entries", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "severity",
          type: "string",
          text: "Severity",
          extension: [
            {
              url: EXT.ITEM_CONTROL,
              valueCodeableConcept: {
                coding: [
                  {
                    system: "http://hl7.org/fhir/questionnaire-item-control",
                    code: "radio-button",
                  },
                ],
              },
            },
          ],
          answerOption: [
            {
              valueString: "Mild",
              extension: [
                {
                  url: EXT.SDC_ITEM_ANSWER_MEDIA,
                  valueAttachment: {
                    title: "Mild visual",
                    contentType: "image/png",
                    data: "AAAA",
                  },
                },
              ],
            },
            {
              valueString: "Moderate",
              extension: [
                {
                  url: EXT.SDC_ITEM_ANSWER_MEDIA,
                  valueAttachment: {
                    title: "Moderate guidance",
                    contentType: "application/pdf",
                    url: "https://example.com/moderate-guidance.pdf",
                  },
                },
              ],
            },
            {
              valueString: "Severe",
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
    const question = getStringQuestion(form, "severity");

    expect(
      question.answerOption.inherentOptions.map((option) => option.media),
    ).toEqual([
      {
        title: "Mild visual",
        contentType: "image/png",
        data: "AAAA",
      },
      {
        title: "Moderate guidance",
        contentType: "application/pdf",
        url: "https://example.com/moderate-guidance.pdf",
      },
      undefined,
    ]);
  });

  it("renders answer option media inline with the option label", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "severity",
          type: "string",
          text: "Severity",
          extension: [
            {
              url: EXT.ITEM_CONTROL,
              valueCodeableConcept: {
                coding: [
                  {
                    system: "http://hl7.org/fhir/questionnaire-item-control",
                    code: "radio-button",
                  },
                ],
              },
            },
          ],
          answerOption: [
            {
              valueString: "Mild",
              extension: [
                {
                  url: EXT.SDC_ITEM_ANSWER_MEDIA,
                  valueAttachment: {
                    title: "Mild visual",
                    contentType: "image/png",
                    data: "AAAA",
                  },
                },
              ],
            },
            {
              valueString: "Moderate",
              extension: [
                {
                  url: EXT.SDC_ITEM_ANSWER_MEDIA,
                  valueAttachment: {
                    title: "Moderate guidance",
                    contentType: "application/pdf",
                    url: "https://example.com/moderate-guidance.pdf",
                  },
                },
              ],
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
    const question = getStringQuestion(form, "severity");

    render(<ListSelectRenderer node={question} />);

    const image = screen.getByRole("img", {
      name: "Mild visual",
    }) as HTMLImageElement;
    expect(image.getAttribute("src")).toBe("data:image/png;base64,AAAA");

    const link = screen.getByRole("link", { name: "Moderate guidance" });
    expect(link).toHaveAttribute(
      "href",
      "https://example.com/moderate-guidance.pdf",
    );
  });
});
