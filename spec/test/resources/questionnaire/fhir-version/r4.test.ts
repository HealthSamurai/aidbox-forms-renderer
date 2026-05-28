import { describe, expect, it } from "vitest";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import type { QuestionnaireOf } from "@formbox/renderer";

describe("fhirVersion.r4", () => {
  it("uses the R4 fhirpath model for response item metadata", () => {
    type Questionnaire = QuestionnaireOf<"r4">;
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "display-1",
          text: "Hello",
          type: "display",
        },
      ],
    };

    const form = new FormStore(
      en,
      "r4",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const item = form.expressionResponse.item?.[0];
    expect(item).toBeDefined();

    const path = (item as { __path__?: { model?: unknown } }).__path__;
    expect(path?.model).toBe(form.adapter.getFhirpathModel());
  });
});
