import { describe, expect, it, vi } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import en from "@formbox/strings/en";
import { EXT, assertDefined } from "@formbox/renderer/utilities.ts";

import {
  makeCalculatedExpression,
  makeVariable,
} from "../../../../../../../utilities.ts";

import type {
  CodingOf,
  QuestionnaireItemAnswerOptionOf,
  QuestionnaireOf,
} from "@formbox/renderer";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
type Coding = CodingOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireItemAnswerOption = QuestionnaireItemAnswerOptionOf<"r5">;

const WEIGHTED_OPTIONS: QuestionnaireItemAnswerOption[] = [
  {
    valueCoding: {
      system: "http://example.org/phq9-frequency",
      code: "0",
      display: "Not at all",
    },
    extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 0 }],
  },
  {
    valueCoding: {
      system: "http://example.org/phq9-frequency",
      code: "1",
      display: "Several days",
    },
    extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 1 }],
  },
  {
    valueCoding: {
      system: "http://example.org/phq9-frequency",
      code: "2",
      display: "More than half the days",
    },
    extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 2 }],
  },
  {
    valueCoding: {
      system: "http://example.org/phq9-frequency",
      code: "3",
      display: "Nearly every day",
    },
    extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 3 }],
  },
];

const WEIGHTED_VALUESET_CANONICAL =
  "http://example.org/fhir/ValueSet/phq9-frequency";

const WEIGHTED_VALUESET_OPTIONS: Coding[] = [
  {
    system: "http://example.org/phq9-frequency",
    code: "never",
    display: "Never",
    extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 0 }],
  },
  {
    system: "http://example.org/phq9-frequency",
    code: "weekly",
    display: "Weekly",
    extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 2 }],
  },
];

const buildFetchResponse = (contains: Coding[]) =>
  ({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () =>
      Promise.resolve({
        expansion: {
          contains,
        },
      }),
  }) as unknown as Response;

function getRequestUrl(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

function getRequestedCanonical(input: Parameters<typeof fetch>[0]): string {
  const canonical = new URL(getRequestUrl(input)).searchParams.get("url");
  return canonical ?? "";
}

async function waitForValueSetExpansion(
  question: IQuestionNode<"coding">,
): Promise<void> {
  for (let index = 0; index < 25; index += 1) {
    if (!question.answerOption.select.isLoading) {
      return;
    }
    await Promise.resolve();
  }
}

function getCodingQuestion(
  form: FormStore,
  linkId: string,
): IQuestionNode<"coding"> {
  const node = form.scope.lookupNode(linkId);
  assertQuestionNode<"coding">(node);
  return node;
}

function selectCode(question: IQuestionNode<"coding">, code: string): void {
  const option = question.answerOption.inherentOptions.find((entry) => {
    const coding = entry.value as Coding | undefined;
    return coding?.code === code;
  });
  assertDefined(option);

  const answer = question.answers[0];
  assertDefined(answer);
  answer.setValueByUser(structuredClone(option.value));
}

describe("itemWeight", () => {
  it("uses answerOption itemWeight for calculated scoring and writes it into QuestionnaireResponse answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "phq9",
          type: "group",
          extension: [
            makeVariable(
              "phq9Score",
              "%context.item.where(linkId='q1' or linkId='q2' or linkId='q3' or linkId='q4').answer.value.weight().aggregate($this + $total, 0)",
            ),
          ],
          item: [
            {
              linkId: "q1",
              type: "coding",
              answerOption: structuredClone(WEIGHTED_OPTIONS),
            },
            {
              linkId: "q2",
              type: "coding",
              answerOption: structuredClone(WEIGHTED_OPTIONS),
            },
            {
              linkId: "q3",
              type: "coding",
              answerOption: structuredClone(WEIGHTED_OPTIONS),
            },
            {
              linkId: "q4",
              type: "coding",
              answerOption: structuredClone(WEIGHTED_OPTIONS),
            },
            {
              linkId: "total",
              type: "integer",
              extension: [makeCalculatedExpression(undefined, "%phq9Score")],
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
    const q1 = getCodingQuestion(form, "q1");
    const q2 = getCodingQuestion(form, "q2");
    const total = form.scope.lookupNode("total");
    assertQuestionNode<"integer">(total);

    selectCode(q1, "1");
    selectCode(q2, "3");

    expect(total.answers[0]?.value).toBe(4);

    const groupResponse = form.response.item?.find(
      (item) => item.linkId === "phq9",
    );
    const q1Response = groupResponse?.item?.find(
      (item) => item.linkId === "q1",
    );
    const q1Answer = q1Response?.answer?.[0];
    assertDefined(q1Answer);

    expect(q1Answer.extension).toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 1,
    });
    expect(q1Answer.valueCoding?.extension ?? []).not.toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 1,
    });
    expect(q1Answer.valueCoding?.extension ?? []).not.toContainEqual({
      url: EXT.ORDINAL_VALUE,
      valueDecimal: 1,
    });
  });

  it("accepts deprecated ordinalValue extensions as weight input", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "score-input",
          type: "coding",
          answerOption: [
            {
              valueCoding: {
                system: "http://example.org/legacy",
                code: "high",
                display: "High",
              },
              extension: [{ url: EXT.ORDINAL_VALUE, valueDecimal: 4 }],
            },
          ],
        },
        {
          linkId: "total",
          type: "integer",
          extension: [
            makeCalculatedExpression(
              undefined,
              "%resource.item.where(linkId='score-input').answer.value.weight().aggregate($this + $total, 0)",
            ),
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
    const scoreInput = getCodingQuestion(form, "score-input");
    const total = form.scope.lookupNode("total");
    assertQuestionNode<"integer">(total);

    selectCode(scoreInput, "high");
    expect(total.answers[0]?.value).toBe(4);
  });

  it("prefers answerOption-level itemWeight over valueCoding-level itemWeight", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "score-input",
          type: "coding",
          answerOption: [
            {
              valueCoding: {
                system: "http://example.org/precedence",
                code: "high",
                display: "High",
                extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 1 }],
              },
              extension: [{ url: EXT.ITEM_WEIGHT, valueDecimal: 3 }],
            },
          ],
        },
        {
          linkId: "total",
          type: "integer",
          extension: [
            makeCalculatedExpression(
              undefined,
              "%resource.item.where(linkId='score-input').answer.value.weight().aggregate($this + $total, 0)",
            ),
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
    const scoreInput = getCodingQuestion(form, "score-input");
    const total = form.scope.lookupNode("total");
    assertQuestionNode<"integer">(total);

    expect(scoreInput.answerOption.inherentOptions[0]?.weight).toBe(3);

    selectCode(scoreInput, "high");
    expect(total.answers[0]?.value).toBe(3);

    const responseAnswer = form.response.item?.find(
      (item) => item.linkId === "score-input",
    )?.answer?.[0];
    assertDefined(responseAnswer);

    expect(responseAnswer.extension).toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 3,
    });
    expect(responseAnswer.valueCoding?.extension ?? []).not.toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 1,
    });
    expect(responseAnswer.valueCoding?.extension ?? []).not.toContainEqual({
      url: EXT.ITEM_WEIGHT,
      valueDecimal: 3,
    });
    expect(responseAnswer.valueCoding?.extension ?? []).not.toContainEqual({
      url: EXT.ORDINAL_VALUE,
      valueDecimal: 3,
    });
  });

  it("uses itemWeight from answerValueSet expansion codings", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input) => {
        const canonical = getRequestedCanonical(input);
        return buildFetchResponse(
          canonical === WEIGHTED_VALUESET_CANONICAL
            ? WEIGHTED_VALUESET_OPTIONS
            : [],
        );
      });

    try {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "frequency",
            type: "coding",
            answerValueSet: WEIGHTED_VALUESET_CANONICAL,
          },
          {
            linkId: "total",
            type: "integer",
            extension: [
              makeCalculatedExpression(
                undefined,
                "%resource.item.where(linkId='frequency').answer.value.weight().aggregate($this + $total, 0)",
              ),
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
      const frequency = getCodingQuestion(form, "frequency");
      const total = form.scope.lookupNode("total");
      assertQuestionNode<"integer">(total);

      await waitForValueSetExpansion(frequency);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(getRequestedCanonical(fetchSpy.mock.calls[0]?.[0])).toBe(
        WEIGHTED_VALUESET_CANONICAL,
      );

      selectCode(frequency, "weekly");
      expect(total.answers[0]?.value).toBe(2);

      const responseAnswer = form.response.item?.find(
        (item) => item.linkId === "frequency",
      )?.answer?.[0];
      assertDefined(responseAnswer);

      expect(responseAnswer.extension).toContainEqual({
        url: EXT.ITEM_WEIGHT,
        valueDecimal: 2,
      });
      expect(responseAnswer.valueCoding?.extension ?? []).not.toContainEqual({
        url: EXT.ITEM_WEIGHT,
        valueDecimal: 2,
      });
      expect(responseAnswer.valueCoding?.extension ?? []).not.toContainEqual({
        url: EXT.ORDINAL_VALUE,
        valueDecimal: 2,
      });
    } finally {
      fetchSpy.mockRestore();
    }
  });
});
