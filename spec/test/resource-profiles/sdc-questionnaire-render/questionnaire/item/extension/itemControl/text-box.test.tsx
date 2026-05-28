import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { StringRenderer } from "@formbox/renderer/component/question/fhir/string/string-renderer.tsx";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { getQuestionNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

describe("itemControl.text-box", () => {
  it("keeps text questions renderable when text-box control is used", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "notes",
          text: "Notes",
          type: "text",
          extension: [itemControlExtension("text-box")],
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
    const question = getQuestionNode(form, "notes") as IQuestionNode<"text">;

    expect(question.control).toBe("text-box");

    render(<StringRenderer node={question} />);

    const textarea = screen.getByLabelText("Notes");
    expect(textarea.tagName.toLowerCase()).toBe("textarea");
  });
});
