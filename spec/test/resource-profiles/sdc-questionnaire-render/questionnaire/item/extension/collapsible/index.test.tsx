import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { isGroupNode } from "@formbox/renderer/store/group/group-store.ts";
import { DefaultRenderer } from "@formbox/renderer/component/group/renderer/default-renderer.tsx";
import { StringRenderer } from "@formbox/renderer/component/question/fhir/string/string-renderer.tsx";
import { EXT } from "@formbox/renderer/utilities.ts";
import type { IGroupNode, IQuestionNode } from "@formbox/renderer/types.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

function getGroup(form: FormStore, linkId: string): IGroupNode {
  const node = form.scope.lookupNode(linkId);
  expect(node && isGroupNode(node)).toBe(true);
  if (!node || !isGroupNode(node)) {
    throw new Error(`Expected group node for ${linkId}`);
  }
  return node;
}

function getStringQuestion(
  form: FormStore,
  linkId: string,
): IQuestionNode<"string"> {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected string question node for ${linkId}`);
  }
  return node as IQuestionNode<"string">;
}

describe("collapsible", () => {
  it("collapses and expands group children based on extension value", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "demographics",
          text: "Demographics",
          type: "group",
          extension: [
            {
              url: EXT.SDC_COLLAPSIBLE,
              valueCode: "default-closed",
            },
          ],
          item: [
            {
              linkId: "nickname",
              text: "Nickname",
              type: "string",
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
    const group = getGroup(form, "demographics");
    const user = userEvent.setup();

    expect(group.isExpandable).toBe(true);
    expect(group.isExpanded).toBe(false);

    render(<DefaultRenderer node={group} />);

    expect(screen.queryByLabelText("Nickname")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Expand" }));
    expect(group.isExpanded).toBe(true);
    expect(screen.getByLabelText("Nickname")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Collapse" }));
    expect(group.isExpanded).toBe(false);
    expect(screen.queryByLabelText("Nickname")).toBeNull();
  });

  it("collapses and expands question child items through answer rendering path", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "symptom",
          text: "Primary symptom",
          type: "string",
          extension: [
            {
              url: EXT.SDC_COLLAPSIBLE,
              valueCode: "default-closed",
            },
          ],
          item: [
            {
              linkId: "symptom-note",
              text: "Symptom note",
              type: "string",
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
    const question = getStringQuestion(form, "symptom");
    const user = userEvent.setup();

    expect(question.isExpandable).toBe(true);
    expect(question.isExpanded).toBe(false);

    render(<StringRenderer node={question} />);

    expect(screen.queryByLabelText("Primary symptom")).toBeNull();
    expect(screen.queryByLabelText("Symptom note")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Expand" }));
    expect(question.isExpanded).toBe(true);
    expect(screen.getByLabelText("Primary symptom")).toBeInTheDocument();
    expect(screen.getByLabelText("Symptom note")).toBeInTheDocument();
  });

  it("shares collapsible state across repeated answers of the same question", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "issue",
          text: "Issue",
          type: "string",
          required: true,
          repeats: true,
          extension: [
            {
              url: EXT.SDC_COLLAPSIBLE,
              valueCode: "default-open",
            },
          ],
          item: [
            {
              linkId: "issue-note",
              text: "Issue note",
              type: "string",
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
    const question = getStringQuestion(form, "issue");
    const user = userEvent.setup();

    render(<StringRenderer node={question} />);

    expect(question.isExpanded).toBe(true);
    expect(question.answers).toHaveLength(1);
    expect(screen.getAllByLabelText("Issue note")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Add another" }));

    expect(question.answers).toHaveLength(2);
    expect(screen.getAllByLabelText("Issue note")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Collapse" }));

    expect(question.isExpanded).toBe(false);
    expect(question.answers).toHaveLength(2);
    expect(screen.queryByTitle("Add another")).toBeNull();
    expect(screen.queryByLabelText("Issue note")).toBeNull();
  });

  it("treats any collapsible code as expandable", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "invalid",
          text: "Invalid collapsible",
          type: "string",
          extension: [
            {
              url: EXT.SDC_COLLAPSIBLE,
              valueCode: "invalid-code",
            },
          ],
          item: [
            {
              linkId: "invalid-note",
              text: "Invalid note",
              type: "string",
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
    const question = getStringQuestion(form, "invalid");

    expect(question.isExpandable).toBe(true);
    expect(question.isExpanded).toBe(true);

    render(<StringRenderer node={question} />);

    expect(
      screen.getByRole("button", { name: "Collapse" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Invalid note")).toBeInTheDocument();
  });
});
