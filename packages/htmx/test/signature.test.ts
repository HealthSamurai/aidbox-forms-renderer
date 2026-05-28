import { describe, expect, it } from "vitest";

import { QuestionnaireRenderer } from "../lib/index.ts";
import { nativeTemplates } from "./native-templates.ts";

import type { QuestionnaireOf, QuestionnaireResponseOf } from "@formbox/fhir";

type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;

const signatureRequiredUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-signatureRequired";
const responseSignatureUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaireresponse-signature";
const itemControlUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl";
const itemControlSystem = "http://hl7.org/fhir/questionnaire-item-control";
const signatureDataUrl = "data:image/png;base64,c2lnbmF0dXJl";
const signature = {
  sigFormat: "image/png",
  data: "c2lnbmF0dXJl",
};

function itemControl(code: string) {
  return {
    url: itemControlUrl,
    valueCodeableConcept: {
      coding: [{ system: itemControlSystem, code }],
    },
  };
}

async function render(
  questionnaire: Questionnaire,
  formData?: FormData,
): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
    questionnaire,
    fhirVersion: "r5",
  });
  try {
    if (formData) {
      await renderer.process(formData);
    }
    return await renderer.render();
  } finally {
    renderer.dispose();
  }
}

async function process(
  questionnaire: Questionnaire,
  formData: FormData,
): Promise<QuestionnaireResponse> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: nativeTemplates,
    questionnaire,
    fhirVersion: "r5",
  });
  try {
    await renderer.process(formData);
    return renderer.getQuestionnaireResponse();
  } finally {
    renderer.dispose();
  }
}

function formDataFromHtml(
  html: string,
  entries: ReadonlyArray<readonly [string, string]>,
): FormData {
  const formData = hiddenFormData(html);
  for (const [linkId, value] of entries) {
    formData.set(attributeFrom(html, linkId, "name", "value"), value);
  }
  return formData;
}

function hiddenFormData(html: string): FormData {
  const formData = new FormData();
  const pattern =
    /<input[^>]*type="hidden"[^>]*name="([^"]+)"[^>]*value="([^"]*)"/gu;
  for (const match of html.matchAll(pattern)) {
    const [, rawName, rawValue] = match;
    if (rawName && rawValue !== undefined) {
      formData.append(decodeEntities(rawName), decodeEntities(rawValue));
    }
  }
  return formData;
}

function attributeFrom(
  html: string,
  linkId: string,
  attribute: string,
  field: string,
): string {
  const escapedLinkId = escapeRegExp(encodeURIComponent(linkId));
  const escapedField = escapeRegExp(encodeURIComponent(field));
  const pattern = new RegExp(
    String.raw`<[^>]*\bdata-fb-link-id="${escapedLinkId}"[^>]*\bdata-fb-field="${escapedField}"[^>]*\b${attribute}="([^"]+)"`,
    "u",
  );
  const match = pattern.exec(html);
  if (!match?.[1]) {
    throw new Error(`Missing ${attribute} for ${linkId}.${field} in ${html}`);
  }
  return decodeEntities(match[1]);
}

function decodeEntities(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

describe("@formbox/htmx signature parity", () => {
  it("requires a root signature when the response has content", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-root-signature-required",
      extension: [{ url: signatureRequiredUrl }],
      item: [{ linkId: "note", text: "Encounter note", type: "text" }],
    };
    const html = await render(questionnaire);
    const unsigned = formDataFromHtml(html, [["note", "Follow-up needed."]]);
    unsigned.set("fb[action]", "submit");
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const result = await renderer.process(unsigned);
      const invalidHtml = await renderer.render();

      expect(result).toEqual({ submitted: true, valid: false });
      expect(invalidHtml).toContain("Signature is required.");

      const signed = formDataFromHtml(invalidHtml, [
        ["note", "Follow-up needed."],
      ]);
      signed.set("fb[signature]", signatureDataUrl);
      signed.set("fb[action]", "submit");

      expect(await renderer.process(signed)).toEqual({
        submitted: true,
        valid: true,
      });
    } finally {
      renderer.dispose();
    }
  });

  it("serializes submitted root signatures into QuestionnaireResponse extensions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-root-signature",
      extension: [{ url: signatureRequiredUrl }],
      item: [
        {
          linkId: "name",
          text: "Name",
          type: "string",
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const answered = formDataFromHtml(firstHtml, [["name", "Alice"]]);
    const secondHtml = await render(questionnaire, answered);
    const signed = formDataFromHtml(secondHtml, [["name", "Alice"]]);
    signed.set("fb[signature]", signatureDataUrl);

    expect(await process(questionnaire, signed)).toEqual({
      resourceType: "QuestionnaireResponse",
      status: "in-progress",
      questionnaire: "Questionnaire/htmx-root-signature",
      extension: [{ url: responseSignatureUrl, valueSignature: signature }],
      item: [
        {
          linkId: "name",
          text: "Name",
          answer: [{ valueString: "Alice" }],
        },
      ],
    });
  });

  it("serializes submitted group signatures into QuestionnaireResponse item extensions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-group-signature",
      item: [
        {
          linkId: "section",
          text: "Section",
          type: "group",
          extension: [{ url: signatureRequiredUrl }],
          item: [{ linkId: "detail", text: "Detail", type: "string" }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const answered = formDataFromHtml(firstHtml, [["detail", "yes"]]);
    const secondHtml = await render(questionnaire, answered);
    const signed = formDataFromHtml(secondHtml, [["detail", "yes"]]);
    signed.set(
      attributeFrom(secondHtml, "section", "name", "signature"),
      signatureDataUrl,
    );

    const response = await process(questionnaire, signed);

    expect(response.item).toEqual([
      {
        linkId: "section",
        text: "Section",
        extension: [{ url: responseSignatureUrl, valueSignature: signature }],
        item: [
          {
            linkId: "detail",
            text: "Detail",
            answer: [{ valueString: "yes" }],
          },
        ],
      },
    ]);
  });

  it("serializes submitted repeating-group signatures into QuestionnaireResponse item extensions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeating-group-signature",
      item: [
        {
          linkId: "consent-group",
          text: "Consent group",
          type: "group",
          repeats: true,
          extension: [{ url: signatureRequiredUrl }],
          item: [
            {
              linkId: "consent-details",
              text: "Consent details",
              type: "string",
            },
          ],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const addRow = hiddenFormData(firstHtml);
    addRow.set(
      "fb[action]",
      attributeFrom(firstHtml, "consent-group", "value", "add-action"),
    );
    const rowHtml = await render(questionnaire, addRow);
    const answered = formDataFromHtml(rowHtml, [["consent-details", "yes"]]);
    const signatureHtml = await render(questionnaire, answered);
    const signed = formDataFromHtml(signatureHtml, [
      ["consent-details", "yes"],
    ]);
    signed.set(
      attributeFrom(signatureHtml, "consent-group", "name", "signature"),
      signatureDataUrl,
    );

    const response = await process(questionnaire, signed);

    expect(response.item).toEqual([
      {
        linkId: "consent-group",
        text: "Consent group",
        extension: [{ url: responseSignatureUrl, valueSignature: signature }],
        item: [
          {
            linkId: "consent-details",
            text: "Consent details",
            answer: [{ valueString: "yes" }],
          },
        ],
      },
    ]);
  });

  it("requires signatures for submitted repeating-group answers", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-repeating-group-signature-required",
      item: [
        {
          linkId: "consent-group",
          text: "Consent group",
          type: "group",
          repeats: true,
          required: true,
          extension: [{ url: signatureRequiredUrl }],
          item: [
            {
              linkId: "consent-details",
              text: "Consent details",
              type: "string",
            },
          ],
        },
      ],
    };
    const html = await render(questionnaire);
    const unsigned = formDataFromHtml(html, [["consent-details", "yes"]]);
    unsigned.set("fb[action]", "submit");
    const renderer = new QuestionnaireRenderer({
      token: "form",
      templates: nativeTemplates,
      questionnaire,
      fhirVersion: "r5",
    });

    try {
      const result = await renderer.process(unsigned);
      const invalidHtml = await renderer.render();

      expect(result).toEqual({ submitted: true, valid: false });
      expect(invalidHtml).toContain("Signature is required.");
      expect(invalidHtml.match(/Signature is required\./gu)).toHaveLength(1);
    } finally {
      renderer.dispose();
    }
  });

  it("serializes submitted question signatures into QuestionnaireResponse item extensions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-question-signature",
      item: [
        {
          linkId: "consent",
          text: "Consent",
          type: "string",
          extension: [{ url: signatureRequiredUrl }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const answered = formDataFromHtml(firstHtml, [["consent", "yes"]]);
    const secondHtml = await render(questionnaire, answered);
    const signed = formDataFromHtml(secondHtml, [["consent", "yes"]]);
    signed.set(
      attributeFrom(secondHtml, "consent", "name", "signature"),
      signatureDataUrl,
    );

    const response = await process(questionnaire, signed);

    expect(response.item).toEqual([
      {
        linkId: "consent",
        text: "Consent",
        extension: [
          {
            url: responseSignatureUrl,
            valueSignature: signature,
          },
        ],
        answer: [{ valueString: "yes" }],
      },
    ]);
  });

  it("preserves signed off-page groups through full-form pagination posts", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      url: "Questionnaire/htmx-page-signature",
      item: [
        {
          linkId: "page-one",
          text: "Page one",
          type: "group",
          extension: [itemControl("page"), { url: signatureRequiredUrl }],
          item: [{ linkId: "detail", text: "Detail", type: "string" }],
        },
        {
          linkId: "page-two",
          text: "Page two",
          type: "group",
          extension: [itemControl("page")],
          item: [{ linkId: "next", text: "Next", type: "string" }],
        },
      ],
    };
    const firstHtml = await render(questionnaire);
    const answered = formDataFromHtml(firstHtml, [["detail", "yes"]]);
    const secondHtml = await render(questionnaire, answered);
    const signed = formDataFromHtml(secondHtml, [["detail", "yes"]]);
    signed.set(
      attributeFrom(secondHtml, "page-one", "name", "signature"),
      signatureDataUrl,
    );
    signed.set("fb[action]", "page-next");
    const pageTwoHtml = await render(questionnaire, signed);
    const pageTwoData = formDataFromHtml(pageTwoHtml, [["next", "done"]]);

    const response = await process(questionnaire, pageTwoData);

    expect(response.item).toEqual([
      {
        linkId: "page-one",
        text: "Page one",
        extension: [{ url: responseSignatureUrl, valueSignature: signature }],
        item: [
          {
            linkId: "detail",
            text: "Detail",
            answer: [{ valueString: "yes" }],
          },
        ],
      },
      {
        linkId: "page-two",
        text: "Page two",
        item: [
          {
            linkId: "next",
            text: "Next",
            answer: [{ valueString: "done" }],
          },
        ],
      },
    ]);
  });
});
