import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { AttachmentRenderer } from "@formbox/renderer/component/question/fhir/attachment/attachment-renderer.tsx";
import { EXT } from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

function getAttachmentQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected attachment question");
  }
  return node as IQuestionNode<"attachment">;
}

describe("type.attachment", () => {
  it("renders attachment summary and allows clearing", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "report",
          text: "Lab report",
          type: "attachment",
          initial: [
            {
              valueAttachment: {
                size: "2048",
              },
            },
          ],
        },
      ],
    };
    const form = new FormStore(questionnaire);
    const question = getAttachmentQuestion(form, "report");

    render(<AttachmentRenderer node={question} />);

    expect(screen.getByText("Attachment selected (2 KB)")).toBeInTheDocument();
    const clearButton = screen.getByRole("button", {
      name: "Clear attachment",
    });

    const user = userEvent.setup();
    await user.click(clearButton);

    expect(question.answers[0]?.value).toBeUndefined();
  });

  it("applies mimeType extension to file input accept attribute", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "upload",
          text: "Upload document",
          type: "attachment",
          extension: [
            { url: EXT.MIME_TYPE, valueCode: "image/png" },
            { url: EXT.MIME_TYPE, valueCode: "application/pdf" },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = getAttachmentQuestion(form, "upload");

    const { container } = render(<AttachmentRenderer node={question} />);

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
});
