import { describe, expect, it } from "vitest";

import type {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
} from "fhir/r5";

import { FormStore } from "../form/form-store.ts";
import {
  assertRepeatingGroupWrapper,
  isRepeatingGroupWrapper,
} from "../nodes/groups/repeating-group-wrapper.ts";
import { assertGroupNode, isGroupNode } from "../nodes/groups/group-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "../nodes/questions/question-store.ts";
import { assertDefined } from "../../utils.ts";
import type { DataType, DataTypeToType, ValueCarrierFor } from "../../types.ts";

describe("response generation", () => {
  it("falls back to a local Questionnaire reference when canonical URL is absent", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      id: "local-form",
      status: "active",
      item: [
        {
          linkId: "nickname",
          text: "Preferred name",
          type: "string",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("nickname");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    const nicknameAnswer = question.answers[0];
    assertDefined(nicknameAnswer);
    nicknameAnswer.setValueByUser("Oli");

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/local-form",
      item: [
        {
          linkId: "nickname",
          text: "Preferred name",
          answer: [{ valueString: "Oli" }],
        },
      ],
    });
  });

  it("still serializes hidden items when they hold data", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/hidden",
      status: "active",
      item: [
        {
          linkId: "internal-flag",
          text: "Internal flag",
          type: "boolean",
          extension: [
            {
              url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
              valueBoolean: true,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const flag = form.scope.lookupNode("internal-flag");
    expect(flag && isQuestionNode(flag)).toBe(true);
    assertQuestionNode(flag);

    const flagAnswer = flag.answers[0];
    assertDefined(flagAnswer);
    flagAnswer.setValueByUser(true);

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/hidden",
      item: [
        {
          linkId: "internal-flag",
          text: "Internal flag",
          answer: [{ valueBoolean: true }],
        },
      ],
    });
  });

  it("omits disabled items from the QuestionnaireResponse", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/conditional",
      status: "active",
      item: [
        {
          linkId: "toggle",
          type: "boolean",
          text: "Enable extra details",
        },
        {
          linkId: "extra",
          type: "string",
          text: "Extra details",
          enableWhen: [
            {
              question: "toggle",
              operator: "=",
              answerBoolean: true,
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const toggle = form.scope.lookupNode("toggle");
    const extra = form.scope.lookupNode("extra");
    expect(
      toggle && extra && isQuestionNode(toggle) && isQuestionNode(extra),
    ).toBe(true);
    assertQuestionNode(toggle);
    assertQuestionNode(extra);

    const toggleAnswer = toggle.answers[0];
    assertDefined(toggleAnswer);
    toggleAnswer.setValueByUser(true);

    const extraAnswer = extra.answers[0];
    assertDefined(extraAnswer);
    extraAnswer.setValueByUser("Hello");

    expect(form.response?.item?.some((item) => item.linkId === "extra")).toBe(
      true,
    );

    toggleAnswer.setValueByUser(false);

    expect(extra.hidden).toBe(true);
    expect(form.response?.item?.some((item) => item.linkId === "extra")).toBe(
      false,
    );
  });

  it("omits QuestionnaireResponse.item when no answerable content is populated", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/empty",
      status: "active",
      item: [
        {
          linkId: "notes",
          text: "Notes",
          type: "text",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("notes");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/empty",
    });
  });

  it("builds a QuestionnaireResponse with answered string questions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/simple",
      status: "active",
      item: [
        {
          linkId: "first-name",
          text: "First name",
          type: "string",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("first-name");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    const firstNameAnswer = question.answers[0];
    assertDefined(firstNameAnswer);
    firstNameAnswer.setValueByUser("Alice");

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/simple",
      item: [
        {
          linkId: "first-name",
          text: "First name",
          answer: [{ valueString: "Alice" }],
        },
      ],
    });
  });

  it("includes display items in the response", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/display",
      status: "active",
      item: [
        {
          linkId: "intro",
          text: "Introduction",
          type: "display",
        },
        {
          linkId: "ack",
          text: "Do you acknowledge?",
          type: "boolean",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("ack");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    const ackAnswer = question.answers[0];
    assertDefined(ackAnswer);
    ackAnswer.setValueByUser(true);

    expect(form.response.item).toEqual([
      { linkId: "intro", text: "Introduction" },
      {
        linkId: "ack",
        text: "Do you acknowledge?",
        answer: [{ valueBoolean: true }],
      },
    ]);
  });

  it("nests question answers under group items", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/grouped",
      status: "active",
      item: [
        {
          linkId: "demographics",
          text: "Demographics",
          type: "group",
          item: [
            {
              linkId: "consent",
              text: "Consent to share data",
              type: "boolean",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("demographics");
    expect(group && isGroupNode(group)).toBe(true);
    assertGroupNode(group);
    const question = group.nodes.at(0);
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    const consentAnswer = question.answers[0];
    assertDefined(consentAnswer);
    consentAnswer.setValueByUser(true);

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/grouped",
      item: [
        {
          linkId: "demographics",
          text: "Demographics",
          item: [
            {
              linkId: "consent",
              text: "Consent to share data",
              answer: [{ valueBoolean: true }],
            },
          ],
        },
      ],
    });
  });

  it("omits empty repeating answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/repeating",
      status: "active",
      item: [
        {
          linkId: "allergies",
          text: "Document allergies",
          type: "string",
          repeats: true,
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("allergies");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    question.addAnswer("Peanuts");
    question.addAnswer("Dust");
    question.addAnswer(null);

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/repeating",
      item: [
        {
          linkId: "allergies",
          text: "Document allergies",
          answer: [{ valueString: "Peanuts" }, { valueString: "Dust" }],
        },
      ],
    });
  });

  it("drops empty repeating group nodes from the response", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/empty-group",
      status: "active",
      item: [
        {
          linkId: "family-history",
          text: "Family history",
          type: "group",
          repeats: true,
          item: [
            {
              linkId: "condition",
              text: "Condition",
              type: "string",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("family-history");
    expect(group && isRepeatingGroupWrapper(group)).toBe(true);
    assertRepeatingGroupWrapper(group);

    group.addNode();

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/empty-group",
    });
  });

  it("serializes multiple repeating group node with their nested answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/family-history",
      status: "active",
      item: [
        {
          linkId: "family-history",
          text: "Family history",
          type: "group",
          repeats: true,
          item: [
            {
              linkId: "condition",
              text: "Condition",
              type: "string",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("family-history");
    expect(group && isRepeatingGroupWrapper(group)).toBe(true);
    assertRepeatingGroupWrapper(group);

    group.addNode();
    group.addNode();

    const [firstNode, secondNode] = group.nodes;
    expect(firstNode).toBeDefined();
    expect(secondNode).toBeDefined();
    assertDefined(firstNode);
    assertDefined(secondNode);

    const firstQuestion = firstNode.nodes.at(0);
    const secondQuestion = secondNode.nodes.at(0);
    expect(firstQuestion && isQuestionNode(firstQuestion)).toBe(true);
    expect(secondQuestion && isQuestionNode(secondQuestion)).toBe(true);
    assertQuestionNode(firstQuestion);
    assertQuestionNode(secondQuestion);

    const firstConditionAnswer = firstQuestion.answers[0];
    assertDefined(firstConditionAnswer);
    firstConditionAnswer.setValueByUser("Asthma");

    const secondConditionAnswer = secondQuestion.answers[0];
    assertDefined(secondConditionAnswer);
    secondConditionAnswer.setValueByUser("Diabetes");

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/family-history",
      item: [
        {
          linkId: "family-history",
          text: "Family history",
          item: [
            {
              linkId: "condition",
              text: "Condition",
              answer: [{ valueString: "Asthma" }],
            },
          ],
        },
        {
          linkId: "family-history",
          text: "Family history",
          item: [
            {
              linkId: "condition",
              text: "Condition",
              answer: [{ valueString: "Diabetes" }],
            },
          ],
        },
      ],
    });
  });

  it("serializes child items on an answer even when the primitive value is absent", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/follow-up",
      status: "active",
      item: [
        {
          linkId: "follow-up",
          text: "Provide follow-up detail",
          type: "string",
          item: [
            {
              linkId: "detail",
              text: "Detail",
              type: "text",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("follow-up");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    const answer = question.answers.at(0);
    expect(answer).toBeDefined();
    assertDefined(answer);

    const child = answer.nodes.find((child) => child.linkId === "detail");
    expect(child && isQuestionNode(child)).toBe(true);
    assertQuestionNode(child);

    const detailAnswer = child.answers[0];
    assertDefined(detailAnswer);
    detailAnswer.setValueByUser("Allergies reviewed and no issues noted.");

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/follow-up",
      item: [
        {
          linkId: "follow-up",
          text: "Provide follow-up detail",
          answer: [
            {
              item: [
                {
                  linkId: "detail",
                  text: "Detail",
                  answer: [
                    {
                      valueString: "Allergies reviewed and no issues noted.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  describe("answer value[x] serialization", () => {
    const answerMatrix: Array<{
      type: QuestionnaireItem["type"];
      build: () => {
        value: DataTypeToType<DataType>;
        expected: ValueCarrierFor<DataType>;
      };
    }> = [
      {
        type: "boolean",
        build: () => ({
          value: true,
          expected: { valueBoolean: true },
        }),
      },
      {
        type: "decimal",
        build: () => ({
          value: 12.34,
          expected: { valueDecimal: 12.34 },
        }),
      },
      {
        type: "integer",
        build: () => ({
          value: 7,
          expected: { valueInteger: 7 },
        }),
      },
      {
        type: "date",
        build: () => ({
          value: "2024-05-01",
          expected: { valueDate: "2024-05-01" },
        }),
      },
      {
        type: "dateTime",
        build: () => ({
          value: "2024-05-01T12:34:56Z",
          expected: { valueDateTime: "2024-05-01T12:34:56Z" },
        }),
      },
      {
        type: "time",
        build: () => ({
          value: "08:30:00",
          expected: { valueTime: "08:30:00" },
        }),
      },
      {
        type: "string",
        build: () => ({
          value: "Sample",
          expected: { valueString: "Sample" },
        }),
      },
      {
        type: "text",
        build: () => ({
          value: "Longer narrative answer",
          expected: { valueString: "Longer narrative answer" },
        }),
      },
      {
        type: "url",
        build: () => ({
          value: "https://example.org",
          expected: { valueUri: "https://example.org" },
        }),
      },
      {
        type: "coding",
        build: () => {
          const coding: DataTypeToType<"Coding"> = {
            system: "http://loinc.org",
            code: "1234-5",
            display: "Mock code",
          };
          return {
            value: coding,
            expected: { valueCoding: coding },
          };
        },
      },
      {
        type: "reference",
        build: () => {
          const reference: DataTypeToType<"Reference"> = {
            reference: "Patient/123",
          };
          return {
            value: reference,
            expected: { valueReference: reference },
          };
        },
      },
      {
        type: "attachment",
        build: () => {
          const attachment: DataTypeToType<"Attachment"> = {
            contentType: "text/plain",
            url: "http://files.example.org/report.txt",
          };
          return {
            value: attachment,
            expected: { valueAttachment: attachment },
          };
        },
      },
      {
        type: "quantity",
        build: () => {
          const quantity: DataTypeToType<"Quantity"> = {
            value: 5,
            unit: "mg",
          };
          return {
            value: quantity,
            expected: { valueQuantity: quantity },
          };
        },
      },
    ];

    answerMatrix.forEach(({ type, build }) => {
      it(`serializes ${type} answers to the matching value[x] element`, () => {
        const { value, expected } = build();
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          url: `Questionnaire/${type}-question`,
          status: "active",
          item: [
            {
              linkId: "answer",
              text: "Answer",
              type,
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = form.scope.lookupNode("answer");
        expect(question && isQuestionNode(question)).toBe(true);
        assertQuestionNode(question);

        const answerInstance = question.answers[0];
        assertDefined(answerInstance);
        answerInstance.setValueByUser(value);

        const responseAnswer =
          form.response.item?.at(0)?.answer?.at(0) ?? undefined;
        expect(responseAnswer).toBeDefined();
        assertDefined(responseAnswer);

        expect(responseAnswer).toEqual(expected);
        expect(Object.keys(responseAnswer)).toEqual(Object.keys(expected));
      });
    });
  });

  it("reproduces seeded QuestionnaireResponse content", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      url: "Questionnaire/prepopulated",
      status: "active",
      item: [
        {
          linkId: "symptoms",
          text: "Symptoms",
          type: "group",
          repeats: true,
          item: [
            {
              linkId: "description",
              text: "Description",
              type: "text",
            },
            {
              linkId: "onset",
              text: "Onset date",
              type: "date",
            },
          ],
        },
        {
          linkId: "consent",
          text: "Consent to share data",
          type: "boolean",
        },
      ],
    };

    const initialResponse: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/prepopulated",
      item: [
        {
          linkId: "symptoms",
          text: "Symptoms",
          item: [
            {
              linkId: "description",
              text: "Description",
              answer: [{ valueString: "Fever" }],
            },
            {
              linkId: "onset",
              text: "Onset date",
              answer: [{ valueDate: "2024-04-01" }],
            },
          ],
        },
        {
          linkId: "symptoms",
          text: "Symptoms",
          item: [
            {
              linkId: "description",
              text: "Description",
              answer: [{ valueString: "Cough" }],
            },
            {
              linkId: "onset",
              text: "Onset date",
              answer: [{ valueDate: "2024-04-03" }],
            },
          ],
        },
        {
          linkId: "consent",
          text: "Consent to share data",
          answer: [{ valueBoolean: true }],
        },
      ],
    };

    const form = new FormStore(questionnaire, initialResponse);

    expect(form.response).toEqual(initialResponse);
  });
});
