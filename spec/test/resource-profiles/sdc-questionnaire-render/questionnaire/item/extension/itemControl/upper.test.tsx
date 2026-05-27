import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { NumberSliderRenderer } from "@formbox/renderer/component/question/renderer/number-slider-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { getQuestionNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

describe("itemControl.upper", () => {
  it("renders upper label text for slider questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "pain",
          text: "Pain",
          type: "integer",
          extension: [itemControlExtension("slider")],
          item: [
            {
              linkId: "pain-upper",
              text: "Worst pain",
              type: "display",
              extension: [itemControlExtension("upper")],
            },
          ],
        },
      ],
    };

    const form = new FormStore(en, "r5", questionnaire, undefined, undefined);
    const question = getQuestionNode(form, "pain") as IQuestionNode<"integer">;

    expect(question.upper).toBe("Worst pain");

    render(<NumberSliderRenderer node={question} />);

    expect(screen.getByText("Worst pain")).toBeInTheDocument();
  });
});
