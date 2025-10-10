import { describe, expect, it } from "vitest";

import type {
  Attachment,
  Questionnaire,
  QuestionnaireResponse,
  Quantity,
  Reference,
} from "fhir/r5";
import { buildQuestionnaireIndex } from "../questionnaire-index";
import { locateResponseItem } from "../qr-locator";
import {
  clearAnswerPrimitive,
  readAnswerPrimitive,
  writeAnswerPrimitive,
} from "../qr-operations";

const questionnaire: Questionnaire = {
  resourceType: "Questionnaire",
  id: "test-questionnaire",
  status: "active",
  item: [
    {
      linkId: "demo",
      text: "Demographics",
      type: "group",
      item: [
        {
          linkId: "first-name",
          text: "First name",
          type: "string",
        },
      ],
    },
    {
      linkId: "consent",
      text: "Consent",
      type: "boolean",
    },
    {
      linkId: "follow-up",
      text: "Follow up",
      type: "coding",
      answerOption: [
        { valueCoding: { code: "call", display: "Phone call", system: "http://example.org" } },
        { valueCoding: { code: "email", display: "Email", system: "http://example.org" } },
      ],
      item: [
        {
          linkId: "follow-up-notes",
          text: "Details",
          type: "text",
        },
      ],
    },
    {
      linkId: "attachment-item",
      text: "Latest lab attachment",
      type: "attachment",
    },
    {
      linkId: "reference-item",
      text: "Assign practitioner",
      type: "reference",
    },
    {
      linkId: "quantity-item",
      text: "Current weight",
      type: "quantity",
    },
  ],
};

function emptyResponse(): QuestionnaireResponse {
  return {
    resourceType: "QuestionnaireResponse",
    questionnaire: "Questionnaire/example",
    status: "in-progress",
    item: [],
  };
}

function findItem(linkId: string) {
  const target = questionnaire.item?.find((item) => item.linkId === linkId);
  if (!target) {
    throw new Error(`Missing questionnaire item: ${linkId}`);
  }
  return target;
}

describe("questionnaire state helpers", () => {
  it("indexes nested questions and answer-level children", () => {
    const index = buildQuestionnaireIndex(questionnaire);

    const groupSegments = index.get("first-name");
    expect(groupSegments).toBeTruthy();
    expect(groupSegments?.map((segment) => segment.item.linkId)).toEqual([
      "demo",
      "first-name",
    ]);
    expect(groupSegments?.every((segment) => segment.viaAnswer === false)).toBe(true);

    const answerChildSegments = index.get("follow-up-notes");
    expect(answerChildSegments).toBeTruthy();
    expect(answerChildSegments?.map((segment) => segment.item.linkId)).toEqual([
      "follow-up",
      "follow-up-notes",
    ]);
    expect(answerChildSegments?.[1]?.viaAnswer).toBe(true);
  });

  it("creates questionnaire response structure on write and reads back values", () => {
    const response = emptyResponse();
    const index = buildQuestionnaireIndex(questionnaire);

    writeAnswerPrimitive(index, response, questionnaire.item![0]!.item![0]!, "Ada");
    writeAnswerPrimitive(index, response, questionnaire.item![1]!, true);

    const demographicsItem = locateResponseItem(index, response, "first-name");
    expect(demographicsItem.item?.answer?.[0]?.valueString).toBe("Ada");

    const consentItem = locateResponseItem(index, response, "consent");
    expect(consentItem.item?.answer?.[0]?.valueBoolean).toBe(true);

    expect(readAnswerPrimitive(index, response, questionnaire.item![0]!.item![0]!)).toBe("Ada");
    expect(readAnswerPrimitive(index, response, questionnaire.item![1]!)).toBe(true);
  });

  it("preserves nested answer items when clearing values", () => {
    const response = emptyResponse();
    const index = buildQuestionnaireIndex(questionnaire);

    writeAnswerPrimitive(index, response, questionnaire.item![2]!, {
      code: "call",
      display: "Phone call",
      system: "http://example.org",
    });

    const target = locateResponseItem(index, response, "follow-up", { create: true });
    expect(target.item?.answer?.[0]?.valueCoding?.code).toBe("call");

    target.item!.answer![0]!.item = [
      {
        linkId: "follow-up-notes",
        text: "Details",
        answer: [
          {
            valueString: "Call in the afternoon",
          },
        ],
      },
    ];

    clearAnswerPrimitive(index, response, questionnaire.item![2]!);

    const cleared = locateResponseItem(index, response, "follow-up");
    expect(cleared.item?.answer?.[0]?.valueCoding).toBeUndefined();
    expect(cleared.item?.answer?.[0]?.item).toHaveLength(1);
    expect(
      cleared.item?.answer?.[0]?.item?.[0]?.answer?.[0]?.valueString,
    ).toBe("Call in the afternoon");
  });

  it("supports attachment, reference, and quantity primitives", () => {
    const response = emptyResponse();
    const index = buildQuestionnaireIndex(questionnaire);

    const attachmentValue: Attachment = {
      url: "http://example.org/report.pdf",
      contentType: "application/pdf",
      title: "Lab Report",
    };

    const referenceValue: Reference = {
      reference: "Practitioner/123",
      display: "Dr. Taylor",
    };

    const quantityValue: Quantity = {
      value: 72,
      unit: "kg",
      system: "http://unitsofmeasure.org",
      code: "kg",
    };

    const attachmentItem = findItem("attachment-item");
    const referenceItem = findItem("reference-item");
    const quantityItem = findItem("quantity-item");

    writeAnswerPrimitive(index, response, attachmentItem, attachmentValue);
    writeAnswerPrimitive(index, response, referenceItem, referenceValue);
    writeAnswerPrimitive(index, response, quantityItem, quantityValue);

    expect(
      locateResponseItem(index, response, "attachment-item").item?.answer?.[0]?.valueAttachment,
    ).toEqual(attachmentValue);
    expect(
      locateResponseItem(index, response, "reference-item").item?.answer?.[0]?.valueReference,
    ).toEqual(referenceValue);
    expect(
      locateResponseItem(index, response, "quantity-item").item?.answer?.[0]?.valueQuantity,
    ).toEqual(quantityValue);

    expect(readAnswerPrimitive(index, response, attachmentItem)).toEqual(attachmentValue);
    expect(readAnswerPrimitive(index, response, referenceItem)).toEqual(referenceValue);
    expect(readAnswerPrimitive(index, response, quantityItem)).toEqual(quantityValue);
  });
});
