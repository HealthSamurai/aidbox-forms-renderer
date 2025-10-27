import { describe, expect, it } from "vitest";

import type {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";

import { FormStore } from "../form-store.ts";
import {
  isNonRepeatingGroup,
  isQuestion,
  isRepeatingGroup,
} from "../../utils.ts";

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

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("nickname");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    question.setAnswer(0, "Oli");

    expect(store.response).toEqual({
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

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("notes");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    expect(store.response).toEqual({
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

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("first-name");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    question.setAnswer(0, "Alice");

    expect(store.response).toEqual({
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

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("ack");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    question.setAnswer(0, true);

    expect(store.response.item).toEqual([
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

    const store = new FormStore(questionnaire);
    const group = store.lookupStore("demographics");
    expect(group && isNonRepeatingGroup(group)).toBe(true);
    if (!group || !isNonRepeatingGroup(group)) return;
    const question = group.children.at(0);
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    question.setAnswer(0, true);

    expect(store.response).toEqual({
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

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("allergies");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    question.addAnswer("Peanuts");
    question.addAnswer("Dust");
    question.addAnswer(null);

    expect(store.response).toEqual({
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

  it("drops empty repeating group instances from the response", () => {
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

    const store = new FormStore(questionnaire);
    const group = store.lookupStore("family-history");
    expect(group && isRepeatingGroup(group)).toBe(true);
    if (!group || !isRepeatingGroup(group)) return;

    group.addInstance();

    expect(store.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/empty-group",
    });
  });

  it("serializes multiple repeating group instances with their nested answers", () => {
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

    const store = new FormStore(questionnaire);
    const group = store.lookupStore("family-history");
    expect(group && isRepeatingGroup(group)).toBe(true);
    if (!group || !isRepeatingGroup(group)) return;

    group.addInstance();
    group.addInstance();

    const firstInstance = group.instances.at(0);
    const secondInstance = group.instances.at(1);
    if (!firstInstance || !secondInstance) {
      expect(firstInstance).toBeDefined();
      expect(secondInstance).toBeDefined();
      return;
    }

    const firstQuestion = firstInstance.children.at(0);
    const secondQuestion = secondInstance.children.at(0);
    expect(firstQuestion && isQuestion(firstQuestion)).toBe(true);
    expect(secondQuestion && isQuestion(secondQuestion)).toBe(true);
    if (!firstQuestion || !secondQuestion) return;
    if (!isQuestion(firstQuestion) || !isQuestion(secondQuestion)) return;

    firstQuestion.setAnswer(0, "Asthma");
    secondQuestion.setAnswer(0, "Diabetes");

    expect(store.response).toEqual({
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

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("follow-up");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    const answer = question.answers.at(0);
    expect(answer).toBeDefined();
    if (!answer) return;

    const child = answer.children.find((child) => child.linkId === "detail");
    expect(child && isQuestion(child)).toBe(true);
    if (!child || !isQuestion(child)) return;

    child.setAnswer(0, "Allergies reviewed and no issues noted.");

    expect(store.response).toEqual({
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
        value: QuestionnaireResponseItemAnswer[keyof QuestionnaireResponseItemAnswer];
        expected: Partial<QuestionnaireResponseItemAnswer>;
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
          const coding: QuestionnaireResponseItemAnswer["valueCoding"] = {
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
          const reference: QuestionnaireResponseItemAnswer["valueReference"] = {
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
          const attachment: QuestionnaireResponseItemAnswer["valueAttachment"] =
            {
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
          const quantity: QuestionnaireResponseItemAnswer["valueQuantity"] = {
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

        const store = new FormStore(questionnaire);
        const question = store.lookupStore("answer");
        expect(question && isQuestion(question)).toBe(true);
        if (!question || !isQuestion(question)) return;

        question.setAnswer(0, value as never);

        const responseAnswer =
          store.response.item?.at(0)?.answer?.at(0) ?? undefined;
        expect(responseAnswer).toBeDefined();
        if (!responseAnswer) return;

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

    const store = new FormStore(questionnaire, initialResponse);

    expect(store.response).toEqual(initialResponse);
  });
});
