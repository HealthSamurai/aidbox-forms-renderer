import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../stores/form/form-store.ts";

const ITEM_CONTROL_EXTENSION =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl";
const ITEM_CONTROL_SYSTEM = "http://hl7.org/fhir/questionnaire-item-control";

describe("FormStore item control validations", () => {
  it("reports duplicate header groups", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        makeGroup("header-a", "Header A", "header"),
        makeGroup("header-b", "Header B", "header"),
      ],
    };

    const store = new FormStore(questionnaire);

    expect(
      store.issues.some((issue) =>
        issue.diagnostics?.includes("Only one header group"),
      ),
    ).toBe(true);
  });

  it("reports invalid siblings when page control is used", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        makeGroup("page-1", "Page 1", "page"),
        {
          linkId: "question-1",
          text: "Loose question",
          type: "string",
        },
      ],
    };

    const store = new FormStore(questionnaire);

    expect(
      store.issues.some((issue) =>
        issue.diagnostics?.includes('Top-level item "question-1"'),
      ),
    ).toBe(true);
  });
});

function makeGroup(
  linkId: string,
  text: string,
  control: "header" | "footer" | "page",
) {
  return {
    linkId,
    text,
    type: "group",
    extension: [
      {
        url: ITEM_CONTROL_EXTENSION,
        valueCodeableConcept: {
          coding: [
            {
              system: ITEM_CONTROL_SYSTEM,
              code: control,
            },
          ],
        },
      },
    ],
  } satisfies NonNullable<Questionnaire["item"]>[number];
}
