import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";

const ITEM_CONTROL_EXTENSION =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl";
const ITEM_CONTROL_SYSTEM = "http://hl7.org/fhir/questionnaire-item-control";

describe("itemControl.footer", () => {
  it("reports duplicate footer groups", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        makeGroup("footer-a", "Footer A", "footer"),
        makeGroup("footer-b", "Footer B", "footer"),
      ],
    };

    const store = new FormStore(questionnaire);

    expect(
      store.issues.some((issue) =>
        issue.diagnostics?.includes("Only one footer group"),
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
