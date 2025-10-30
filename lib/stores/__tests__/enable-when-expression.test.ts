import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form-store.ts";
import { isQuestion } from "../../utils.ts";
import {
  makeCalculatedExpression,
  makeEnableExpression,
  makeVariable,
} from "./expression-fixtures.ts";

describe("enableWhenExpression", () => {
  it("toggles enablement using scoped variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [
            makeVariable(
              "controlValue",
              "%context.item.where(linkId='control').answer.valueInteger.last()",
            ),
          ],
          item: [
            {
              linkId: "control",
              text: "Control",
              type: "integer",
            },
            {
              linkId: "dependent",
              text: "Dependent",
              type: "string",
              extension: [makeEnableExpression(undefined, "%controlValue > 5")],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    if (
      !control ||
      !dependent ||
      !isQuestion(control) ||
      !isQuestion(dependent)
    ) {
      throw new Error("Expected question stores");
    }

    expect(dependent.isEnabled).toBe(false);

    control.setAnswer(0, 6);
    expect(dependent.isEnabled).toBe(true);

    control.setAnswer(0, 3);
    expect(dependent.isEnabled).toBe(false);
  });

  it("allows named enableWhen expressions to populate variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [
            makeVariable(
              "controlFlag",
              "%context.item.where(linkId='control').answer.valueBoolean.last()",
            ),
          ],
          item: [
            {
              linkId: "control",
              type: "boolean",
            },
            {
              linkId: "dependent",
              type: "boolean",
              extension: [
                makeEnableExpression("dependentFlag", "%controlFlag"),
              ],
              item: [
                {
                  linkId: "mirror",
                  type: "boolean",
                  extension: [
                    makeCalculatedExpression(undefined, "%dependentFlag"),
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    if (!isQuestion(control) || !isQuestion(dependent)) {
      throw new Error("Expected question stores");
    }

    const mirror = dependent.answers[0]?.children.find(
      (child) => child.linkId === "mirror",
    );

    if (!mirror || !isQuestion(mirror)) {
      throw new Error("Expected descendant mirror question");
    }

    control.setAnswer(0, true);
    expect(mirror.answers[0]?.value).toBe(true);
  });

  it("records issues when enableWhen expression references unknown variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "controlled",
          type: "string",
          extension: [makeEnableExpression(undefined, "%missingFlag")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const controlled = form.scope.lookupNode("controlled");

    if (!controlled || !isQuestion(controlled)) {
      throw new Error("Expected question store");
    }

    expect(controlled.isEnabled).toBe(false);
    const slot = controlled.expressionRegistry.enableWhen;
    expect(slot?.error?.diagnostics).toContain(
      "Failed to evaluate enable-when expression",
    );
    expect(slot?.error?.diagnostics).toContain(
      "because it references unavailable data",
    );
  });

  it("records issues when enableWhen expression has syntax errors", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "controlled",
          type: "string",
          extension: [makeEnableExpression(undefined, "1 +")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const controlled = form.scope.lookupNode("controlled");

    if (!controlled || !isQuestion(controlled)) {
      throw new Error("Expected question store");
    }

    expect(controlled.isEnabled).toBe(false);
    const slot = controlled.expressionRegistry.enableWhen;
    expect(slot?.error?.diagnostics).toContain(
      "Failed to evaluate enable-when expression",
    );
    expect(slot?.error?.diagnostics).toContain(
      "because the expression has a syntax error",
    );
  });

  it("records issues when enableWhen expression fails at runtime", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "controlled",
          type: "string",
          extension: [makeEnableExpression(undefined, "1.total()")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const controlled = form.scope.lookupNode("controlled");

    if (!controlled || !isQuestion(controlled)) {
      throw new Error("Expected question store");
    }

    expect(controlled.isEnabled).toBe(false);
    const slot = controlled.expressionRegistry.enableWhen;
    expect(slot?.error?.diagnostics).toContain(
      "Failed to evaluate enable-when expression",
    );
    expect(slot?.error?.diagnostics).toContain(
      "because it calls an unsupported function",
    );
  });

  it("records issues when multiple enableWhen expressions are declared", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "controlled",
          type: "string",
          extension: [
            makeEnableExpression(undefined, "true"),
            makeEnableExpression(undefined, "false"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const controlled = form.scope.lookupNode("controlled");

    if (!controlled || !isQuestion(controlled)) {
      throw new Error("Expected question store");
    }

    expect(
      controlled.issues.some((issue) =>
        issue.diagnostics?.includes(
          "Only one enable-when extension is supported per item.",
        ),
      ),
    ).toBe(true);
    expect(controlled.isEnabled).toBe(true);
  });

  it("honors enableWhen expressions defined via modifierExtension", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [
            makeVariable(
              "controlFlag",
              "%context.item.where(linkId='control').answer.valueBoolean.last()",
            ),
          ],
          item: [
            {
              linkId: "control",
              type: "boolean",
            },
            {
              linkId: "dependent",
              type: "boolean",
              modifierExtension: [
                makeEnableExpression(undefined, "%controlFlag"),
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const control = form.scope.lookupNode("control");
    const dependent = form.scope.lookupNode("dependent");

    if (!isQuestion(control) || !isQuestion(dependent)) {
      throw new Error("Expected question stores");
    }

    expect(dependent.isEnabled).toBe(false);
    control.setAnswer(0, true);
    expect(dependent.isEnabled).toBe(true);
  });
});
