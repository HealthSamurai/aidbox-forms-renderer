import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

const mimeTypeExtension = (code: string) => ({
  url: "http://hl7.org/fhir/StructureDefinition/mimeType",
  valueCode: code,
});

const maxSizeExtension = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxSize",
  valueDecimal: value,
});

describe("maxSize", () => {
  it("enforces attachment max size", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "photo",
          text: "Upload photo",
          type: "attachment",
          extension: [
            mimeTypeExtension("image/png"),
            mimeTypeExtension("image/jpeg"),
            maxSizeExtension(512),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("photo");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    const oversizedAnswer = question.answers[0];
    assertDefined(oversizedAnswer);
    oversizedAnswer.setValueByUser({
      contentType: "image/png",
      size: "1024",
    });
    expect(form.validateAll()).toBe(false);
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/exceed 512 bytes/i),
      ),
    ).toBe(true);

    const okAnswer = question.answers[0];
    assertDefined(okAnswer);
    okAnswer.setValueByUser({
      contentType: "image/jpeg",
      size: "256",
    });
    expect(form.validateAll()).toBe(true);
    expect(answer.issues).toHaveLength(0);
  });

  it("estimates size from base64 data", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "document",
          text: "Document",
          type: "attachment",
          extension: [maxSizeExtension(2)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("document");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    answer.setValueByUser({
      contentType: "text/plain",
      data: "TWFu",
    });

    expect(form.validateAll()).toBe(false);
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/exceed 2 bytes/i),
      ),
    ).toBe(true);
  });
});
