import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { EXT, assertDefined } from "@formbox/renderer/utilities.ts";

import type {
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;
type QuestionnaireResponseAnswer = NonNullable<
  NonNullable<QuestionnaireResponse["item"]>[number]["answer"]
>[number];

function getResponseAnswer(form: FormStore, linkId: string) {
  return form.response.item?.find((item) => item.linkId === linkId)
    ?.answer?.[0];
}

describe("QuestionnaireResponse.answer.itemWeight", () => {
  it("serializes selected option weights into QuestionnaireResponse.item.answer.extension", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "mood",
          type: "coding",
          answerOption: [
            {
              valueCoding: {
                system: "http://example.org/mood",
                code: "good",
                display: "Good",
              },
              extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 2 }],
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
    const mood = form.scope.lookupNode("mood");
    assertQuestionNode<"coding">(mood);

    const answer = mood.answers[0];
    assertDefined(answer);
    answer.setValueByUser({
      system: "http://example.org/mood",
      code: "good",
      display: "Good",
    });

    const responseAnswer = form.response.item?.[0]?.answer?.[0];
    assertDefined(responseAnswer);
    expect(responseAnswer.extension).toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 2,
    });
  });

  it("preserves imported answer-level itemWeight and clears it after user edits without weighted options", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [{ linkId: "score", type: "integer" }],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#q",
      status: "completed",
      item: [
        {
          linkId: "score",
          answer: [
            {
              valueInteger: 5,
              extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 1.5 }],
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
      response,
      undefined,
    );
    const score = form.scope.lookupNode("score");
    assertQuestionNode<"integer">(score);

    expect(score.answers[0]?.value).toBe(5);
    expect(getResponseAnswer(form, "score")?.extension).toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 1.5,
    });

    const answer = score.answers[0];
    assertDefined(answer);
    answer.setValueByUser(6);

    expect(getResponseAnswer(form, "score")?.extension).toBeUndefined();
  });

  it("normalizes legacy ordinalValue from imported coding answers to itemWeight", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [{ linkId: "severity", type: "coding" }],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#q",
      status: "completed",
      item: [
        {
          linkId: "severity",
          answer: [
            {
              valueCoding: {
                system: "http://example.org/severity",
                code: "high",
                extension: [{ url: EXT.ORDINAL_VALUE, valueDecimal: 4 }],
              },
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
      response,
      undefined,
    );
    const responseAnswer = getResponseAnswer(form, "severity");
    assertDefined(responseAnswer);

    expect(responseAnswer.extension).toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 4,
    });
    expect(responseAnswer.extension).not.toContainEqual({
      url: EXT.ORDINAL_VALUE,
      valueDecimal: 4,
    });
    expect(responseAnswer.valueCoding?.extension ?? []).not.toContainEqual({
      url: EXT.ORDINAL_VALUE,
      valueDecimal: 4,
    });
    expect(responseAnswer.valueCoding?.extension ?? []).not.toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 4,
    });
  });

  it("hydrates itemWeight from primitive value element extensions", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [{ linkId: "score", type: "integer" }],
    };

    const answerWithPrimitiveWeight = {
      valueInteger: 7,
      _valueInteger: {
        extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 2.25 }],
      },
    } as unknown as QuestionnaireResponseAnswer;

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#q",
      status: "completed",
      item: [
        {
          linkId: "score",
          answer: [answerWithPrimitiveWeight],
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
    );
    const score = form.scope.lookupNode("score");
    assertQuestionNode<"integer">(score);

    expect(score.answers[0]?.value).toBe(7);
    expect(getResponseAnswer(form, "score")?.extension).toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 2.25,
    });
  });

  it("prefers imported answer-level weight over imported coding-level weight", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [{ linkId: "severity", type: "coding" }],
    };

    const response: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      questionnaire: "#q",
      status: "completed",
      item: [
        {
          linkId: "severity",
          answer: [
            {
              extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 5 }],
              valueCoding: {
                system: "http://example.org/severity",
                code: "high",
                extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 1 }],
              },
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
      response,
      undefined,
    );
    const responseAnswer = getResponseAnswer(form, "severity");
    assertDefined(responseAnswer);

    expect(responseAnswer.extension).toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 5,
    });
    expect(responseAnswer.valueCoding?.extension ?? []).not.toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 1,
    });
    expect(responseAnswer.valueCoding?.extension ?? []).not.toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 5,
    });
  });
});
