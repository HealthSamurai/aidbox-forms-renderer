import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { QuantityRenderer } from "@formbox/renderer/component/question/fhir/quantity/quantity-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import {
  assertDefined,
  EXT,
  OPTIONS_ISSUE_EXPRESSION,
} from "@formbox/renderer/utilities.ts";

import type {
  CodingOf,
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/renderer";
type Coding = CodingOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;

const AGE_UNITS_VALUE_SET = "http://hl7.org/fhir/ValueSet/age-units";
const DOSE_UNITS_VALUE_SET = "http://example.org/fhir/ValueSet/dose-units";
const RATE_UNITS_VALUE_SET = "http://example.org/fhir/ValueSet/rate-units";

const AGE_UNIT_OPTIONS: Coding[] = [
  {
    system: "http://unitsofmeasure.org",
    code: "a",
    display: "years",
  },
  {
    system: "http://unitsofmeasure.org",
    code: "mo",
    display: "months",
  },
];

const DOSE_UNIT_OPTIONS: Coding[] = [
  {
    system: "http://unitsofmeasure.org",
    code: "mg",
    display: "mg",
  },
  {
    system: "http://unitsofmeasure.org",
    code: "g",
    display: "g",
  },
];

const RATE_UNIT_OPTIONS: Coding[] = [
  {
    system: "http://unitsofmeasure.org",
    code: "mL/h",
    display: "mL/hour",
  },
  {
    system: "http://unitsofmeasure.org",
    code: "L/h",
    display: "L/hour",
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

const buildFetchErrorResponse = (status = 500, statusText = "Server Error") =>
  ({
    ok: false,
    status,
    statusText,
    json: () => Promise.resolve({}),
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

async function waitForUnitValueSetExpansion(
  question: IQuestionNode<"quantity">,
): Promise<void> {
  for (let index = 0; index < 25; index += 1) {
    if (!question.unitOption.isLoading) {
      return;
    }
    await Promise.resolve();
  }
}

function getQuantityQuestion(
  form: FormStore,
  linkId: string,
): IQuestionNode<"quantity"> {
  const node = form.scope.lookupNode(linkId);
  assertQuestionNode<"quantity">(node);
  return node;
}

function getCombobox(label: string | RegExp): HTMLElement {
  return screen.getByRole("combobox", { name: label }) as HTMLElement;
}

function getComboboxValue(combobox: HTMLElement): string {
  if (
    combobox instanceof HTMLInputElement ||
    combobox instanceof HTMLTextAreaElement
  ) {
    return combobox.value;
  }
  return combobox.textContent?.trim() ?? "";
}

function getListbox(input: HTMLElement): HTMLElement {
  const listboxId = input.getAttribute("aria-controls");
  expect(listboxId).toBeTruthy();
  const listbox = document.querySelector<HTMLElement>(
    `#${CSS.escape(listboxId!)}`,
  );
  expect(listbox).not.toBeNull();
  return listbox as HTMLElement;
}

describe("unitValueSet", () => {
  it("expands questionnaire-unitValueSet into quantity unit options", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input) => {
        const canonical = getRequestedCanonical(input);
        return buildFetchResponse(
          canonical === AGE_UNITS_VALUE_SET ? AGE_UNIT_OPTIONS : [],
        );
      });

    try {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "age",
            text: "Age",
            type: "quantity",
            extension: [
              {
                url: EXT.QUESTIONNAIRE_UNIT_VALUE_SET,
                valueCanonical: AGE_UNITS_VALUE_SET,
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
      const question = getQuantityQuestion(form, "age");
      await waitForUnitValueSetExpansion(question);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(getRequestedCanonical(fetchSpy.mock.calls[0]?.[0])).toBe(
        AGE_UNITS_VALUE_SET,
      );
      expect(question.unitOption.options.map((coding) => coding.code)).toEqual([
        "a",
        "mo",
      ]);

      const answer = question.answers[0];
      assertDefined(answer);
      expect(answer.quantity.unitSelection.specifyOtherToken).toBeUndefined();

      render(<QuantityRenderer node={question} />);

      const combobox = getCombobox(/age/i);
      expect(getComboboxValue(combobox)).toBe(en.selection.selectPlaceholder);

      const user = userEvent.setup();
      await user.click(combobox);
      const listbox = getListbox(combobox);
      await user.click(within(listbox).getByRole("option", { name: "months" }));
      expect(getComboboxValue(getCombobox(/age/i))).toBe("months");
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("prefers unitValueSet over unitOption when both are present", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input) => {
        const canonical = getRequestedCanonical(input);
        return buildFetchResponse(
          canonical === DOSE_UNITS_VALUE_SET ? DOSE_UNIT_OPTIONS : [],
        );
      });

    try {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "dose",
            text: "Dose",
            type: "quantity",
            extension: [
              {
                url: EXT.QUESTIONNAIRE_UNIT_OPTION,
                valueCoding: {
                  system: "http://unitsofmeasure.org",
                  code: "mg",
                  display: "mg",
                },
              },
              {
                url: EXT.QUESTIONNAIRE_UNIT_VALUE_SET,
                valueCanonical: DOSE_UNITS_VALUE_SET,
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
      const question = getQuantityQuestion(form, "dose");
      await waitForUnitValueSetExpansion(question);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(getRequestedCanonical(fetchSpy.mock.calls[0]?.[0])).toBe(
        DOSE_UNITS_VALUE_SET,
      );
      expect(question.unitOption.options.map((coding) => coding.code)).toEqual([
        "mg",
        "g",
      ]);
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("reports an options issue when unitValueSet expansion fails", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => buildFetchErrorResponse());

    try {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "failed-units",
            text: "Failed units",
            type: "quantity",
            extension: [
              {
                url: EXT.QUESTIONNAIRE_UNIT_VALUE_SET,
                valueCanonical: DOSE_UNITS_VALUE_SET,
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
      const question = getQuantityQuestion(form, "failed-units");
      await waitForUnitValueSetExpansion(question);

      expect(question.unitOption.options).toEqual([]);

      const issue = question.issues.find(
        (entry) => entry.expression?.[0] === OPTIONS_ISSUE_EXPRESSION,
      );
      expect(issue).toBeDefined();
      expect(issue?.diagnostics).toContain("Failed to expand ValueSet");

      const answer = question.answers[0];
      assertDefined(answer);
      expect(answer.quantity.unitSelection.specifyOtherToken).toBeUndefined();
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("keeps legacy response unit visible when unitValueSet expansion fails", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => buildFetchErrorResponse());

    try {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "rate",
            text: "Infusion rate",
            type: "quantity",
            extension: [
              {
                url: EXT.QUESTIONNAIRE_UNIT_VALUE_SET,
                valueCanonical: RATE_UNITS_VALUE_SET,
              },
            ],
          },
        ],
      };

      const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#Q",
        status: "in-progress",
        item: [
          {
            linkId: "rate",
            answer: [
              {
                valueQuantity: {
                  value: 125,
                  system: "http://unitsofmeasure.org",
                  code: "mL/d",
                  unit: "mL/day",
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
      const question = getQuantityQuestion(form, "rate");
      await waitForUnitValueSetExpansion(question);

      render(<QuantityRenderer node={question} />);

      const combobox = getCombobox(/infusion rate/i);
      expect(getComboboxValue(combobox)).toBe("mL/day");

      const user = userEvent.setup();
      await user.click(combobox);
      const listbox = getListbox(combobox);
      const legacyOption = within(listbox).getByRole("option", {
        name: "mL/day",
      }) as HTMLButtonElement;
      expect(legacyOption).toBeDisabled();
      expect(legacyOption).toHaveAttribute("aria-selected", "true");
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it("shows legacy response unit as disabled fallback when not in unitValueSet", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input) => {
        const canonical = getRequestedCanonical(input);
        return buildFetchResponse(
          canonical === RATE_UNITS_VALUE_SET ? RATE_UNIT_OPTIONS : [],
        );
      });

    try {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "rate",
            text: "Infusion rate",
            type: "quantity",
            extension: [
              {
                url: EXT.QUESTIONNAIRE_UNIT_VALUE_SET,
                valueCanonical: RATE_UNITS_VALUE_SET,
              },
            ],
          },
        ],
      };

      const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#Q",
        status: "in-progress",
        item: [
          {
            linkId: "rate",
            answer: [
              {
                valueQuantity: {
                  value: 125,
                  system: "http://unitsofmeasure.org",
                  code: "mL/d",
                  unit: "mL/day",
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
      const question = getQuantityQuestion(form, "rate");
      await waitForUnitValueSetExpansion(question);

      render(<QuantityRenderer node={question} />);

      const combobox = getCombobox(/infusion rate/i);
      expect(getComboboxValue(combobox)).toBe("mL/day");

      const user = userEvent.setup();
      await user.click(combobox);
      const listbox = getListbox(combobox);
      const legacyOption = within(listbox).getByRole("option", {
        name: "mL/day",
      }) as HTMLButtonElement;
      expect(legacyOption).toBeDisabled();
      expect(legacyOption).toHaveAttribute("aria-selected", "true");

      await user.click(
        within(listbox).getByRole("option", { name: "mL/hour" }),
      );

      const refreshedCombobox = getCombobox(/infusion rate/i);
      fireEvent.click(refreshedCombobox);
      const refreshedListbox = getListbox(refreshedCombobox);
      expect(
        within(refreshedListbox).queryByRole("option", {
          name: "mL/day",
        }),
      ).toBeNull();
    } finally {
      fetchSpy.mockRestore();
    }
  });
});
