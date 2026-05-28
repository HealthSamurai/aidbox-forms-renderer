import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { QuantityRenderer } from "@formbox/renderer/component/question/fhir/quantity/quantity-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { EXT } from "@formbox/renderer/utilities.ts";

import type {
  QuestionnaireOf,
  QuestionnaireResponseOf,
} from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;
type QuestionnaireResponse = QuestionnaireResponseOf<"r5">;

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

describe("unitOpen", () => {
  it("defaults missing unitOpen to optionsOrString when unit list is absent", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
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
    expect(question.unitOption.effectiveUnitOpen).toBe("optionsOrString");

    render(<QuantityRenderer node={question} />);

    const user = userEvent.setup();
    const combobox = getCombobox(/dose/i);
    await user.click(combobox);
    await user.click(
      within(getListbox(combobox)).getByRole("option", {
        name: en.selection.specifyOther,
      }),
    );

    await user.type(
      screen.getByPlaceholderText(en.inputs.quantityUnitPlaceholder),
      "tablespoon",
    );
    await user.click(screen.getByRole("button", { name: en.dialog.submit }));

    const answer = question.answers[0];
    expect(answer?.value).toEqual({ unit: "tablespoon" });
    expect(getComboboxValue(getCombobox(/dose/i))).toBe("tablespoon");
  });

  it("keeps custom unit entry disabled when unitOpen is optionsOnly and unit list is absent", async () => {
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
              valueCode: "optionsOnly",
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
    expect(question.unitOption.effectiveUnitOpen).toBe("optionsOnly");

    render(<QuantityRenderer node={question} />);

    const user = userEvent.setup();
    const combobox = getCombobox(/dose/i);
    await user.click(combobox);
    const listbox = getListbox(combobox);
    expect(
      within(listbox).queryByRole("option", {
        name: en.selection.specifyOther,
      }),
    ).toBeNull();
  });

  it("allows coded custom unit entry when unitOpen is optionsOrType and unit list is absent", async () => {
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
    expect(question.unitOption.effectiveUnitOpen).toBe("optionsOrType");

    render(<QuantityRenderer node={question} />);

    const user = userEvent.setup();
    const combobox = getCombobox(/dose/i);
    await user.click(combobox);
    await user.click(
      within(getListbox(combobox)).getByRole("option", {
        name: en.selection.specifyOther,
      }),
    );
    await user.type(
      screen.getByPlaceholderText(en.inputs.codingSystemPlaceholder),
      "http://example.org/custom-unit-system",
    );
    await user.type(
      screen.getByPlaceholderText(en.inputs.codingCodePlaceholder),
      "tblsp",
    );
    await user.type(
      screen.getByPlaceholderText(en.inputs.codingDisplayPlaceholder),
      "tablespoon",
    );
    await user.click(screen.getByRole("button", { name: en.dialog.submit }));

    const answer = question.answers[0];
    expect(answer?.value).toEqual({
      system: "http://example.org/custom-unit-system",
      code: "tblsp",
      unit: "tablespoon",
    });
    expect(getComboboxValue(getCombobox(/dose/i))).toBe("tablespoon");
  });

  it("keeps out-of-set response units selectable when unitOpen is optionsOrString", async () => {
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
              url: EXT.QUESTIONNAIRE_UNIT_OPTION,
              valueCoding: {
                system: "http://unitsofmeasure.org",
                code: "g",
                display: "g",
              },
            },
            {
              url: EXT.SDC_UNIT_OPEN,
              valueCode: "optionsOrString",
            },
          ],
          initial: [
            {
              valueQuantity: {
                value: 1,
                unit: "tablespoon",
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

  it("captures custom typed units as system/code/display when unitOpen is optionsOrType", async () => {
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
              url: EXT.QUESTIONNAIRE_UNIT_OPTION,
              valueCoding: {
                system: "http://unitsofmeasure.org",
                code: "g",
                display: "g",
              },
            },
            {
              url: EXT.SDC_UNIT_OPEN,
              valueCode: "optionsOrType",
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
    const listbox = getListbox(combobox);
    await user.click(
      within(listbox).getByRole("option", { name: en.selection.specifyOther }),
    );

    await user.type(
      screen.getByPlaceholderText(en.inputs.codingSystemPlaceholder),
      "http://example.org/custom-unit-system",
    );
    await user.type(
      screen.getByPlaceholderText(en.inputs.codingCodePlaceholder),
      "tblsp",
    );
    await user.type(
      screen.getByPlaceholderText(en.inputs.codingDisplayPlaceholder),
      "tablespoon",
    );
    await user.click(screen.getByRole("button", { name: en.dialog.submit }));

    const answer = question.answers[0];
    expect(answer?.value).toEqual({
      system: "http://example.org/custom-unit-system",
      code: "tblsp",
      unit: "tablespoon",
    });
    expect(getComboboxValue(getCombobox(/dose/i))).toBe("tablespoon");
  });

  it("keeps submitted custom unit selectable after switching to predefined option", async () => {
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
              url: EXT.QUESTIONNAIRE_UNIT_OPTION,
              valueCoding: {
                system: "http://unitsofmeasure.org",
                code: "g",
                display: "g",
              },
            },
            {
              url: EXT.SDC_UNIT_OPEN,
              valueCode: "optionsOrString",
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
    const listbox = getListbox(combobox);
    await user.click(
      within(listbox).getByRole("option", { name: en.selection.specifyOther }),
    );

    await user.type(
      screen.getByPlaceholderText(en.inputs.quantityUnitPlaceholder),
      "tablespoon",
    );
    await user.click(screen.getByRole("button", { name: en.dialog.submit }));
    expect(getComboboxValue(getCombobox(/dose/i))).toBe("tablespoon");

    await user.click(getCombobox(/dose/i));
    await user.click(
      within(getListbox(getCombobox(/dose/i))).getByRole("option", {
        name: "mg",
      }),
    );
    expect(getComboboxValue(getCombobox(/dose/i))).toBe("mg");

    await user.click(getCombobox(/dose/i));
    const refreshedListbox = getListbox(getCombobox(/dose/i));
    const customOption = within(refreshedListbox).getByRole("option", {
      name: "tablespoon",
    }) as HTMLButtonElement;
    expect(customOption).not.toBeDisabled();
  });

  it("remembers existing custom response unit when switching to predefined option", async () => {
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
              url: EXT.QUESTIONNAIRE_UNIT_OPTION,
              valueCoding: {
                system: "http://unitsofmeasure.org",
                code: "g",
                display: "g",
              },
            },
            {
              url: EXT.SDC_UNIT_OPEN,
              valueCode: "optionsOrString",
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
          linkId: "dose",
          answer: [
            {
              valueQuantity: {
                value: 1,
                unit: "tablespoon",
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
    const question = getQuantityQuestion(form, "dose");
    render(<QuantityRenderer node={question} />);

    const user = userEvent.setup();
    expect(getComboboxValue(getCombobox(/dose/i))).toBe("tablespoon");

    await user.click(getCombobox(/dose/i));
    await user.click(
      within(getListbox(getCombobox(/dose/i))).getByRole("option", {
        name: "mg",
      }),
    );
    expect(getComboboxValue(getCombobox(/dose/i))).toBe("mg");

    await user.click(getCombobox(/dose/i));
    const refreshedListbox = getListbox(getCombobox(/dose/i));
    const customOption = within(refreshedListbox).getByRole("option", {
      name: "tablespoon",
    }) as HTMLButtonElement;
    expect(customOption).not.toBeDisabled();
  });

  it("opens blank custom unit form when switching from predefined option", async () => {
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
              url: EXT.QUESTIONNAIRE_UNIT_OPTION,
              valueCoding: {
                system: "http://unitsofmeasure.org",
                code: "g",
                display: "g",
              },
            },
            {
              url: EXT.SDC_UNIT_OPEN,
              valueCode: "optionsOrString",
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
    await user.click(getCombobox(/dose/i));
    await user.click(
      within(getListbox(getCombobox(/dose/i))).getByRole("option", {
        name: "mg",
      }),
    );
    expect(getComboboxValue(getCombobox(/dose/i))).toBe("mg");

    await user.click(getCombobox(/dose/i));
    await user.click(
      within(getListbox(getCombobox(/dose/i))).getByRole("option", {
        name: en.selection.specifyOther,
      }),
    );

    const customUnitInput = screen.getByPlaceholderText(
      en.inputs.quantityUnitPlaceholder,
    ) as HTMLInputElement;
    expect(customUnitInput.value).toBe("");
  });
});
