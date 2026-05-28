import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { GridTableControl } from "@formbox/renderer/component/group/control/grid-table-control.tsx";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { getGroupListNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

describe("itemControl.gtable", () => {
  it("renders repeating group tables when gtable control is used", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "visits",
          text: "Visits",
          type: "group",
          repeats: true,
          required: true,
          extension: [itemControlExtension("gtable")],
          item: [
            {
              linkId: "symptom",
              text: "Symptom",
              type: "string",
            },
            {
              linkId: "duration",
              text: "Duration",
              type: "integer",
            },
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
    const list = getGroupListNode(form, "visits");

    expect(list.control).toBe("gtable");

    render(<GridTableControl list={list} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: "Symptom",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: "Duration",
      }),
    ).toBeInTheDocument();
  });
});
