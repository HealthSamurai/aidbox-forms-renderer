import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { assertGroupNode } from "@formbox/renderer/store/group/group-store.ts";
import { isGroupListStore } from "@formbox/renderer/store/group/group-list-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { Form } from "@formbox/renderer/component/form/form.tsx";
import { assertDefined, EXT } from "@formbox/renderer/utilities.ts";
import type { IGroupNode } from "@formbox/renderer/types.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

const questionnaire: Questionnaire = {
  resourceType: "Questionnaire",
  id: "signature-required-group",
  status: "active",
  item: [
    {
      linkId: "consent-group",
      text: "Consent group",
      type: "group",
      extension: [
        {
          url: EXT.SIGNATURE_REQUIRED,
          valueCodeableConcept: {
            coding: [
              {
                system: "urn:iso-astm:E1762-95:2013",
                code: "1.2.840.10065.1.12.1.1",
                display: "Author's Signature",
              },
            ],
            text: "Author's Signature",
          },
        },
      ],
      item: [
        {
          linkId: "consent-text",
          text: "Consent details",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};

const repeatingGroupQuestionnaire: Questionnaire = {
  resourceType: "Questionnaire",
  id: "signature-required-repeating-group",
  status: "active",
  item: [
    {
      linkId: "consent-group",
      text: "Consent group",
      type: "group",
      repeats: true,
      required: true,
      extension: questionnaire.item?.[0]?.extension,
      item: [
        {
          linkId: "consent-text",
          text: "Consent details",
          type: "text",
        },
      ],
    },
  ],
};

const questionQuestionnaire: Questionnaire = {
  resourceType: "Questionnaire",
  id: "signature-required-question",
  status: "active",
  item: [
    {
      linkId: "patient-name",
      text: "Patient name",
      type: "string",
      extension: questionnaire.item?.[0]?.extension,
    },
  ],
};

describe("itemSignatureRequired", () => {
  it("renders group signature input only after answer content exists", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );

    const { rerender } = render(<Form store={form} />);
    expect(screen.queryByRole("button", { name: /sign/i })).toBeNull();

    setStringAnswer(form, "consent-text", "I consent");
    rerender(<Form store={form} />);
    expect(screen.getByRole("button", { name: /sign/i })).toBeInstanceOf(
      HTMLButtonElement,
    );
  });

  it("writes ItemSignature extension to response when group signature is set", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    setStringAnswer(form, "consent-text", "I consent");
    const group = getGroup(form, "consent-group");
    group.setSignature(makeSignature());

    expect(form.response).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/signature-required-group",
      item: [
        {
          linkId: "consent-group",
          text: "Consent group",
          item: [
            {
              linkId: "consent-text",
              text: "Consent details",
              answer: [
                {
                  valueString: "I consent",
                },
              ],
            },
          ],
          extension: [
            {
              url: EXT.QUESTIONNAIRE_RESPONSE_SIGNATURE,
              valueSignature: {
                sigFormat: "image/png",
                data: SIGNATURE_DATA,
              },
            },
          ],
        },
      ],
    });
  });

  it("updates full form response when a group-level signature is set", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    setStringAnswer(form, "consent-text", "I consent");
    const group = getGroup(form, "consent-group");
    group.setSignature(makeSignature());

    const item = form.response.item?.[0];
    expect(item?.linkId).toBe("consent-group");
    expect(item?.extension?.[0]?.url).toBe(
      EXT.QUESTIONNAIRE_RESPONSE_SIGNATURE,
    );
    expect(item?.extension?.[0]?.valueSignature?.data).toBe(SIGNATURE_DATA);
  });

  it("updates response when repeating-group signature is set", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      repeatingGroupQuestionnaire,
      undefined,
      undefined,
    );
    const groupList = form.nodes[0];
    expect(isGroupListStore(groupList)).toBe(true);
    assertDefined(groupList);
    if (!isGroupListStore(groupList)) {
      throw new TypeError("Expected a repeating group list node.");
    }
    const group = groupList.nodes[0];
    assertDefined(group);
    const question = group.nodes[0];
    assertQuestionNode(question);
    const answer = question.answers[0] ?? question.addAnswer();
    assertDefined(answer);
    answer.setValueByUser("I consent");
    group.setSignature(makeSignature());

    const item = form.response.item?.[0];
    expect(item?.linkId).toBe("consent-group");
    expect(item?.extension?.[0]?.url).toBe(
      EXT.QUESTIONNAIRE_RESPONSE_SIGNATURE,
    );
    expect(item?.extension?.[0]?.valueSignature?.data).toBe(SIGNATURE_DATA);
  });

  it("renders repeating-group signature input even when remove is unavailable", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      repeatingGroupQuestionnaire,
      undefined,
      undefined,
    );
    const { rerender } = render(<Form store={form} />);
    expect(screen.queryByRole("button", { name: /sign/i })).toBeNull();

    const groupList = form.nodes[0];
    expect(isGroupListStore(groupList)).toBe(true);
    assertDefined(groupList);
    if (!isGroupListStore(groupList)) {
      throw new TypeError("Expected a repeating group list node.");
    }
    const group = groupList.nodes[0];
    assertDefined(group);
    const question = group.nodes[0];
    assertQuestionNode(question);
    const answer = question.answers[0] ?? question.addAnswer();
    assertDefined(answer);
    answer.setValueByUser("Witness");

    rerender(<Form store={form} />);
    expect(screen.getByRole("button", { name: /sign/i })).toBeInstanceOf(
      HTMLButtonElement,
    );
  });

  it("updates response when question-level signature is set", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      questionQuestionnaire,
      undefined,
      undefined,
    );
    setStringAnswer(form, "patient-name", "Alice");
    const question = form.scope.lookupNode("patient-name");
    assertQuestionNode(question);
    question.setSignature(makeSignature());

    const item = form.response.item?.[0];
    expect(item?.linkId).toBe("patient-name");
    expect(item?.extension?.[0]?.url).toBe(
      EXT.QUESTIONNAIRE_RESPONSE_SIGNATURE,
    );
    expect(item?.extension?.[0]?.valueSignature?.data).toBe(SIGNATURE_DATA);
  });

  it("requires signature when a question has content", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "patient-name",
            text: "Patient name",
            type: "string",
            extension: [{ url: EXT.SIGNATURE_REQUIRED }],
          },
        ],
      },
      undefined,
      undefined,
    );
    const question = form.scope.lookupNode("patient-name");
    assertQuestionNode(question);

    const answer = question.answers[0];
    assertDefined(answer);
    answer.setValueByUser("Alice");

    expect(form.validateAll()).toBe(false);
    expect(
      question.issues.some((issue) =>
        issue.diagnostics?.includes("Signature is required."),
      ),
    ).toBe(true);

    question.setSignature(makeSignature());
    expect(form.validateAll()).toBe(true);
  });

  it("requires signature when a group has responses", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "consent-group",
            text: "Consent group",
            type: "group",
            extension: [{ url: EXT.SIGNATURE_REQUIRED }],
            item: [
              {
                linkId: "consent-details",
                text: "Consent details",
                type: "string",
              },
            ],
          },
        ],
      },
      undefined,
      undefined,
    );
    const group = form.scope.lookupNode("consent-group");
    const details = form.scope.lookupNode("consent-details");
    assertGroupNode(group);
    assertQuestionNode(details);

    const answer = details.answers[0];
    assertDefined(answer);
    answer.setValueByUser("Accepted");

    expect(form.validateAll()).toBe(false);
    expect(
      group.issues.some((issue) =>
        issue.diagnostics?.includes("Signature is required."),
      ),
    ).toBe(true);

    group.setSignature(makeSignature());
    expect(form.validateAll()).toBe(true);
  });

  it("requires signature when a repeating group has responses", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      repeatingGroupQuestionnaire,
      undefined,
      undefined,
    );
    const groupList = form.nodes[0];
    expect(isGroupListStore(groupList)).toBe(true);
    assertDefined(groupList);
    if (!isGroupListStore(groupList)) {
      throw new TypeError("Expected a repeating group list node.");
    }
    const group = groupList.nodes[0];
    assertDefined(group);
    const details = group.nodes[0];
    assertQuestionNode(details);

    const answer = details.answers[0] ?? details.addAnswer();
    assertDefined(answer);
    answer.setValueByUser("Accepted");

    expect(form.validateAll()).toBe(false);
    expect(
      group.issues.some((issue) =>
        issue.diagnostics?.includes("Signature is required."),
      ),
    ).toBe(true);

    group.setSignature(makeSignature());
    expect(form.validateAll()).toBe(true);
  });
});

function getGroup(form: FormStore, linkId: string): IGroupNode {
  const node = form.scope.lookupNode(linkId);
  assertGroupNode(node);
  return node;
}

function setStringAnswer(form: FormStore, linkId: string, value: string): void {
  const node = form.scope.lookupNode(linkId);
  assertQuestionNode(node);
  const answer = node.answers[0] ?? node.addAnswer();
  assertDefined(answer);
  answer.setValueByUser(value);
}

const SIGNATURE_DATA = "ZmFrZS1zaWduYXR1cmU=";

function makeSignature() {
  return {
    sigFormat: "image/png",
    data: SIGNATURE_DATA,
  };
}
