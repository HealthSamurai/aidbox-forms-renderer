import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { QuantityRenderer } from "@formbox/renderer/component/question/fhir/quantity/quantity-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { EXT } from "@formbox/renderer/utilities.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

const UCUM_SYSTEM = "http://unitsofmeasure.org";
const CUSTOM_SYSTEM = "http://example.org/custom";

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

function buildQuestionnaire(initialSystem: string): Questionnaire {
  return {
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
              system: UCUM_SYSTEM,
              code: "mg",
              display: "mg",
            },
          },
          {
            url: EXT.SDC_UNIT_OPEN,
            valueCode: "optionsOrType",
          },
          {
            url: EXT.SDC_UNIT_SUPPLEMENTAL_SYSTEM,
            valueCanonical: UCUM_SYSTEM,
          },
        ],
        initial: [
          {
            valueQuantity: {
              value: 1,
              system: initialSystem,
              code: "tblsp",
              unit: "tablespoon",
            },
          },
        ],
      },
    ],
  };
}

describe("unitSupplementalSystem", () => {
  it("treats off-list initial quantity as legacy when system does not match", async () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      buildQuestionnaire(CUSTOM_SYSTEM),
      undefined,
      undefined,
    );
    const question = getQuantityQuestion(form, "dose");

    expect(question.unitOption.supplementalSystem).toBe(UCUM_SYSTEM);

    render(<QuantityRenderer node={question} />);

    const combobox = getCombobox(/dose/i);
    expect(getComboboxValue(combobox)).toBe("tablespoon");

    const user = userEvent.setup();
    await user.click(combobox);

    const listbox = getListbox(combobox);
    const legacyOption = within(listbox).getByRole("option", {
      name: "tablespoon",
    }) as HTMLButtonElement;

    expect(legacyOption).toBeDisabled();
  });

  it("treats off-list initial quantity as custom when system matches", async () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      buildQuestionnaire(UCUM_SYSTEM),
      undefined,
      undefined,
    );
    const question = getQuantityQuestion(form, "dose");

    render(<QuantityRenderer node={question} />);

    const combobox = getCombobox(/dose/i);
    expect(getComboboxValue(combobox)).toBe("tablespoon");

    const user = userEvent.setup();
    await user.click(combobox);

    const listbox = getListbox(combobox);
    const customOption = within(listbox).getByRole("option", {
      name: "tablespoon",
    }) as HTMLButtonElement;

    expect(customOption).not.toBeDisabled();
  });

  it("allows submitting typed custom coding only when system matches supplemental system", async () => {
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
              url: EXT.SDC_UNIT_OPEN,
              valueCode: "optionsOrType",
            },
            {
              url: EXT.SDC_UNIT_SUPPLEMENTAL_SYSTEM,
              valueCanonical: UCUM_SYSTEM,
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

    render(<QuantityRenderer node={question} />);

    const user = userEvent.setup();
    const combobox = getCombobox(/dose/i);
    await user.click(combobox);
    await user.click(
      within(getListbox(combobox)).getByRole("option", {
        name: en.selection.specifyOther,
      }),
    );

    const systemInput = screen.getByPlaceholderText(
      en.inputs.codingSystemPlaceholder,
    ) as HTMLInputElement;
    const codeInput = screen.getByPlaceholderText(
      en.inputs.codingCodePlaceholder,
    ) as HTMLInputElement;
    const displayInput = screen.getByPlaceholderText(
      en.inputs.codingDisplayPlaceholder,
    ) as HTMLInputElement;
    expect(systemInput).toBeDisabled();
    expect(systemInput.value).toBe(UCUM_SYSTEM);

    const submitButton = screen.getByRole("button", {
      name: en.dialog.submit,
    }) as HTMLButtonElement;

    expect(submitButton).toBeDisabled();

    await user.type(codeInput, "tblsp");
    await user.type(displayInput, "tablespoon");

    expect(submitButton).not.toBeDisabled();

    await user.click(submitButton);

    const answer = question.answers[0];
    expect(answer?.value).toEqual({
      system: UCUM_SYSTEM,
      code: "tblsp",
      unit: "tablespoon",
    });
  });
});
