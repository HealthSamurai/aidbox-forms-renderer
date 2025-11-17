import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../form-store.ts";
import {
  makeCalculatedExpression,
  makeVariable,
} from "./expression-fixtures.ts";
import { isRepeatingGroupWrapper } from "../repeating-group-wrapper.ts";
import { isNonRepeatingGroupNode } from "../non-repeating-group-store.ts";
import { isQuestionNode } from "../question-store.ts";

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

    if (!mirror || !isQuestionNode(mirror)) {
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
      !isQuestionNode(mirror) ||
      !isQuestionNode(childMirror) ||
      !isQuestionNode(parentFromChild)
    ) {
      throw new Error("Expected question stores");
    }

    expect(mirror.answers[0]?.value).toBe("parent");
    expect(childMirror.answers[0]?.value).toBe("child");
    expect(parentFromChild.answers[0]?.value).toBe("parent");
  });

  it("scopes group variables per instance and reacts to changes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "household",
          type: "group",
          repeats: true,
          extension: [
            makeVariable(
              "capturedName",
              "%context.item.where(linkId='name').answer.valueString.last()",
            ),
          ],
          item: [
            {
              linkId: "name",
              type: "string",
            },
            {
              linkId: "echo",
              type: "string",
              readOnly: true,
              extension: [makeCalculatedExpression(undefined, "%capturedName")],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const household = form.scope.lookupNode("household");

    if (!household || !isRepeatingGroupWrapper(household)) {
      throw new Error("Expected repeating group store");
    }

    household.addInstance();
    household.addInstance();

    const [firstInstance, secondInstance] = household.nodes;

    if (!firstInstance || !secondInstance) {
      throw new Error("Expected initial repeating group instances");
    }

    const findQuestion = (linkId: string, instanceIndex: number) => {
      const instance =
        instanceIndex === 0
          ? firstInstance
          : instanceIndex === 1
            ? secondInstance
            : household.nodes[instanceIndex];

      if (!instance) {
        throw new Error(`Missing instance #${instanceIndex}`);
      }

      const child = instance.nodes.find((item) => item.linkId === linkId);
      if (!child || !isQuestionNode(child)) {
        throw new Error(`Expected question store for ${linkId}`);
      }

      return child;
    };

    const firstName = findQuestion("name", 0);
    const firstEcho = findQuestion("echo", 0);
    const secondName = findQuestion("name", 1);
    const secondEcho = findQuestion("echo", 1);

    expect(firstEcho.answers).toHaveLength(0);
    expect(secondEcho.answers).toHaveLength(0);

    firstName.setAnswer(0, "Alice");
    secondName.setAnswer(0, "Bianca");

    expect(firstEcho.answers[0]?.value).toBe("Alice");
    expect(secondEcho.answers[0]?.value).toBe("Bianca");

    household.addInstance();

    const thirdInstance = household.nodes[2];

    if (!thirdInstance) {
      throw new Error("Expected third repeating group instance");
    }

    const thirdName = findQuestion("name", 2);
    const thirdEcho = findQuestion("echo", 2);

    expect(thirdEcho.answers).toHaveLength(0);

    thirdName.setAnswer(0, "Clara");

    expect(firstEcho.answers[0]?.value).toBe("Alice");
    expect(secondEcho.answers[0]?.value).toBe("Bianca");
    expect(thirdEcho.answers[0]?.value).toBe("Clara");

    firstName.setAnswer(0, "Alicia");

    expect(firstEcho.answers[0]?.value).toBe("Alicia");
    expect(secondEcho.answers[0]?.value).toBe("Bianca");
    expect(thirdEcho.answers[0]?.value).toBe("Clara");
  });

  it("computes group-scoped aggregates per instance", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "household",
          type: "group",
          repeats: true,
          extension: [
            makeVariable(
              "residentCount",
              "%context.item.where(linkId='residents').answer.valueString.count()",
            ),
          ],
          item: [
            {
              linkId: "residents",
              type: "string",
              repeats: true,
            },
            {
              linkId: "resident-count",
              type: "integer",
              readOnly: true,
              extension: [
                makeCalculatedExpression(undefined, "%residentCount"),
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const household = form.scope.lookupNode("household");

    if (!household || !isRepeatingGroupWrapper(household)) {
      throw new Error("Expected repeating group store");
    }

    household.addInstance();
    household.addInstance();

    const [firstInstance, secondInstance] = household.nodes;

    if (!firstInstance || !secondInstance) {
      throw new Error("Expected two repeating group instances");
    }

    const findQuestion = (instanceIndex: number, linkId: string) => {
      const instance = household.nodes[instanceIndex];
      if (!instance) {
        throw new Error(`Missing instance #${instanceIndex}`);
      }
      const child = instance.nodes.find((item) => item.linkId === linkId);
      if (!child || !isQuestionNode(child)) {
        throw new Error(`Expected question store for ${linkId}`);
      }
      return child;
    };

    const firstResidents = findQuestion(0, "residents");
    const secondResidents = findQuestion(1, "residents");
    const firstCount = findQuestion(0, "resident-count");
    const secondCount = findQuestion(1, "resident-count");

    firstResidents.addAnswer();
    firstResidents.setAnswer(0, "Alice");
    firstResidents.addAnswer();
    firstResidents.setAnswer(1, "Bob");

    secondResidents.addAnswer();
    secondResidents.setAnswer(0, "Charlie");

    const firstResidentCountSlot =
      firstInstance.scope.lookupExpression("residentCount");
    const secondResidentCountSlot =
      secondInstance.scope.lookupExpression("residentCount");

    if (!firstResidentCountSlot || !secondResidentCountSlot) {
      throw new Error("Expected residentCount variables for instances");
    }

    expect(firstResidents.answers.map((answer) => answer.value)).toEqual([
      "Alice",
      "Bob",
    ]);

    expect(firstResidentCountSlot.value).toEqual([2]);
    expect(secondResidentCountSlot.value).toEqual([1]);

    expect(firstCount.answers[0]?.value).toBe(2);
    expect(secondCount.answers[0]?.value).toBe(1);

    firstResidents.removeAnswer(1);

    expect(firstCount.answers[0]?.value).toBe(1);
    expect(secondCount.answers[0]?.value).toBe(1);
    expect(firstResidentCountSlot.value).toEqual([1]);
    expect(secondResidentCountSlot.value).toEqual([1]);
  });

  it("exposes group variables to nested repeating groups per instance", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "families",
          type: "group",
          repeats: true,
          extension: [
            makeVariable(
              "familyLabel",
              "%context.item.where(linkId='family-name').answer.valueString.last()",
            ),
          ],
          item: [
            {
              linkId: "family-name",
              type: "string",
            },
            {
              linkId: "members",
              type: "group",
              repeats: true,
              item: [
                {
                  linkId: "member-name",
                  type: "string",
                },
                {
                  linkId: "family-tag",
                  type: "string",
                  readOnly: true,
                  extension: [
                    makeCalculatedExpression(undefined, "%familyLabel"),
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const families = form.scope.lookupNode("families");

    if (!families || !isRepeatingGroupWrapper(families)) {
      throw new Error("Expected repeating families group");
    }

    families.addInstance();
    families.addInstance();

    const [firstFamily, secondFamily] = families.nodes;

    if (!firstFamily || !secondFamily) {
      throw new Error("Expected repeating family instances");
    }

    const findQuestion = (instanceIndex: number, linkId: string) => {
      const instance = families.nodes[instanceIndex];
      if (!instance) {
        throw new Error(`Missing family instance #${instanceIndex}`);
      }
      const child = instance.nodes.find((item) => item.linkId === linkId);
      if (!child || !isQuestionNode(child)) {
        throw new Error(`Expected question store for ${linkId}`);
      }
      return child;
    };

    const findRepeatingGroup = (instanceIndex: number, linkId: string) => {
      const instance = families.nodes[instanceIndex];
      if (!instance) {
        throw new Error(`Missing family instance #${instanceIndex}`);
      }
      const child = instance.nodes.find((item) => item.linkId === linkId);
      if (!child || !isRepeatingGroupWrapper(child)) {
        throw new Error(`Expected repeating group store for ${linkId}`);
      }
      return child;
    };

    const firstName = findQuestion(0, "family-name");
    const secondName = findQuestion(1, "family-name");

    firstName.setAnswer(0, "Smith");
    secondName.setAnswer(0, "Johnson");

    const firstMembers = findRepeatingGroup(0, "members");
    const secondMembers = findRepeatingGroup(1, "members");

    firstMembers.addInstance();
    secondMembers.addInstance();

    const firstMemberInstance = firstMembers.nodes[0];
    const secondMemberInstance = secondMembers.nodes[0];

    if (!firstMemberInstance || !secondMemberInstance) {
      throw new Error("Expected member instances");
    }

    const findMemberQuestion = (
      memberInstanceIndex: number,
      familyIndex: number,
      linkId: string,
    ) => {
      const members = familyIndex === 0 ? firstMembers : secondMembers;
      const memberInstance = members.nodes[memberInstanceIndex];
      if (!memberInstance) {
        throw new Error(
          `Missing member instance #${memberInstanceIndex} for family #${familyIndex}`,
        );
      }
      const child = memberInstance.nodes.find((item) => item.linkId === linkId);
      if (!child || !isQuestionNode(child)) {
        throw new Error(`Expected question store for ${linkId}`);
      }
      return child;
    };

    const firstMemberName = findMemberQuestion(0, 0, "member-name");
    const firstFamilyTag = findMemberQuestion(0, 0, "family-tag");
    const secondMemberName = findMemberQuestion(0, 1, "member-name");
    const secondFamilyTag = findMemberQuestion(0, 1, "family-tag");

    firstMemberName.setAnswer(0, "Alice");
    secondMemberName.setAnswer(0, "Brandon");

    expect(firstFamilyTag.answers[0]?.value).toBe("Smith");
    expect(secondFamilyTag.answers[0]?.value).toBe("Johnson");

    firstName.setAnswer(0, "Smythe");

    expect(firstFamilyTag.answers[0]?.value).toBe("Smythe");
    expect(secondFamilyTag.answers[0]?.value).toBe("Johnson");
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

    if (!addresses || !isRepeatingGroupWrapper(addresses)) {
      throw new Error("Expected repeating group");
    }

    const firstInstance = addresses.nodes[0];
    const secondInstance = addresses.nodes[1];

    if (!firstInstance || !secondInstance) {
      throw new Error("Expected repeating group instances");
    }

    const firstStreet = firstInstance.nodes.find(
      (child) => child.linkId === "street",
    );
    const secondStreet = secondInstance.nodes.find(
      (child) => child.linkId === "street",
    );

    if (!isQuestionNode(firstStreet) || !isQuestionNode(secondStreet)) {
      throw new Error("Expected street questions");
    }

    const firstCopy = firstStreet.answers[0]?.nodes.find(
      (child) => child.linkId === "street-copy",
    );
    const secondCopy = secondStreet.answers[0]?.nodes.find(
      (child) => child.linkId === "street-copy",
    );

    if (
      !firstCopy ||
      !secondCopy ||
      !isQuestionNode(firstCopy) ||
      !isQuestionNode(secondCopy)
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

    if (!aliases || !isQuestionNode(aliases)) {
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

    if (!addresses || !isRepeatingGroupWrapper(addresses)) {
      throw new Error("Expected repeating group");
    }

    expect(addresses.nodes.length).toBe(2);

    const [firstInstance, secondInstance] = addresses.nodes;

    const firstResidents = firstInstance?.nodes.find(
      (child) => child.linkId === "residents",
    );
    const secondResidents = secondInstance?.nodes.find(
      (child) => child.linkId === "residents",
    );

    if (
      !firstResidents ||
      !secondResidents ||
      !isQuestionNode(firstResidents) ||
      !isQuestionNode(secondResidents)
    ) {
      throw new Error("Expected repeating resident questions");
    }

    const firstCopy0 = firstResidents.answers[0]?.nodes.find(
      (child) => child.linkId === "resident-copy",
    );
    const firstCopy1 = firstResidents.answers[1]?.nodes.find(
      (child) => child.linkId === "resident-copy",
    );
    const secondCopy0 = secondResidents.answers[0]?.nodes.find(
      (child) => child.linkId === "resident-copy",
    );
    const secondCopy1 = secondResidents.answers[1]?.nodes.find(
      (child) => child.linkId === "resident-copy",
    );

    if (
      !firstCopy0 ||
      !firstCopy1 ||
      !secondCopy0 ||
      !secondCopy1 ||
      !isQuestionNode(firstCopy0) ||
      !isQuestionNode(firstCopy1) ||
      !isQuestionNode(secondCopy0) ||
      !isQuestionNode(secondCopy1)
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

    if (!group || !isNonRepeatingGroupNode(group)) {
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

    if (!mystery || !isQuestionNode(mystery)) {
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

    if (!isQuestionNode(outerMirror) || !isQuestionNode(innerMirror)) {
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

    if (!unsupported || !isNonRepeatingGroupNode(unsupported)) {
      throw new Error("Expected group store");
    }

    const slot = unsupported.scope.lookupExpression("unsupportedVar");
    expect(slot).toBeDefined();
    if (!slot) return;
    void slot.value;
    expect(slot.error?.diagnostics).toContain("Failed to evaluate variable");
    expect(slot.error?.diagnostics).toContain(
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

    if (!runtime || !isQuestionNode(runtime)) {
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

    if (!cycle || !isNonRepeatingGroupNode(cycle)) {
      throw new Error("Expected group store");
    }

    const scopedCycle = cycle;
    const first = scopedCycle.scope.lookupExpression("alphaVar");
    const second = scopedCycle.scope.lookupExpression("betaVar");

    if (!first || !second) {
      throw new Error("Expected variable slots");
    }
    void first.value;
    void second.value;

    expect(first.error).toBeTruthy();
    expect(first.error?.diagnostics).toContain("Failed to evaluate variable");
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

    if (!group || !isNonRepeatingGroupNode(group)) {
      throw new Error("Expected group store");
    }

    const scopedGroup = group;
    const alpha = scopedGroup.scope.lookupExpression("alphaVar");
    const beta = scopedGroup.scope.lookupExpression("betaVar");
    const gamma = scopedGroup.scope.lookupExpression("gammaVar");

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

    if (!mirror || !isQuestionNode(mirror)) {
      throw new Error("Expected mirror question");
    }

    expect(mirror.answers[0]?.value).toBeNull();
  });
});
