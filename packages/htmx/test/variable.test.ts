import { describe, expect, it } from "vitest";

import { QuestionnaireRenderer } from "../lib/index.ts";
import { defaultTemplates } from "./default-templates.ts";

import type {
  ExtensionOf,
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/fhir";

type Extension = ExtensionOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;
type ResponseItem = NonNullable<QuestionnaireResponse["item"]>[number];
type ResponseAnswer = NonNullable<ResponseItem["answer"]>[number];

const variableUrl = "http://hl7.org/fhir/StructureDefinition/variable";
const calculatedExpressionUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression";

function variable(name: string, expression: string): Extension {
  return expressionExtension(variableUrl, expression, name);
}

function calculatedExpression(expression: string, name?: string): Extension {
  return expressionExtension(calculatedExpressionUrl, expression, name);
}

function expressionExtension(
  url: string,
  expression: string,
  name?: string,
): Extension {
  return {
    url,
    valueExpression: {
      language: "text/fhirpath",
      expression,
      ...(name === undefined ? {} : { name }),
    },
  };
}

async function render(
  questionnaire: Questionnaire,
  questionnaireResponse?: QuestionnaireResponse,
): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: defaultTemplates,
    questionnaire,
    questionnaireResponse,
    fhirVersion: "r5",
  });
  try {
    return await renderer.render();
  } finally {
    renderer.dispose();
  }
}

async function renderResponse(
  questionnaire: Questionnaire,
  questionnaireResponse?: QuestionnaireResponse,
): Promise<QuestionnaireResponse> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: defaultTemplates,
    questionnaire,
    questionnaireResponse,
    fhirVersion: "r5",
  });
  try {
    await renderer.render();
    return renderer.getQuestionnaireResponse();
  } finally {
    renderer.dispose();
  }
}

async function process(
  questionnaire: Questionnaire,
  formData: FormData,
  questionnaireResponse?: QuestionnaireResponse,
): Promise<QuestionnaireResponse> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: defaultTemplates,
    questionnaire,
    questionnaireResponse,
    fhirVersion: "r5",
  });
  try {
    await renderer.process(formData);
    return renderer.getQuestionnaireResponse();
  } finally {
    renderer.dispose();
  }
}

function item(
  items: readonly ResponseItem[] | undefined,
  linkId: string,
): ResponseItem | undefined {
  return items?.find((entry) => entry.linkId === linkId);
}

function items(
  items: readonly ResponseItem[] | undefined,
  linkId: string,
): readonly ResponseItem[] {
  return items?.filter((entry) => entry.linkId === linkId) ?? [];
}

function child(parent: ResponseItem | undefined, linkId: string) {
  return item(parent?.item, linkId);
}

function answerChild(answer: ResponseAnswer | undefined, linkId: string) {
  return item(answer?.item, linkId);
}

describe("@formbox/htmx variable parity", () => {
  it("renders questionnaire-level variable declaration issues", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-root-variable-issues",
      extension: [
        variable("duplicate", "'first'"),
        variable("duplicate", "'second'"),
        variable("qitem", "'reserved'"),
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("Variable name collision for &quot;duplicate&quot;");
    expect(html).toContain("Variable name &quot;qitem&quot; is reserved");
  });

  it("renders questionnaire-level variable evaluation errors", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-root-variable-error",
      extension: [variable("badVar", "1 +")],
      item: [
        {
          linkId: "mirror",
          type: "string",
          extension: [calculatedExpression("%badVar")],
        },
      ],
    };
    const html = await render(questionnaire);
    const response = await renderResponse(questionnaire);

    expect(html).toContain("Failed to evaluate variable");
    expect(html).toContain("because the expression has a syntax error");
    expect(response.item).toBeUndefined();
  });

  it("honors variable shadowing", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-shadowing",
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [variable("parentValue", "'parent'")],
          item: [
            {
              linkId: "mirror",
              type: "string",
              extension: [calculatedExpression("%parentValue")],
            },
            {
              linkId: "child-group",
              type: "group",
              extension: [variable("childValue", "'child'")],
              item: [
                {
                  linkId: "child-mirror",
                  type: "string",
                  extension: [calculatedExpression("%childValue")],
                },
                {
                  linkId: "parent-from-child",
                  type: "string",
                  extension: [calculatedExpression("%parentValue")],
                },
              ],
            },
          ],
        },
      ],
    };
    const response = await renderResponse(questionnaire);
    const group = item(response.item, "group");
    const childGroup = child(group, "child-group");

    expect(child(group, "mirror")?.answer?.[0]?.valueString).toBe("parent");
    expect(child(childGroup, "child-mirror")?.answer?.[0]?.valueString).toBe(
      "child",
    );
    expect(
      child(childGroup, "parent-from-child")?.answer?.[0]?.valueString,
    ).toBe("parent");
  });

  it("scopes group variables per repeated node during full-form posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-repeated-group",
      item: [
        {
          linkId: "household",
          type: "group",
          repeats: true,
          extension: [
            variable(
              "capturedName",
              "%context.item.where(linkId='name').answer.valueString.last()",
            ),
          ],
          item: [
            { linkId: "name", type: "string" },
            {
              linkId: "echo",
              type: "string",
              readOnly: true,
              extension: [calculatedExpression("%capturedName")],
            },
          ],
        },
      ],
    };
    const formData = new FormData();
    formData.set("fb[count][household]", "2");
    formData.set("fb[answer][household][i:0][name][value]", "Alice");
    formData.set("fb[answer][household][i:1][name][value]", "Bianca");
    const response = await process(questionnaire, formData);
    const households = items(response.item, "household");

    expect(child(households[0], "echo")?.answer?.[0]?.valueString).toBe(
      "Alice",
    );
    expect(child(households[1], "echo")?.answer?.[0]?.valueString).toBe(
      "Bianca",
    );
  });

  it("computes group-scoped aggregates per repeated node", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-group-aggregate",
      item: [
        {
          linkId: "household",
          type: "group",
          repeats: true,
          extension: [
            variable(
              "residentCount",
              "%context.item.where(linkId='residents').answer.valueString.count()",
            ),
          ],
          item: [
            { linkId: "residents", type: "string", repeats: true },
            {
              linkId: "resident-count",
              type: "integer",
              readOnly: true,
              extension: [calculatedExpression("%residentCount")],
            },
          ],
        },
      ],
    };
    const formData = new FormData();
    formData.set("fb[count][household]", "2");
    formData.set("fb[count][household][i:0][residents]", "2");
    formData.set("fb[answer][household][i:0][residents][i:0][value]", "Alice");
    formData.set("fb[answer][household][i:0][residents][i:1][value]", "Bob");
    formData.set("fb[count][household][i:1][residents]", "1");
    formData.set(
      "fb[answer][household][i:1][residents][i:0][value]",
      "Charlie",
    );
    const response = await process(questionnaire, formData);
    const households = items(response.item, "household");

    expect(
      child(households[0], "resident-count")?.answer?.[0]?.valueInteger,
    ).toBe(2);
    expect(
      child(households[1], "resident-count")?.answer?.[0]?.valueInteger,
    ).toBe(1);
  });

  it("exposes group variables to nested repeating groups per node", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-nested-repeats",
      item: [
        {
          linkId: "families",
          type: "group",
          repeats: true,
          extension: [
            variable(
              "familyLabel",
              "%context.item.where(linkId='family-name').answer.valueString.last()",
            ),
          ],
          item: [
            { linkId: "family-name", type: "string" },
            {
              linkId: "members",
              type: "group",
              repeats: true,
              item: [
                { linkId: "member-name", type: "string" },
                {
                  linkId: "family-tag",
                  type: "string",
                  readOnly: true,
                  extension: [calculatedExpression("%familyLabel")],
                },
              ],
            },
          ],
        },
      ],
    };
    const formData = new FormData();
    formData.set("fb[count][families]", "2");
    formData.set("fb[answer][families][i:0][family-name][value]", "Smith");
    formData.set("fb[count][families][i:0][members]", "1");
    formData.set(
      "fb[answer][families][i:0][members][i:0][member-name][value]",
      "Alice",
    );
    formData.set("fb[answer][families][i:1][family-name][value]", "Johnson");
    formData.set("fb[count][families][i:1][members]", "1");
    formData.set(
      "fb[answer][families][i:1][members][i:0][member-name][value]",
      "Brandon",
    );
    const response = await process(questionnaire, formData);
    const families = items(response.item, "families");
    const firstMember = child(families[0], "members");
    const secondMember = child(families[1], "members");

    expect(child(firstMember, "family-tag")?.answer?.[0]?.valueString).toBe(
      "Smith",
    );
    expect(child(secondMember, "family-tag")?.answer?.[0]?.valueString).toBe(
      "Johnson",
    );
  });

  it("binds variables per repeating group node for answer descendants", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-answer-descendants",
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
                variable("streetValue", "%context.answer.valueString"),
              ],
              item: [
                {
                  linkId: "street-copy",
                  type: "string",
                  extension: [calculatedExpression("%streetValue")],
                },
              ],
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-variable-answer-descendants",
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
    const response = await renderResponse(questionnaire, questionnaireResponse);
    const addresses = items(response.item, "addresses");
    const firstStreet = child(addresses[0], "street");
    const secondStreet = child(addresses[1], "street");

    expect(
      answerChild(firstStreet?.answer?.[0], "street-copy")?.answer?.[0]
        ?.valueString,
    ).toBe("Alpha");
    expect(
      answerChild(secondStreet?.answer?.[0], "street-copy")?.answer?.[0]
        ?.valueString,
    ).toBe("Beta");
  });

  it("evaluates repeating question variables once for the item", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-repeating-question",
      item: [
        {
          linkId: "aliases",
          type: "string",
          repeats: true,
          extension: [variable("allAliases", "%context.answer.valueString")],
          item: [
            {
              linkId: "alias-count",
              type: "integer",
              extension: [calculatedExpression("%allAliases.count()")],
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-variable-repeating-question",
      status: "completed",
      item: [
        {
          linkId: "aliases",
          answer: [{ valueString: "Alpha" }, { valueString: "Beta" }],
        },
      ],
    };
    const response = await renderResponse(questionnaire, questionnaireResponse);
    const aliases = item(response.item, "aliases");

    expect(
      answerChild(aliases?.answer?.[0], "alias-count")?.answer?.[0]
        ?.valueInteger,
    ).toBe(2);
    expect(
      answerChild(aliases?.answer?.[1], "alias-count")?.answer?.[0]
        ?.valueInteger,
    ).toBe(2);
  });

  it("isolates variables per repeating group node and repeating question answer", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-repeating-answer-scope",
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
                    variable("residentName", "%context.answer.valueString"),
                    calculatedExpression("%residentName"),
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const questionnaireResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "Questionnaire/htmx-variable-repeating-answer-scope",
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
    const response = await renderResponse(questionnaire, questionnaireResponse);
    const addresses = items(response.item, "addresses");
    const firstResidents = child(addresses[0], "residents");
    const secondResidents = child(addresses[1], "residents");

    expect(
      answerChild(firstResidents?.answer?.[0], "resident-copy")?.answer?.[0]
        ?.valueString,
    ).toBe("Alpha-0");
    expect(
      answerChild(firstResidents?.answer?.[1], "resident-copy")?.answer?.[0]
        ?.valueString,
    ).toBe("Alpha-1");
    expect(
      answerChild(secondResidents?.answer?.[0], "resident-copy")?.answer?.[0]
        ?.valueString,
    ).toBe("Beta-0");
    expect(
      answerChild(secondResidents?.answer?.[1], "resident-copy")?.answer?.[0]
        ?.valueString,
    ).toBe("Beta-1");
  });

  it("renders an issue when a variable name is redeclared in the same scope", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-duplicate",
      item: [
        {
          linkId: "duplicate-vars",
          type: "group",
          extension: [
            variable("duplicate", "'first'"),
            variable("duplicate", "'second'"),
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("name collision");
    expect(html).toContain("&quot;duplicate&quot;");
  });

  it("renders evaluation errors when expressions reference unknown variables", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-unknown-reference",
      item: [
        {
          linkId: "mystery",
          type: "string",
          extension: [calculatedExpression("%missingVariable")],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("Failed to evaluate calculated expression");
    expect(html).toContain("because it references unavailable data");
  });

  it("renders unsupported variable language errors", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-unsupported-language",
      item: [
        {
          linkId: "unsupported",
          type: "group",
          extension: [
            {
              url: variableUrl,
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
    const html = await render(questionnaire);

    expect(html).toContain("Failed to evaluate variable");
    expect(html).toContain("due to an unsupported expression language");
  });

  it("renders evaluation errors from variable runtime failures", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-runtime-error",
      item: [
        {
          linkId: "runtime",
          type: "group",
          extension: [variable("broken", "'abc'.what()")],
          item: [
            {
              linkId: "mirror",
              type: "string",
              extension: [calculatedExpression("%broken")],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("Failed to evaluate variable");
    expect(html).toContain("because it calls an unsupported function");
  });

  it("renders direct circular variable dependency errors", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-direct-cycle",
      item: [
        {
          linkId: "cycle",
          type: "group",
          extension: [
            variable("alphaVar", "%betaVar + 1"),
            variable("betaVar", "%alphaVar + 1"),
          ],
          item: [
            {
              linkId: "mirror",
              type: "integer",
              extension: [calculatedExpression("%alphaVar")],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("Failed to evaluate variable");
    expect(html).toContain("because it returned an error");
  });

  it("renders indirect circular variable dependency errors", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-variable-indirect-cycle",
      item: [
        {
          linkId: "indirect-cycle",
          type: "group",
          extension: [
            variable("alphaVar", "%betaVar"),
            variable("betaVar", "%gammaVar"),
            variable("gammaVar", "%alphaVar"),
          ],
          item: [
            {
              linkId: "mirror",
              type: "string",
              extension: [calculatedExpression("%alphaVar")],
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);

    expect(html).toContain("Failed to evaluate variable");
    expect(html).toContain("because it returned an error");
  });
});
