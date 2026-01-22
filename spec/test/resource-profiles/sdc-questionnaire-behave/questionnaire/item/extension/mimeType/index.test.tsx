import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { AttachmentRenderer } from "@formbox/renderer/component/question/fhir/attachment/attachment-renderer.tsx";
import { ListSelectRenderer } from "@formbox/renderer/component/question/renderer/list-select-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

const mimeTypeExtension = (code: string) => ({
  url: "http://hl7.org/fhir/StructureDefinition/mimeType",
  valueCode: code,
});

const maxSizeExtension = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxSize",
  valueDecimal: value,
});

describe("mimeType", () => {
  it("enforces attachment mime type", () => {
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

    const invalidAnswer = question.answers[0];
    assertDefined(invalidAnswer);
    invalidAnswer.setValueByUser({
      contentType: "image/gif",
      size: "200",
    });
    expect(form.validateAll()).toBe(false);
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/allowed content types/i),
      ),
    ).toBe(true);

    const validAnswer = question.answers[0];
    assertDefined(validAnswer);
    validAnswer.setValueByUser({
      contentType: "image/jpeg",
      size: "256",
    });
    expect(answer.issues).toHaveLength(0);
  });

  it("passes mimeType extensions to open-choice attachment inputs", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "document",
          text: "Document",
          type: "attachment",
          answerConstraint: "optionsOrType",
          extension: [
            mimeTypeExtension("image/png"),
            mimeTypeExtension("application/pdf"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("document");
    assertQuestionNode(question);

    const { container } = render(
      <ListSelectRenderer node={question as IQuestionNode<"attachment">} />,
    );

    fireEvent.click(screen.getByRole("radio", { name: /specify other/i }));

    const fileInput = container.querySelector('input[type="file"]') as
      | HTMLInputElement
      | undefined;
    expect(fileInput).not.toBeNull();
    expect(fileInput).toHaveAttribute("accept", "image/png,application/pdf");
  });

  it("applies mimeType extensions to file input accept attribute", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "upload",
          text: "Upload document",
          type: "attachment",
          extension: [
            mimeTypeExtension("image/png"),
            mimeTypeExtension("application/pdf"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("upload");
    assertQuestionNode(question);

    const { container } = render(
      <AttachmentRenderer node={question as IQuestionNode<"attachment">} />,
    );

    const input = container.querySelector("input[type='file']") as
      | HTMLInputElement
      | undefined;
    expect(input).not.toBeNull();
    if (!input) {
      throw new Error("Missing file input");
    }

    const accept = input.getAttribute("accept") ?? "";
    expect(accept).toContain("image/png");
    expect(accept).toContain("application/pdf");
  });

  it("ignores mimeType extensions on non-attachment items", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "notes",
          text: "Notes",
          type: "string",
          extension: [mimeTypeExtension("image/png")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("notes");
    assertQuestionNode(question);

    expect(question.mimeTypes).toEqual([]);
    expect(form.validateAll()).toBe(true);
  });
});
