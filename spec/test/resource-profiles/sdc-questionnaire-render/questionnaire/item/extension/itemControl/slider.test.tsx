import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { NumberSliderRenderer } from "@formbox/renderer/component/question/renderer/number-slider-renderer.tsx";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { getQuestionNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

describe("itemControl.slider", () => {
  it("renders range input for numeric questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "pain",
          text: "Pain",
          type: "integer",
          extension: [itemControlExtension("slider")],
        },
      ],
    };

    const form = new FormStore(en, "r5", questionnaire, undefined, undefined);
    const question = getQuestionNode(form, "pain") as IQuestionNode<"integer">;

    expect(question.control).toBe("slider");

    const { container } = render(<NumberSliderRenderer node={question} />);
    expect(container.querySelector('input[type="range"]')).toBeInTheDocument();
  });
});
