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

type ItemMediaAttachment = {
  title?: string | undefined;
  contentType?: string | undefined;
  data?: string | undefined;
  url?: string | undefined;
};

function getStringQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected string question");
  }
  return node as IQuestionNode<"string">;
}

function buildQuestionnaire(itemMedia: ItemMediaAttachment): Questionnaire {
  return {
    resourceType: "Questionnaire",
    status: "active",
    item: [
      {
        linkId: "q1",
        text: "Question with media",
        type: "string",
        extension: [
          {
            url: EXT.SDC_ITEM_MEDIA,
            valueAttachment: itemMedia,
          },
        ],
      },
    ],
  };
}

describe("itemMedia", () => {
  it("renders image media inline", () => {
    const questionnaire = buildQuestionnaire({
      title: "Question image",
      contentType: "image/png",
      data: "AAAA",
    });

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const question = getStringQuestion(form, "q1");

    render(<StringRenderer node={question} />);

    const image = screen.getByRole("img", {
      name: "Question image",
    }) as HTMLImageElement;
    expect(image.getAttribute("src")).toBe("data:image/png;base64,AAAA");
  });

  it("renders audio media inline", () => {
    const questionnaire = buildQuestionnaire({
      title: "Question audio",
      contentType: "audio/mpeg",
      url: "https://example.com/prompt.mp3",
    });

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const question = getStringQuestion(form, "q1");

    const { container } = render(<StringRenderer node={question} />);

    const audio = container.querySelector("audio");
    expect(audio).toBeInTheDocument();
    expect(audio?.getAttribute("src")).toBe("https://example.com/prompt.mp3");
  });

  it("renders video media inline", () => {
    const questionnaire = buildQuestionnaire({
      title: "Question video",
      contentType: "video/mp4",
      url: "https://example.com/prompt.mp4",
    });

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const question = getStringQuestion(form, "q1");

    const { container } = render(<StringRenderer node={question} />);

    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video?.getAttribute("src")).toBe("https://example.com/prompt.mp4");
  });

  it("renders non-media content as link", () => {
    const questionnaire = buildQuestionnaire({
      title: "Instructions",
      contentType: "application/pdf",
      url: "https://example.com/instructions.pdf",
    });

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const question = getStringQuestion(form, "q1");

    render(<StringRenderer node={question} />);

    const link = screen.getByRole("link", { name: "Instructions" });
    expect(link.getAttribute("href")).toBe(
      "https://example.com/instructions.pdf",
    );
  });

  it("renders text fallback when media has no source", () => {
    const questionnaire = buildQuestionnaire({
      title: "Attachment details",
      contentType: "application/json",
    });

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const question = getStringQuestion(form, "q1");

    render(<StringRenderer node={question} />);

    expect(screen.getByText("Attachment details")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Attachment details" }),
    ).not.toBeInTheDocument();
  });
});
