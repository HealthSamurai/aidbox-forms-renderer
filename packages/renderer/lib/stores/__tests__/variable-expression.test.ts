import { describe, expect, it } from "vitest";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../form/form-store.ts";
import {
  makeCalculatedExpression,
  makeVariable,
} from "./expression-fixtures.ts";
import { assertGroupWrapper } from "../nodes/groups/group-wrapper.ts";
import { assertGroupNode } from "../nodes/groups/group-store.ts";
import { assertQuestionNode } from "../nodes/questions/question-store.ts";
import { assertDefined } from "../../utils.ts";

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
    assertDefined(rootVariable);

    expect(rootVariable.value).toEqual(["root-scope"]);

    const mirror = form.scope.lookupNode("mirror");
    assertQuestionNode(mirror);

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
    assertQuestionNode(mirror);
    const childMirror = form.scope.lookupNode("child-mirror");
    assertQuestionNode(childMirror);
    const parentFromChild = form.scope.lookupNode("parent-from-child");
    assertQuestionNode(parentFromChild);

    expect(mirror.answers[0]?.value).toBe("parent");
    expect(childMirror.answers[0]?.value).toBe("child");
    expect(parentFromChild.answers[0]?.value).toBe("parent");
  });

  it("scopes group variables per node and reacts to changes", () => {
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
    assertGroupWrapper(household);

    household.addNode();
    household.addNode();

    const [firstNode, secondNode] = household.nodes;

    assertDefined(firstNode);
    assertDefined(secondNode);

    const findQuestion = (linkId: string, nodeIndex: number) => {
      const node =
        nodeIndex === 0
          ? firstNode
          : nodeIndex === 1
            ? secondNode
            : household.nodes[nodeIndex];

      const resolvedNode = node;
      assertDefined(resolvedNode);

      const child = resolvedNode.nodes.find((item) => item.linkId === linkId);
      assertQuestionNode(child);

      return child;
    };

    const firstName = findQuestion("name", 0);
    const firstEcho = findQuestion("echo", 0);
    const secondName = findQuestion("name", 1);
    const secondEcho = findQuestion("echo", 1);

    expect(firstEcho.answers).toHaveLength(1);
    expect(firstEcho.answers[0]?.value).toBeNull();
    expect(secondEcho.answers).toHaveLength(1);
    expect(secondEcho.answers[0]?.value).toBeNull();

    const firstNameAnswer0 = firstName.answers[0];
    assertDefined(firstNameAnswer0);
    firstNameAnswer0.setValueByUser("Alice");
    const secondNameAnswer0 = secondName.answers[0];
    assertDefined(secondNameAnswer0);
    secondNameAnswer0.setValueByUser("Bianca");

    expect(firstEcho.answers[0]?.value).toBe("Alice");
    expect(secondEcho.answers[0]?.value).toBe("Bianca");

    household.addNode();

    const thirdNode = household.nodes[2];
    assertDefined(thirdNode);

    const thirdName = findQuestion("name", 2);
    const thirdEcho = findQuestion("echo", 2);

    expect(thirdEcho.answers).toHaveLength(1);
    expect(thirdEcho.answers[0]?.value).toBeNull();

    const thirdNameAnswer0 = thirdName.answers[0];
    assertDefined(thirdNameAnswer0);
    thirdNameAnswer0.setValueByUser("Clara");

    expect(firstEcho.answers[0]?.value).toBe("Alice");
    expect(secondEcho.answers[0]?.value).toBe("Bianca");
    expect(thirdEcho.answers[0]?.value).toBe("Clara");

    const updatedFirstAnswer0 = firstName.answers[0];
    assertDefined(updatedFirstAnswer0);
    updatedFirstAnswer0.setValueByUser("Alicia");

    expect(firstEcho.answers[0]?.value).toBe("Alicia");
    expect(secondEcho.answers[0]?.value).toBe("Bianca");
    expect(thirdEcho.answers[0]?.value).toBe("Clara");
  });

  it("computes group-scoped aggregates per node", () => {
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
    assertGroupWrapper(household);

    household.addNode();
    household.addNode();

    const [firstNode, secondNode] = household.nodes;

    assertDefined(firstNode);
    assertDefined(secondNode);

    const findQuestion = (nodeIndex: number, linkId: string) => {
      const node = household.nodes[nodeIndex];
      assertDefined(node);
      const child = node.nodes.find((item) => item.linkId === linkId);
      assertQuestionNode(child);
      return child;
    };

    const firstResidents = findQuestion(0, "residents");
    const secondResidents = findQuestion(1, "residents");
    const firstCount = findQuestion(0, "resident-count");
    const secondCount = findQuestion(1, "resident-count");

    firstResidents.addAnswer();
    const firstResidentsAnswer0 = firstResidents.answers[0];
    assertDefined(firstResidentsAnswer0);
    firstResidentsAnswer0.setValueByUser("Alice");
    firstResidents.addAnswer();
    firstResidents.answers[1]!.setValueByUser("Bob");

    secondResidents.addAnswer();
    const secondResidentsAnswer0 = secondResidents.answers[0];
    assertDefined(secondResidentsAnswer0);
    secondResidentsAnswer0.setValueByUser("Charlie");

    const firstResidentCountSlot =
      firstNode.scope.lookupExpression("residentCount");
    assertDefined(
      firstResidentCountSlot,
      "Expected residentCount variables for nodes",
    );
    const secondResidentCountSlot =
      secondNode.scope.lookupExpression("residentCount");
    assertDefined(
      secondResidentCountSlot,
      "Expected residentCount variables for nodes",
    );

    expect(firstResidents.answers.map((answer) => answer.value)).toEqual([
      "Alice",
      "Bob",
    ]);

    expect(firstResidentCountSlot.value).toEqual([2]);
    expect(secondResidentCountSlot.value).toEqual([1]);

    expect(firstCount.answers[0]?.value).toBe(2);
    expect(secondCount.answers[0]?.value).toBe(1);

    const secondResidentAnswer = firstResidents.answers[1];
    assertDefined(secondResidentAnswer);
    firstResidents.removeAnswer(secondResidentAnswer);

    expect(firstCount.answers[0]?.value).toBe(1);
    expect(secondCount.answers[0]?.value).toBe(1);
    expect(firstResidentCountSlot.value).toEqual([1]);
    expect(secondResidentCountSlot.value).toEqual([1]);
  });

  it("exposes group variables to nested repeating groups per node", () => {
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
    assertGroupWrapper(families);

    families.addNode();
    families.addNode();

    const [firstFamily, secondFamily] = families.nodes;

    assertDefined(firstFamily);
    assertDefined(secondFamily);

    const findQuestion = (nodeIndex: number, linkId: string) => {
      const node = families.nodes[nodeIndex];
      assertDefined(node);
      const child = node.nodes.find((item) => item.linkId === linkId);
      assertQuestionNode(child);
      return child;
    };

    const findGroupWrapper = (nodeIndex: number, linkId: string) => {
      const node = families.nodes[nodeIndex];
      assertDefined(node);
      const child = node.nodes.find((item) => item.linkId === linkId);
      assertGroupWrapper(child);
      return child;
    };

    const firstName = findQuestion(0, "family-name");
    const secondName = findQuestion(1, "family-name");

    const firstFamilyNameAnswer0 = firstName.answers[0];
    assertDefined(firstFamilyNameAnswer0);
    firstFamilyNameAnswer0.setValueByUser("Smith");
    const secondFamilyNameAnswer0 = secondName.answers[0];
    assertDefined(secondFamilyNameAnswer0);
    secondFamilyNameAnswer0.setValueByUser("Johnson");

    const firstMembers = findGroupWrapper(0, "members");
    const secondMembers = findGroupWrapper(1, "members");

    firstMembers.addNode();
    secondMembers.addNode();

    const firstMemberNode = firstMembers.nodes[0];
    assertDefined(firstMemberNode);
    const secondMemberNode = secondMembers.nodes[0];
    assertDefined(secondMemberNode);

    const findMemberQuestion = (
      memberNodeIndex: number,
      familyIndex: number,
      linkId: string,
    ) => {
      const members = familyIndex === 0 ? firstMembers : secondMembers;
      const memberNode = members.nodes[memberNodeIndex];
      assertDefined(memberNode);
      const child = memberNode.nodes.find((item) => item.linkId === linkId);
      assertQuestionNode(child);
      return child;
    };

    const firstMemberName = findMemberQuestion(0, 0, "member-name");
    const firstFamilyTag = findMemberQuestion(0, 0, "family-tag");
    const secondMemberName = findMemberQuestion(0, 1, "member-name");
    const secondFamilyTag = findMemberQuestion(0, 1, "family-tag");

    const firstMemberNameAnswer0 = firstMemberName.answers[0];
    assertDefined(firstMemberNameAnswer0);
    firstMemberNameAnswer0.setValueByUser("Alice");
    const secondMemberNameAnswer0 = secondMemberName.answers[0];
    assertDefined(secondMemberNameAnswer0);
    secondMemberNameAnswer0.setValueByUser("Brandon");

    expect(firstFamilyTag.answers[0]?.value).toBe("Smith");
    expect(secondFamilyTag.answers[0]?.value).toBe("Johnson");

    const latestFirstFamilyNameAnswer0 = firstName.answers[0];
    assertDefined(latestFirstFamilyNameAnswer0);
    latestFirstFamilyNameAnswer0.setValueByUser("Smythe");

    expect(firstFamilyTag.answers[0]?.value).toBe("Smythe");
    expect(secondFamilyTag.answers[0]?.value).toBe("Johnson");
  });

  it("binds variables per repeating group node for descendants", () => {
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
    assertGroupWrapper(addresses);

    const [firstNode, secondNode] = addresses.nodes;

    assertDefined(firstNode);
    assertDefined(secondNode);

    const firstStreet = firstNode.nodes.find(
      (child) => child.linkId === "street",
    );
    assertQuestionNode(firstStreet);
    const secondStreet = secondNode.nodes.find(
      (child) => child.linkId === "street",
    );
    assertQuestionNode(secondStreet);

    const firstCopy = firstStreet.answers[0]?.nodes.find(
      (child) => child.linkId === "street-copy",
    );
    assertQuestionNode(firstCopy);
    const secondCopy = secondStreet.answers[0]?.nodes.find(
      (child) => child.linkId === "street-copy",
    );
    assertQuestionNode(secondCopy);

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
    assertQuestionNode(aliases);

    expect(aliases.repeats).toBe(true);

    const aliasVariable = aliases.scope.lookupExpression("allAliases");
    assertDefined(aliasVariable);

    expect(aliasVariable.value).toEqual(["Alpha", "Beta"]);
  });

  it("isolates variables per repeating group node and repeating question answer", () => {
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
    assertGroupWrapper(addresses);

    expect(addresses.nodes.length).toBe(2);

    const [firstNode, secondNode] = addresses.nodes;

    const firstResidents = firstNode?.nodes.find(
      (child) => child.linkId === "residents",
    );
    assertQuestionNode(firstResidents);
    const secondResidents = secondNode?.nodes.find(
      (child) => child.linkId === "residents",
    );
    assertQuestionNode(secondResidents);

    const firstCopy0 = firstResidents.answers[0]?.nodes.find(
      (child) => child.linkId === "resident-copy",
    );
    assertQuestionNode(firstCopy0);
    const firstCopy1 = firstResidents.answers[1]?.nodes.find(
      (child) => child.linkId === "resident-copy",
    );
    assertQuestionNode(firstCopy1);
    const secondCopy0 = secondResidents.answers[0]?.nodes.find(
      (child) => child.linkId === "resident-copy",
    );
    assertQuestionNode(secondCopy0);
    const secondCopy1 = secondResidents.answers[1]?.nodes.find(
      (child) => child.linkId === "resident-copy",
    );
    assertQuestionNode(secondCopy1);

    const firstCopy0Var = firstCopy0.scope.lookupExpression("residentName");
    assertDefined(firstCopy0Var);
    const firstCopy1Var = firstCopy1.scope.lookupExpression("residentName");
    assertDefined(firstCopy1Var);
    const secondCopy0Var = secondCopy0.scope.lookupExpression("residentName");
    assertDefined(secondCopy0Var);
    const secondCopy1Var = secondCopy1.scope.lookupExpression("residentName");
    assertDefined(secondCopy1Var);

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
    assertGroupNode(group);

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
    assertQuestionNode(mystery);

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
    assertQuestionNode(outerMirror);
    const innerMirror = form.scope.lookupNode("inner-mirror");
    assertQuestionNode(innerMirror);

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
    assertGroupNode(unsupported);

    const slot = unsupported.scope.lookupExpression("unsupportedVar");
    expect(slot).toBeDefined();
    assertDefined(slot);
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
    assertQuestionNode(runtime);

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
    assertGroupNode(cycle);

    const scopedCycle = cycle;
    const first = scopedCycle.scope.lookupExpression("alphaVar");
    assertDefined(first);
    const second = scopedCycle.scope.lookupExpression("betaVar");
    assertDefined(second);
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
    assertGroupNode(group);

    const scopedGroup = group;
    const alpha = scopedGroup.scope.lookupExpression("alphaVar");
    assertDefined(alpha);
    const beta = scopedGroup.scope.lookupExpression("betaVar");
    assertDefined(beta);
    const gamma = scopedGroup.scope.lookupExpression("gammaVar");
    assertDefined(gamma);

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
    assertDefined(slot);

    void slot.value;

    expect(slot.error?.diagnostics).toContain(
      'Failed to evaluate variable "badVar" expression',
    );
    expect(slot.error?.diagnostics).toContain(
      "because the expression has a syntax error",
    );

    const mirror = form.scope.lookupNode("mirror");
    assertQuestionNode(mirror);

    expect(mirror.answers[0]?.value).toBeNull();
  });
});
