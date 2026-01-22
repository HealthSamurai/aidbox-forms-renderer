import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { DropdownSelectRenderer } from "@formbox/renderer/component/question/renderer/dropdown-select-renderer.tsx";
import { EXT, ITEM_CONTROL_SYSTEM } from "@formbox/renderer/utilities.ts";

describe("itemControl.lookup", () => {
  it("marks the question control and renders a dropdown control", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "provider",
          text: "Provider",
          type: "string",
          answerOption: [{ valueString: "Clinic" }],
          extension: [
            {
              url: EXT.ITEM_CONTROL,
              valueCodeableConcept: {
                coding: [
                  {
                    system: ITEM_CONTROL_SYSTEM,
                    code: "lookup",
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("provider");
    expect(node && isQuestionNode(node)).toBe(true);
    if (!node || !isQuestionNode(node)) {
      throw new Error("Expected question node");
    }

    expect(node.control).toBe("lookup");

    render(<DropdownSelectRenderer node={node} />);
    expect(
      screen.getByRole("combobox", { name: "Provider" }),
    ).toBeInTheDocument();
  });
});
