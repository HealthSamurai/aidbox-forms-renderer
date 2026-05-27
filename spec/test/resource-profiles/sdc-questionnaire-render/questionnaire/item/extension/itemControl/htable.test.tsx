import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { SelectionTableControl } from "@formbox/renderer/component/group/control/selection-table-control.tsx";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { getGroupNode, itemControlExtension } from "./test-helpers.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

describe("itemControl.htable", () => {
  it("renders horizontal selection tables when htable control is used", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "matrix",
          text: "Matrix",
          type: "group",
          extension: [itemControlExtension("htable")],
          item: [
            {
              linkId: "question-1",
              text: "Question 1",
              type: "string",
              answerOption: [{ valueString: "Yes" }, { valueString: "No" }],
            },
            {
              linkId: "question-2",
              text: "Question 2",
              type: "string",
              answerOption: [{ valueString: "Yes" }, { valueString: "No" }],
            },
          ],
        },
      ],
    };

    const form = new FormStore(en, "r5", questionnaire, undefined, undefined);
    const group = getGroupNode(form, "matrix");

    expect(group.control).toBe("htable");

    render(<SelectionTableControl node={group} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: "Question 1",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("rowheader", {
        name: "Yes",
      }),
    ).toBeInTheDocument();
  });
});
