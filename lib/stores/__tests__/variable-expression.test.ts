import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../form-store.ts";
import { isQuestion, isRepeatingGroup } from "../../utils.ts";
import {
  makeCalculatedExpression,
  makeVariable,
} from "./expression-fixtures.ts";

describe("variable expressions", () => {
  it("records questionnaire-level variable name collisions on the form", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [
        makeVariable("duplicate", "'first'"),
        makeVariable("duplicate", "'second'"),
      ],
    };

    const form = new FormStore(questionnaire);

    const collision = form.issues.find((issue) => {
      const diagnostics = issue.diagnostics?.toLowerCase();
      return (
        issue.code === "invalid" &&
        diagnostics &&
        diagnostics.includes("duplicate")
      );
    });

    expect(collision).toBeTruthy();
  });

  it("evaluates questionnaire-level variables and exposes them to descendants", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [makeVariable("globalValue", "'root-scope'")],
      item: [
        {
          linkId: "mirror",
          type: "string",
          extension: [makeCalculatedExpression(undefined, "%globalValue")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const rootVariable = form.scope.lookupExpression("globalValue");

    if (!rootVariable) {
      throw new Error("Expected form-level variable slot");
    }

    expect(rootVariable.value).toEqual(["root-scope"]);

    const mirror = form.scope.lookupNode("mirror");

    if (!mirror || !isQuestion(mirror)) {
      throw new Error("Expected question store");
    }

    expect(mirror.answers[0]?.value).toBe("root-scope");
  });

  it("honors variable shadowing", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [makeVariable("parentValue", "'parent'")],
          item: [
            {
              linkId: "mirror",
              type: "string",
              extension: [makeCalculatedExpression(undefined, "%parentValue")],
            },
            {
              linkId: "child-group",
              type: "group",
              extension: [makeVariable("childValue", "'child'")],
              item: [
                {
                  linkId: "child-mirror",
                  type: "string",
                  extension: [
                    makeCalculatedExpression(undefined, "%childValue"),
                  ],
                },
                {
                  linkId: "parent-from-child",
                  type: "string",
                  extension: [
                    makeCalculatedExpression(undefined, "%parentValue"),
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const mirror = form.scope.lookupNode("mirror");
    const childMirror = form.scope.lookupNode("child-mirror");
    const parentFromChild = form.scope.lookupNode("parent-from-child");

    if (
      !isQuestion(mirror) ||
      !isQuestion(childMirror) ||
      !isQuestion(parentFromChild)
    ) {
      throw new Error("Expected question stores");
    }

    expect(mirror.answers[0]?.value).toBe("parent");
    expect(childMirror.answers[0]?.value).toBe("child");
    expect(parentFromChild.answers[0]?.value).toBe("parent");
  });

  it("binds variables per repeating group instance for descendants", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "addresses",
          type: "group",
          repeats: true,
          item: [
            {
              linkId: "street",
              type: "string",
              extension: [
                makeVariable("streetValue", "%context.answer.valueString"),
              ],
              item: [
                {
                  linkId: "street-copy",
                  type: "string",
                  extension: [
                    makeCalculatedExpression(undefined, "%streetValue"),
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/addresses",
      status: "completed",
      item: [
        {
          linkId: "addresses",
          item: [{ linkId: "street", answer: [{ valueString: "Alpha" }] }],
        },
        {
          linkId: "addresses",
          item: [{ linkId: "street", answer: [{ valueString: "Beta" }] }],
        },
      ],
    };

    const form = new FormStore(questionnaire, response);
    const addresses = form.scope.lookupNode("addresses");

    if (!addresses || !isRepeatingGroup(addresses)) {
      throw new Error("Expected repeating group");
    }

    const firstStreet = addresses.instances[0].children.find(
      (child) => child.linkId === "street",
    );
    const secondStreet = addresses.instances[1].children.find(
      (child) => child.linkId === "street",
    );

    if (!isQuestion(firstStreet) || !isQuestion(secondStreet)) {
      throw new Error("Expected street questions");
    }

    const firstCopy = firstStreet.answers[0]?.children.find(
      (child) => child.linkId === "street-copy",
    );
    const secondCopy = secondStreet.answers[0]?.children.find(
      (child) => child.linkId === "street-copy",
    );

    if (
      !firstCopy ||
      !secondCopy ||
      !isQuestion(firstCopy) ||
      !isQuestion(secondCopy)
    ) {
      throw new Error("Expected descendant copy questions");
    }

    expect(firstCopy.answers[0]?.value).toBe("Alpha");
    expect(secondCopy.answers[0]?.value).toBe("Beta");
  });

  it("evaluates repeating question variables once for the item", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "aliases",
          type: "string",
          repeats: true,
          extension: [
            makeVariable("allAliases", "%context.answer.valueString"),
          ],
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/aliases",
      status: "completed",
      item: [
        {
          linkId: "aliases",
          answer: [{ valueString: "Alpha" }, { valueString: "Beta" }],
        },
      ],
    };

    const form = new FormStore(questionnaire, response);
    const aliases = form.scope.lookupNode("aliases");

    if (!aliases || !isQuestion(aliases)) {
      throw new Error("Expected repeating question");
    }

    expect(aliases.repeats).toBe(true);

    const aliasVariable = aliases.scope.lookupExpression("allAliases");

    if (!aliasVariable) {
      throw new Error("Expected allAliases variable slot");
    }

    expect(aliasVariable.value).toEqual(["Alpha", "Beta"]);
  });

  it("isolates variables per repeating group instance and repeating question answer", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "addresses",
          type: "group",
          repeats: true,
          item: [
            {
              linkId: "residents",
              type: "string",
              repeats: true,
              item: [
                {
                  linkId: "resident-copy",
                  type: "string",
                  extension: [
                    makeVariable("residentName", "%context.answer.valueString"),
                    makeCalculatedExpression(undefined, "%residentName"),
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/addresses",
      status: "completed",
      item: [
        {
          linkId: "addresses",
          item: [
            {
              linkId: "residents",
              answer: [
                {
                  valueString: "Alpha-0",
                  item: [
                    {
                      linkId: "resident-copy",
                      answer: [{ valueString: "Alpha-0" }],
                    },
                  ],
                },
                {
                  valueString: "Alpha-1",
                  item: [
                    {
                      linkId: "resident-copy",
                      answer: [{ valueString: "Alpha-1" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          linkId: "addresses",
          item: [
            {
              linkId: "residents",
              answer: [
                {
                  valueString: "Beta-0",
                  item: [
                    {
                      linkId: "resident-copy",
                      answer: [{ valueString: "Beta-0" }],
                    },
                  ],
                },
                {
                  valueString: "Beta-1",
                  item: [
                    {
                      linkId: "resident-copy",
                      answer: [{ valueString: "Beta-1" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire, response);
    const addresses = form.scope.lookupNode("addresses");

    if (!addresses || !isRepeatingGroup(addresses)) {
      throw new Error("Expected repeating group");
    }

    expect(addresses.instances.length).toBe(2);

    const [firstInstance, secondInstance] = addresses.instances;

    const firstResidents = firstInstance.children.find(
      (child) => child.linkId === "residents",
    );
    const secondResidents = secondInstance.children.find(
      (child) => child.linkId === "residents",
    );

    if (
      !firstResidents ||
      !secondResidents ||
      !isQuestion(firstResidents) ||
      !isQuestion(secondResidents)
    ) {
      throw new Error("Expected repeating resident questions");
    }

    const firstCopy0 = firstResidents.answers[0]?.children.find(
      (child) => child.linkId === "resident-copy",
    );
    const firstCopy1 = firstResidents.answers[1]?.children.find(
      (child) => child.linkId === "resident-copy",
    );
    const secondCopy0 = secondResidents.answers[0]?.children.find(
      (child) => child.linkId === "resident-copy",
    );
    const secondCopy1 = secondResidents.answers[1]?.children.find(
      (child) => child.linkId === "resident-copy",
    );

    if (
      !firstCopy0 ||
      !firstCopy1 ||
      !secondCopy0 ||
      !secondCopy1 ||
      !isQuestion(firstCopy0) ||
      !isQuestion(firstCopy1) ||
      !isQuestion(secondCopy0) ||
      !isQuestion(secondCopy1)
    ) {
      throw new Error("Expected resident copy questions");
    }

    const firstCopy0Var = firstCopy0.scope.lookupExpression("residentName");
    const firstCopy1Var = firstCopy1.scope.lookupExpression("residentName");
    const secondCopy0Var = secondCopy0.scope.lookupExpression("residentName");
    const secondCopy1Var = secondCopy1.scope.lookupExpression("residentName");

    if (
      !firstCopy0Var ||
      !firstCopy1Var ||
      !secondCopy0Var ||
      !secondCopy1Var
    ) {
      throw new Error("Expected residentName variables");
    }

    expect(firstCopy0Var).not.toBe(firstCopy1Var);
    expect(firstCopy0Var).not.toBe(secondCopy0Var);
    expect(firstCopy0Var).not.toBe(secondCopy1Var);
    expect(firstCopy1Var).not.toBe(secondCopy0Var);
    expect(firstCopy1Var).not.toBe(secondCopy1Var);
    expect(secondCopy0Var).not.toBe(secondCopy1Var);

    expect(firstCopy0.answers[0]?.value).toBe("Alpha-0");
    expect(firstCopy1.answers[0]?.value).toBe("Alpha-1");
    expect(secondCopy0.answers[0]?.value).toBe("Beta-0");
    expect(secondCopy1.answers[0]?.value).toBe("Beta-1");
  });

  it("reports an issue when a variable name is redeclared in the same scope", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "duplicate-vars",
          type: "group",
          extension: [
            makeVariable("duplicate", "'first'"),
            makeVariable("duplicate", "'second'"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("duplicate-vars");

    if (!group) {
      throw new Error("Expected group store");
    }

    const collisionIssue = group.issues.find(
      (issue) =>
        issue.code === "invalid" &&
        issue.diagnostics?.includes("name collision") &&
        issue.diagnostics?.includes('"duplicate"'),
    );

    expect(collisionIssue).toBeTruthy();
  });

  it("surfaces evaluation errors when expressions reference unknown variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "mystery",
          type: "string",
          extension: [makeCalculatedExpression(undefined, "%missingVariable")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const mystery = form.scope.lookupNode("mystery");

    if (!mystery || !isQuestion(mystery)) {
      throw new Error("Expected question store");
    }

    const missingVarIssue = mystery.issues.find(
      (issue) => issue.code === "invalid",
    );

    expect(missingVarIssue).toBeTruthy();
    expect(missingVarIssue?.diagnostics).toContain(
      "Failed to evaluate calculated expression",
    );
    expect(missingVarIssue?.diagnostics).toContain(
      "because it references unavailable data",
    );
  });

  it("keeps identical variable names isolated across scopes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "root",
          type: "group",
          extension: [makeVariable("shared", "'root'")],
          item: [
            {
              linkId: "outer-mirror",
              type: "string",
              extension: [makeCalculatedExpression(undefined, "%shared")],
            },
            {
              linkId: "inner",
              type: "group",
              extension: [makeVariable("shared", "'child'")],
              item: [
                {
                  linkId: "inner-mirror",
                  type: "string",
                  extension: [makeCalculatedExpression(undefined, "%shared")],
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const outerMirror = form.scope.lookupNode("outer-mirror");
    const innerMirror = form.scope.lookupNode("inner-mirror");

    if (!isQuestion(outerMirror) || !isQuestion(innerMirror)) {
      throw new Error("Expected mirror questions");
    }

    expect(outerMirror.answers[0]?.value).toBe("root");
    expect(innerMirror.answers[0]?.value).toBe("child");
  });

  it("marks expressions using unsupported languages as invalid", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "unsupported",
          type: "group",
          extension: [
            {
              url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-variable",
              valueExpression: {
                name: "unsupportedVar",
                language: "text/cql",
                expression: "true",
              },
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const unsupported = form.scope.lookupNode("unsupported");

    if (!unsupported) {
      throw new Error("Expected group store");
    }

    const slot = unsupported.scope.lookupExpression("unsupportedVar");
    expect(slot).toBeDefined();
    void slot?.value;
    expect(slot?.error?.diagnostics).toContain("Failed to evaluate variable");
    expect(slot?.error?.diagnostics).toContain(
      "due to an unsupported expression language",
    );

    const issue = unsupported.issues.find((entry) => entry.code === "invalid");

    expect(issue).toBeTruthy();
  });

  it("records evaluation errors from runtime failures", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "runtime",
          type: "string",
          extension: [makeCalculatedExpression(undefined, "'abc'.what()")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const runtime = form.scope.lookupNode("runtime");

    if (!runtime || !isQuestion(runtime)) {
      throw new Error("Expected question store");
    }

    const issue = runtime.issues.find((entry) => entry.code === "invalid");

    expect(issue).toBeTruthy();
    expect(issue?.diagnostics).toContain(
      "Failed to evaluate calculated expression",
    );
    expect(issue?.diagnostics).toContain(
      "because it calls an unsupported function",
    );
    expect(runtime.answers[0]?.value).toBeNull();
  });

  it("flags circular dependencies between variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "cycle",
          type: "group",
          extension: [
            makeVariable("alphaVar", "%betaVar + 1"),
            makeVariable("betaVar", "%alphaVar + 1"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const cycle = form.scope.lookupNode("cycle");

    if (!cycle) {
      throw new Error("Expected group store");
    }

    const first = cycle.scope.lookupExpression("alphaVar");
    const second = cycle.scope.lookupExpression("betaVar");

    if (!first || !second) {
      throw new Error("Expected variable slots");
    }

    void first.value;
    void second.value;

    expect(first.error?.diagnostics).toContain("Failed to evaluate variable");
    expect(first.error).toBeTruthy();
  });

  it("flags indirect circular dependencies between variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "indirect-cycle",
          type: "group",
          extension: [
            makeVariable("alphaVar", "%betaVar"),
            makeVariable("betaVar", "%gammaVar"),
            makeVariable("gammaVar", "%alphaVar"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("indirect-cycle");

    if (!group) {
      throw new Error("Expected group store");
    }

    const alpha = group.scope.lookupExpression("alphaVar");
    const beta = group.scope.lookupExpression("betaVar");
    const gamma = group.scope.lookupExpression("gammaVar");

    if (!alpha || !beta || !gamma) {
      throw new Error("Expected variable slots");
    }

    void alpha.value;
    void beta.value;
    void gamma.value;

    expect(beta.error?.diagnostics).toContain("Failed to evaluate variable");
    expect(beta.error).toBeTruthy();
  });

  it("captures evaluation errors for questionnaire-level variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [makeVariable("badVar", "1 +")],
      item: [
        {
          linkId: "mirror",
          type: "string",
          extension: [makeCalculatedExpression(undefined, "%badVar")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const slot = form.scope.lookupExpression("badVar");

    if (!slot) {
      throw new Error("Expected form-level variable slot");
    }

    void slot.value;

    expect(slot.error?.diagnostics).toContain(
      'Failed to evaluate variable "badVar" expression',
    );
    expect(slot.error?.diagnostics).toContain(
      "because the expression has a syntax error",
    );

    const mirror = form.scope.lookupNode("mirror");

    if (!mirror || !isQuestion(mirror)) {
      throw new Error("Expected mirror question");
    }

    expect(mirror.answers[0]?.value).toBeNull();
  });
});
