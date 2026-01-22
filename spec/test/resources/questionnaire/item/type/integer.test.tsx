import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { IntegerRenderer } from "@formbox/renderer/component/question/fhir/integer/integer-renderer.tsx";
import { EXT } from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

function getIntegerQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected integer question");
  }
  return node as IQuestionNode<"integer">;
}

describe("type.integer", () => {
  it("uses a step of 1 for integer inputs", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "count",
          text: "Count",
          type: "integer",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getIntegerQuestion(form, "count");

    render(<IntegerRenderer node={question} />);

    const input = screen.getByLabelText("Count") as HTMLInputElement;
    expect(input).toHaveAttribute("step", "1");
  });

  it("applies min and max value constraints as input attributes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "pills",
          text: "Pills per day",
          type: "integer",
          extension: [
            {
              url: EXT.MIN_VALUE,
              valueInteger: 1,
            },
            {
              url: EXT.MAX_VALUE,
              valueInteger: 12,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getIntegerQuestion(form, "pills");

    render(<IntegerRenderer node={question} />);

    const input = screen.getByLabelText("Pills per day") as HTMLInputElement;
    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("max", "12");
  });
});
