import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { isGroupNode } from "@formbox/renderer/store/group/group-store.ts";
import { isGroupListStore } from "@formbox/renderer/store/group/group-list-store.ts";
import { SelectionTableControl } from "@formbox/renderer/component/group/control/selection-table-control.tsx";
import { GridTableControl } from "@formbox/renderer/component/group/control/grid-table-control.tsx";
import type {
  IGroupList,
  IGroupNode,
  IQuestionNode,
} from "@formbox/renderer/types.ts";
import { EXT } from "@formbox/renderer/utilities.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

function getQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected question node for ${linkId}`);
  }
  return node as IQuestionNode;
}

function getGroup(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isGroupNode(node)).toBe(true);
  if (!node || !isGroupNode(node)) {
    throw new Error(`Expected group node for ${linkId}`);
  }
  return node as IGroupNode;
}

function getGroupList(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isGroupListStore(node)).toBe(true);
  if (!node || !isGroupListStore(node)) {
    throw new Error(`Expected group list node for ${linkId}`);
  }
  return node as IGroupList;
}

function itemControlExtension(code: "htable" | "gtable") {
  return {
    url: EXT.ITEM_CONTROL,
    valueCodeableConcept: {
      coding: [
        {
          system: "http://hl7.org/fhir/questionnaire-item-control",
          code,
        },
      ],
    },
  };
}

function widthExtension(value: number, code?: "%") {
  return {
    url: EXT.SDC_WIDTH,
    valueQuantity:
      code === "%"
        ? {
            value,
            code,
            system: "http://unitsofmeasure.org",
          }
        : {
            value,
          },
  };
}

describe("width", () => {
  it("parses width as pixels when quantity code is absent", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "q-px",
          text: "Question with pixel width",
          type: "string",
          extension: [widthExtension(180)],
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
    const question = getQuestion(form, "q-px");

    expect(question.columnWidth).toBe("180px");
  });

  it("parses width as percentage when quantity code is %", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "q-percent",
          text: "Question with percentage width",
          type: "string",
          extension: [widthExtension(35, "%")],
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
    const question = getQuestion(form, "q-percent");

    expect(question.columnWidth).toBe("35%");
  });

  it("applies configured widths to htable question columns", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "htable-group",
          text: "Patient vitals",
          type: "group",
          extension: [itemControlExtension("htable")],
          item: [
            {
              linkId: "systolic",
              text: "Systolic",
              type: "string",
              extension: [widthExtension(120)],
              answerOption: [
                { valueString: "Normal" },
                { valueString: "High" },
              ],
            },
            {
              linkId: "diastolic",
              text: "Diastolic",
              type: "string",
              extension: [widthExtension(40, "%")],
              answerOption: [
                { valueString: "Normal" },
                { valueString: "High" },
              ],
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
    const group = getGroup(form, "htable-group");

    render(<SelectionTableControl node={group} />);

    expect(screen.getByRole("columnheader", { name: "Systolic" })).toHaveStyle({
      width: "120px",
    });
    expect(screen.getByRole("columnheader", { name: "Diastolic" })).toHaveStyle(
      { width: "40%" },
    );
  }, 15_000);

  it("applies configured widths to gtable question columns", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "gtable-group",
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
              extension: [widthExtension(200)],
            },
            {
              linkId: "duration",
              text: "Duration",
              type: "integer",
              extension: [widthExtension(35, "%")],
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
    const list = getGroupList(form, "gtable-group");

    render(<GridTableControl list={list} />);

    expect(
      form.issues.find((issue) =>
        issue.diagnostics?.includes(
          "uses 'gtable' but is not marked as repeating",
        ),
      ),
    ).toBeUndefined();

    expect(screen.getByRole("columnheader", { name: "Symptom" })).toHaveStyle({
      width: "200px",
    });
    expect(screen.getByRole("columnheader", { name: "Duration" })).toHaveStyle({
      width: "35%",
    });
  });
});
