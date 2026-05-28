import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertGroupNode } from "@formbox/renderer/store/group/group-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { EXT } from "@formbox/renderer/utilities.ts";
import en from "@formbox/strings/en";

import type {
  QuestionnaireOf,
  QuestionnaireResponseOf,
  RenderMode,
} from "@formbox/renderer";

type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;

function usageMode(valueCode: string) {
  return {
    url: EXT.USAGE_MODE,
    valueCode,
  };
}

function createForm(
  questionnaire: Questionnaire,
  response: QuestionnaireResponse | undefined,
  mode: RenderMode,
) {
  return new FormStore(
    en,
    "r5",
    "form",
    questionnaire,
    response,
    undefined,
    undefined,
    undefined,
    mode,
  );
}

describe("usageMode", () => {
  it("renders capture-only item only in capture mode", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "capture-item",
          text: "Capture item",
          type: "string",
          extension: [usageMode("capture")],
        },
      ],
    };

    const captureForm = createForm(questionnaire, undefined, "capture");
    const captureNode = captureForm.scope.lookupNode("capture-item");
    assertQuestionNode(captureNode);
    expect(captureNode.hidden).toBe(false);

    const displayForm = createForm(questionnaire, undefined, "display");
    const displayNode = displayForm.scope.lookupNode("capture-item");
    assertQuestionNode(displayNode);
    expect(displayNode.hidden).toBe(true);
  });

  it("renders display-only item only in display mode", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "display-item",
          text: "Display item",
          type: "string",
          extension: [usageMode("display")],
        },
      ],
    };

    const captureForm = createForm(questionnaire, undefined, "capture");
    const captureNode = captureForm.scope.lookupNode("display-item");
    assertQuestionNode(captureNode);
    expect(captureNode.hidden).toBe(true);

    const displayForm = createForm(questionnaire, undefined, "display");
    const displayNode = displayForm.scope.lookupNode("display-item");
    assertQuestionNode(displayNode);
    expect(displayNode.hidden).toBe(false);
  });

  it("renders display-non-empty only in display mode when answered", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "conditional-display",
          text: "Conditional display",
          type: "string",
          extension: [usageMode("display-non-empty")],
        },
      ],
    };

    const emptyDisplayForm = createForm(questionnaire, undefined, "display");
    const emptyDisplayNode = emptyDisplayForm.scope.lookupNode(
      "conditional-display",
    );
    assertQuestionNode(emptyDisplayNode);
    expect(emptyDisplayNode.hidden).toBe(true);

    const answeredResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "completed",
      questionnaire: "#usage-mode",
      item: [
        {
          linkId: "conditional-display",
          answer: [{ valueString: "filled" }],
        },
      ],
    };
    const answeredDisplayForm = createForm(
      questionnaire,
      answeredResponse,
      "display",
    );
    const answeredDisplayNode = answeredDisplayForm.scope.lookupNode(
      "conditional-display",
    );
    assertQuestionNode(answeredDisplayNode);
    expect(answeredDisplayNode.hidden).toBe(false);
  });

  it("uses child answers to evaluate display-non-empty on groups", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "section",
          text: "Section",
          type: "group",
          extension: [usageMode("display-non-empty")],
          item: [
            {
              linkId: "note",
              text: "Note",
              type: "string",
            },
          ],
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "completed",
      questionnaire: "#usage-mode",
      item: [
        {
          linkId: "section",
          item: [
            {
              linkId: "note",
              answer: [{ valueString: "present" }],
            },
          ],
        },
      ],
    };

    const form = createForm(questionnaire, response, "display");
    const section = form.scope.lookupNode("section");
    assertGroupNode(section);
    expect(section.hidden).toBe(false);
  });

  it("applies capture-display-non-empty across modes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "hybrid-item",
          text: "Hybrid item",
          type: "string",
          extension: [usageMode("capture-display-non-empty")],
        },
      ],
    };

    const captureForm = createForm(questionnaire, undefined, "capture");
    const captureNode = captureForm.scope.lookupNode("hybrid-item");
    assertQuestionNode(captureNode);
    expect(captureNode.hidden).toBe(false);

    const emptyDisplayForm = createForm(questionnaire, undefined, "display");
    const emptyDisplayNode = emptyDisplayForm.scope.lookupNode("hybrid-item");
    assertQuestionNode(emptyDisplayNode);
    expect(emptyDisplayNode.hidden).toBe(true);

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "completed",
      questionnaire: "#usage-mode",
      item: [
        {
          linkId: "hybrid-item",
          answer: [{ valueString: "visible" }],
        },
      ],
    };
    const answeredDisplayForm = createForm(questionnaire, response, "display");
    const answeredDisplayNode =
      answeredDisplayForm.scope.lookupNode("hybrid-item");
    assertQuestionNode(answeredDisplayNode);
    expect(answeredDisplayNode.hidden).toBe(false);
  });

  it("keeps capture-display visible in both capture and display modes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "always-visible",
          text: "Always visible",
          type: "string",
          extension: [usageMode("capture-display")],
        },
      ],
    };

    const captureForm = createForm(questionnaire, undefined, "capture");
    const captureNode = captureForm.scope.lookupNode("always-visible");
    assertQuestionNode(captureNode);
    expect(captureNode.hidden).toBe(false);

    const displayForm = createForm(questionnaire, undefined, "display");
    const displayNode = displayForm.scope.lookupNode("always-visible");
    assertQuestionNode(displayNode);
    expect(displayNode.hidden).toBe(false);
  });

  it("ignores unknown usage-mode values", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "bad-item",
          text: "Bad mode",
          type: "string",
          extension: [usageMode("invalid-mode")],
        },
      ],
    };

    const form = createForm(questionnaire, undefined, "capture");
    const node = form.scope.lookupNode("bad-item");
    assertQuestionNode(node);
    expect(node.hidden).toBe(false);
    expect(form.issues).toHaveLength(0);
  });

  it("infers display mode from completed questionnaire response status", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "display-only",
          text: "Display only",
          type: "string",
          extension: [usageMode("display")],
        },
      ],
    };
    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "completed",
      questionnaire: "#usage-mode",
      item: [
        {
          linkId: "display-only",
          answer: [{ valueString: "ready" }],
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      response,
      undefined,
      undefined,
      undefined,
    );
    const node = form.scope.lookupNode("display-only");
    assertQuestionNode(node);
    expect(form.mode).toBe("display");
    expect(node.hidden).toBe(false);
  });
});
