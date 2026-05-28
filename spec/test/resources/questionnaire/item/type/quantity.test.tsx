import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { QuantityRenderer } from "@formbox/renderer/component/question/fhir/quantity/quantity-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
function getQuantityQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected quantity question for ${linkId}`);
  }
  return node as IQuestionNode<"quantity">;
}

describe("type.quantity", () => {
  it("renders unit select when no unit options are provided", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "volume",
          text: "Volume",
          type: "quantity",
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
    const question = getQuantityQuestion(form, "volume");

    const { container } = render(<QuantityRenderer node={question} />);

    expect(container.querySelector("input[placeholder='unit']")).toBeNull();
    expect(
      screen.getByRole("combobox", { name: /volume/i }),
    ).toBeInTheDocument();
  });

  it("uses the default value placeholder when none is provided", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "volume",
          text: "Volume",
          type: "quantity",
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
    const question = getQuantityQuestion(form, "volume");

    render(<QuantityRenderer node={question} />);

    const valueInput = screen.getByRole("spinbutton", {
      name: /volume/i,
    }) as HTMLInputElement;

    expect(valueInput.placeholder).toBe(en.inputs.quantityValuePlaceholder);
  });
});
