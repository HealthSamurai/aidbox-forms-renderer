import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TabContainerRenderer } from "@formbox/renderer/component/group/renderer/tab-container-renderer.tsx";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { getGroupNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

describe("itemControl.tab-container", () => {
  it("renders grouped children as switchable tabs", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "tabs",
          text: "Sections",
          type: "group",
          extension: [itemControlExtension("tab-container")],
          item: [
            {
              linkId: "history",
              text: "History",
              type: "group",
              item: [
                {
                  linkId: "history-note",
                  text: "History note",
                  type: "string",
                },
              ],
            },
            {
              linkId: "medications",
              text: "Medications",
              type: "group",
              item: [
                {
                  linkId: "medication-name",
                  text: "Medication name",
                  type: "string",
                },
              ],
            },
          ],
        },
      ],
    };

    const user = userEvent.setup();
    const form = new FormStore(en, "r5", questionnaire, undefined, undefined);
    const group = getGroupNode(form, "tabs");

    expect(group.control).toBe("tab-container");

    render(<TabContainerRenderer node={group} />);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByLabelText("History note")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Medications" }));

    expect(screen.getByLabelText("Medication name")).toBeInTheDocument();
  });
});
