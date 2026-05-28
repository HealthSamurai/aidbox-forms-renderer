import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import {
  assertDefined,
  OPTIONS_ISSUE_EXPRESSION,
} from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

import {
  makeCqfExpression,
  makeVariable,
} from "../../../../../../../../utilities.ts";

import type { CodingOf, QuestionnaireOf } from "@formbox/renderer";
type Coding = CodingOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;

const ADMINISTRATIVE_GENDER_VALUE_SET =
  "http://hl7.org/fhir/ValueSet/administrative-gender";
const CONTACT_POINT_SYSTEM_VALUE_SET =
  "http://hl7.org/fhir/ValueSet/contact-point-system";

const ADMINISTRATIVE_GENDER_OPTIONS: Coding[] = [
  {
    system: "http://hl7.org/fhir/administrative-gender",
    code: "male",
    display: "Male",
  },
  {
    system: "http://hl7.org/fhir/administrative-gender",
    code: "female",
    display: "Female",
  },
];

const CONTACT_POINT_OPTIONS: Coding[] = [
  {
    system: "http://hl7.org/fhir/contact-point-system",
    code: "phone",
    display: "Phone",
  },
  {
    system: "http://hl7.org/fhir/contact-point-system",
    code: "email",
    display: "Email",
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

describe("answerValueSetExpression", () => {
  const globalWithFetch = globalThis as typeof globalThis & {
    fetch: typeof fetch;
  };
  let originalFetch: typeof fetch;
  let fetchSpy: ReturnType<typeof vi.fn<typeof fetch>>;

  beforeEach(() => {
    const expansionsByCanonical: Record<string, Coding[]> = {
      [ADMINISTRATIVE_GENDER_VALUE_SET]: ADMINISTRATIVE_GENDER_OPTIONS,
      [CONTACT_POINT_SYSTEM_VALUE_SET]: CONTACT_POINT_OPTIONS,
    };

    originalFetch = globalWithFetch.fetch;
    fetchSpy = vi.fn<typeof fetch>().mockImplementation(async (input) => {
      const canonical = getRequestedCanonical(input);
      return buildFetchResponse(expansionsByCanonical[canonical] ?? []);
    });
    globalWithFetch.fetch = fetchSpy;
  });

  afterEach(() => {
    globalWithFetch.fetch = originalFetch;
  });

  it("expands and re-expands answerValueSet when the canonical is expression-driven", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "panel",
          type: "group",
          extension: [
            makeVariable(
              "useContactMethods",
              "%context.item.where(linkId='use-contact-methods').answer.valueBoolean.last()",
            ),
          ],
          item: [
            {
              linkId: "use-contact-methods",
              type: "boolean",
              initial: [{ valueBoolean: false }],
            },
            {
              linkId: "selection",
              type: "coding",
              _answerValueSet: {
                extension: [
                  makeCqfExpression(
                    "iif(%useContactMethods = true, 'http://hl7.org/fhir/ValueSet/contact-point-system', 'http://hl7.org/fhir/ValueSet/administrative-gender')",
                  ),
                ],
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
      undefined,
      undefined,
    );
    const toggle = form.scope.lookupNode("use-contact-methods");
    const selection = form.scope.lookupNode("selection");

    assertQuestionNode<"boolean">(toggle);
    assertQuestionNode<"coding">(selection);

    await waitForValueSetExpansion(selection);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(getRequestedCanonical(fetchSpy.mock.calls[0]?.[0])).toBe(
      ADMINISTRATIVE_GENDER_VALUE_SET,
    );
    expect(
      selection.answerOption.inherentOptions.map(
        (option) => option.value?.code,
      ),
    ).toEqual(["male", "female"]);

    const toggleAnswer = toggle.answers[0];
    assertDefined(toggleAnswer);
    toggleAnswer.setValueByUser(true);

    await waitForValueSetExpansion(selection);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(getRequestedCanonical(fetchSpy.mock.calls[1]?.[0])).toBe(
      CONTACT_POINT_SYSTEM_VALUE_SET,
    );
    expect(
      selection.answerOption.inherentOptions.map(
        (option) => option.value?.code,
      ),
    ).toEqual(["phone", "email"]);
  });

  it("reports an issue when answerValueSetExpression does not resolve to a canonical URL", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "selection",
          type: "coding",
          _answerValueSet: {
            extension: [makeCqfExpression("true")],
          },
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
    const selection = form.scope.lookupNode("selection");

    assertQuestionNode<"coding">(selection);
    await waitForValueSetExpansion(selection);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(selection.answerOption.inherentOptions).toEqual([]);

    const issue = selection.answerOption.issues.find((entry) =>
      entry.diagnostics?.includes("answerValueSetExpression"),
    );
    expect(issue).toBeDefined();
    expect(issue?.expression).toEqual([OPTIONS_ISSUE_EXPRESSION]);
  });
});
