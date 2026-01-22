import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { QuantityRenderer } from "@formbox/renderer/component/question/fhir/quantity/quantity-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { strings } from "@formbox/renderer/strings.ts";

function getQuantityQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected quantity question for ${linkId}`);
  }
  return node as IQuestionNode<"quantity">;
}

describe("type.quantity", () => {
  it("keeps free-form unit entry as text when no unit options are provided", async () => {
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

    const form = new FormStore(questionnaire);
    const question = getQuantityQuestion(form, "volume");

    const { container } = render(<QuantityRenderer node={question} />);

    expect(container.querySelector("select")).toBeNull();

    const unitInput = container.querySelector(
      "input[placeholder='unit']",
    ) as HTMLInputElement;
    expect(unitInput).toBeTruthy();
    if (!unitInput) return;

    const user = userEvent.setup();
    await user.type(unitInput, "fl oz");

    expect(unitInput).toHaveValue("fl oz");
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

    const form = new FormStore(questionnaire);
    const question = getQuantityQuestion(form, "volume");

    render(<QuantityRenderer node={question} />);

    const valueInput = screen.getByRole("spinbutton", {
      name: /volume/i,
    }) as HTMLInputElement;

    expect(valueInput.placeholder).toBe(
      strings.inputs.quantityValuePlaceholder,
    );
  });
});
