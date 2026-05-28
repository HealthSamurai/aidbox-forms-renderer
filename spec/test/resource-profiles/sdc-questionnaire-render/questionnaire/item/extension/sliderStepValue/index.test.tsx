import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { NumberSliderRenderer } from "@formbox/renderer/component/question/renderer/number-slider-renderer.tsx";
import { QuantitySliderRenderer } from "@formbox/renderer/component/question/renderer/quantity-slider-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { EXT } from "@formbox/renderer/utilities.ts";
import {
  getQuestionNode,
  itemControlExtension,
} from "../itemControl/test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

function sliderStepExtension(value: number) {
  return Number.isInteger(value)
    ? {
        url: EXT.SLIDER_STEP_VALUE,
        valueInteger: value,
      }
    : {
        url: EXT.SLIDER_STEP_VALUE,
        valueDecimal: value,
      };
}

describe("sliderStepValue", () => {
  it("applies integer step values to numeric slider controls", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "pain-score",
          text: "Pain score",
          type: "integer",
          extension: [itemControlExtension("slider"), sliderStepExtension(5)],
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
    const question = getQuestionNode(
      form,
      "pain-score",
    ) as IQuestionNode<"integer">;

    const { container } = render(<NumberSliderRenderer node={question} />);
    const slider = container.querySelector(
      'input[type="range"]',
    ) as HTMLInputElement | null;

    expect(slider).not.toBeNull();
    expect(slider?.step).toBe("5");
  });

  it("applies decimal step values to quantity slider controls", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            itemControlExtension("slider"),
            sliderStepExtension(0.25),
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
    const question = getQuestionNode(form, "dose") as IQuestionNode<"quantity">;

    const { container } = render(<QuantitySliderRenderer node={question} />);
    const slider = container.querySelector(
      'input[type="range"]',
    ) as HTMLInputElement | null;

    expect(slider).not.toBeNull();
    expect(slider?.step).toBe("0.25");
  });
});
