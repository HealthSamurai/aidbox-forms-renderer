import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
const ITEM_CONTROL_EXTENSION =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl";
const ITEM_CONTROL_SYSTEM = "http://hl7.org/fhir/questionnaire-item-control";

describe("itemControl.header", () => {
  it("reports duplicate header groups", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        makeGroup("header-a", "Header A", "header"),
        makeGroup("header-b", "Header B", "header"),
      ],
    };

    const store = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );

    expect(
      store.issues.some((issue) =>
        issue.diagnostics?.includes("Only one header group"),
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
