import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { QuestionnaireRenderer } from "../lib/index.ts";
import { defaultTemplates } from "./default-templates.ts";

import type { CodingOf, QuestionnaireOf } from "@formbox/fhir";

type Coding = CodingOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;

const preferredTerminologyServerUrl =
  "http://hl7.org/fhir/StructureDefinition/preferredTerminologyServer";
const deprecatedPreferredTerminologyServerUrl =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-preferredTerminologyServer";
const unitValueSetUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-unitValueSet";

const ANSWER_VALUE_SET = "http://example.test/ValueSet/answer";
const UNIT_VALUE_SET = "http://example.test/ValueSet/unit";

function preferredTerminologyServer(url: string) {
  return { url: preferredTerminologyServerUrl, valueUrl: url };
}

function deprecatedPreferredTerminologyServer(url: string) {
  return { url: deprecatedPreferredTerminologyServerUrl, valueUrl: url };
}

async function render(questionnaire: Questionnaire): Promise<string> {
  const renderer = new QuestionnaireRenderer({
    token: "form",
    templates: defaultTemplates,
    questionnaire,
    fhirVersion: "r5",
    terminologyServerUrl: "https://terminology.example/default",
  });
  try {
    return await renderer.render();
  } finally {
    renderer.dispose();
  }
}

function buildFetchResponse(contains: Coding[]): Response {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    json: () =>
      Promise.resolve({
        expansion: {
          contains,
        },
      }),
  } as Response;
}

function getRequestUrl(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

describe("@formbox/htmx terminology server parity", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn<typeof globalThis, "fetch">>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      buildFetchResponse([
        {
          system: "http://example.test/system",
          code: "fallback",
          display: "Fallback",
        },
      ]),
    );
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("uses item preferredTerminologyServer entries before ancestor and default servers", async () => {
    fetchSpy.mockImplementation(async (input) => {
      const url = getRequestUrl(input);
      if (url.startsWith("https://terminology.example/item-first/")) {
        throw new Error("first server failed");
      }

      if (url.startsWith("https://terminology.example/shared/")) {
        return buildFetchResponse([
          {
            system: "http://example.test/answer",
            code: "preferred",
            display: "Preferred answer",
          },
        ]);
      }

      throw new Error(`Unexpected terminology request: ${url}`);
    });
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [
        preferredTerminologyServer("https://terminology.example/questionnaire"),
        preferredTerminologyServer("https://terminology.example/shared"),
      ],
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [
            preferredTerminologyServer("https://terminology.example/group"),
            preferredTerminologyServer("https://terminology.example/shared"),
          ],
          item: [
            {
              linkId: "choice",
              text: "Choice",
              type: "coding",
              answerValueSet: ANSWER_VALUE_SET,
              extension: [
                preferredTerminologyServer(
                  "https://terminology.example/item-first",
                ),
                preferredTerminologyServer(
                  "https://terminology.example/shared",
                ),
                preferredTerminologyServer(
                  "https://terminology.example/item-second",
                ),
              ],
            },
          ],
        },
      ],
    };

    const html = await render(questionnaire);

    expect(html).toContain("Preferred answer");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(
      `https://terminology.example/item-first/ValueSet/$expand?url=${encodeURIComponent(ANSWER_VALUE_SET)}`,
    );
    expect(fetchSpy.mock.calls[1]?.[0]).toBe(
      `https://terminology.example/shared/ValueSet/$expand?url=${encodeURIComponent(ANSWER_VALUE_SET)}`,
    );
  });

  it("deduplicates ancestor preferredTerminologyServer entries before default fallback", async () => {
    fetchSpy.mockImplementation(async (input) => {
      const url = getRequestUrl(input);
      if (url.startsWith("https://terminology.example/default/")) {
        return buildFetchResponse([
          {
            system: "http://example.test/answer",
            code: "default",
            display: "Default answer",
          },
        ]);
      }

      throw new Error(`Preferred server failed: ${url}`);
    });
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [
        preferredTerminologyServer("https://terminology.example/questionnaire"),
        preferredTerminologyServer("https://terminology.example/shared"),
      ],
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [
            preferredTerminologyServer(
              "https://terminology.example/group-only",
            ),
            preferredTerminologyServer("https://terminology.example/shared"),
          ],
          item: [
            {
              linkId: "choice",
              text: "Choice",
              type: "coding",
              answerValueSet: ANSWER_VALUE_SET,
              extension: [
                preferredTerminologyServer(
                  "https://terminology.example/item-first",
                ),
                preferredTerminologyServer(
                  "https://terminology.example/shared",
                ),
                preferredTerminologyServer(
                  "https://terminology.example/item-second",
                ),
              ],
            },
          ],
        },
      ],
    };

    const html = await render(questionnaire);

    expect(html).toContain("Default answer");
    expect(fetchSpy.mock.calls.map((call) => call[0])).toEqual([
      `https://terminology.example/item-first/ValueSet/$expand?url=${encodeURIComponent(ANSWER_VALUE_SET)}`,
      `https://terminology.example/shared/ValueSet/$expand?url=${encodeURIComponent(ANSWER_VALUE_SET)}`,
      `https://terminology.example/item-second/ValueSet/$expand?url=${encodeURIComponent(ANSWER_VALUE_SET)}`,
      `https://terminology.example/group-only/ValueSet/$expand?url=${encodeURIComponent(ANSWER_VALUE_SET)}`,
      `https://terminology.example/questionnaire/ValueSet/$expand?url=${encodeURIComponent(ANSWER_VALUE_SET)}`,
      `https://terminology.example/default/ValueSet/$expand?url=${encodeURIComponent(ANSWER_VALUE_SET)}`,
    ]);
  });

  it("uses deprecated questionnaire terminologyServer entries for answerValueSet expansion", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [
        deprecatedPreferredTerminologyServer(
          "https://terminology.example/deprecated",
        ),
      ],
      item: [
        {
          linkId: "choice",
          text: "Choice",
          type: "coding",
          answerValueSet: ANSWER_VALUE_SET,
        },
      ],
    };

    const html = await render(questionnaire);

    expect(html).toContain("Fallback");
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(
      `https://terminology.example/deprecated/ValueSet/$expand?url=${encodeURIComponent(ANSWER_VALUE_SET)}`,
    );
  });

  it("inherits preferredTerminologyServer through answer child questions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "parent",
          text: "Parent",
          type: "string",
          initial: [{ valueString: "parent answer" }],
          extension: [
            preferredTerminologyServer(
              "https://terminology.example/answer-parent",
            ),
          ],
          item: [
            {
              linkId: "child-choice",
              text: "Child choice",
              type: "coding",
              answerValueSet: ANSWER_VALUE_SET,
            },
          ],
        },
      ],
    };

    const html = await render(questionnaire);

    expect(html).toContain("Fallback");
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(
      `https://terminology.example/answer-parent/ValueSet/$expand?url=${encodeURIComponent(ANSWER_VALUE_SET)}`,
    );
  });

  it("propagates preferredTerminologyServer through repeating groups into answer child questions", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "encounters",
          type: "group",
          repeats: true,
          required: true,
          extension: [
            preferredTerminologyServer(
              "https://terminology.example/repeating-group",
            ),
          ],
          item: [
            {
              linkId: "finding",
              text: "Finding",
              type: "string",
              initial: [{ valueString: "existing finding" }],
              item: [
                {
                  linkId: "finding-code",
                  text: "Finding code",
                  type: "coding",
                  answerValueSet: ANSWER_VALUE_SET,
                },
              ],
            },
          ],
        },
      ],
    };

    const html = await render(questionnaire);

    expect(html).toContain("Fallback");
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(
      `https://terminology.example/repeating-group/ValueSet/$expand?url=${encodeURIComponent(ANSWER_VALUE_SET)}`,
    );
  });

  it("uses preferredTerminologyServer entries for unitValueSet expansion", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [
        preferredTerminologyServer("https://terminology.example/units"),
      ],
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [{ url: unitValueSetUrl, valueCanonical: UNIT_VALUE_SET }],
        },
      ],
    };

    const html = await render(questionnaire);

    expect(html).toContain("Fallback");
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(
      `https://terminology.example/units/ValueSet/$expand?url=${encodeURIComponent(UNIT_VALUE_SET)}`,
    );
  });
});
