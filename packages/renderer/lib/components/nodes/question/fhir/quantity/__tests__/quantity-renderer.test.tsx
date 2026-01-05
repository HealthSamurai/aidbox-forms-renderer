import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../../../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../../../stores/nodes/questions/question-store.ts";
import { QuantityRenderer } from "../quantity-renderer.tsx";
import { EXT } from "../../../../../../utils.ts";
import type { IQuestionNode } from "../../../../../../types.ts";
import { strings } from "../../../../../../strings.ts";

function getQuantityQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected quantity question for ${linkId}`);
  }
  return node as IQuestionNode<"quantity">;
}

function getListbox(input: HTMLElement) {
  const listboxId = input.getAttribute("aria-controls");
  expect(listboxId).toBeTruthy();
  const listbox = document.getElementById(listboxId!);
  expect(listbox).not.toBeNull();
  return listbox as HTMLElement;
}

function getCombobox(label: string | RegExp) {
  return screen.getByRole("combobox", { name: label }) as HTMLElement;
}

function getComboboxValue(combobox: HTMLElement) {
  if (
    combobox instanceof HTMLInputElement ||
    combobox instanceof HTMLTextAreaElement
  ) {
    return combobox.value;
  }
  return combobox.textContent?.trim() ?? "";
}

async function selectComboboxOption(
  user: ReturnType<typeof userEvent.setup>,
  input: HTMLElement,
  optionLabel: string,
) {
  await user.click(input);
  const listbox = getListbox(input);
  const option = within(listbox).getByRole("option", {
    name: optionLabel,
  });
  await user.click(option);
  return option;
}

afterEach(cleanup);

describe("quantity-renderer", () => {
  describe("unit options", () => {
    it("renders a unit select when unit options are provided", async () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "dosage",
            text: "Dosage",
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
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getQuantityQuestion(form, "dosage");

      render(<QuantityRenderer node={question} />);

      const combobox = getCombobox(/dosage/i);
      const user = userEvent.setup();

      expect(combobox).toBeInTheDocument();
      expect(getComboboxValue(combobox)).toBe(
        strings.selection.selectPlaceholder,
      );

      await selectComboboxOption(user, combobox, "mg");

      expect(getComboboxValue(getCombobox(/dosage/i))).toBe("mg");
    });

    it("preselects the matching unit from the response", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "weight",
            text: "Weight",
            type: "quantity",
            extension: [
              {
                url: EXT.QUESTIONNAIRE_UNIT_OPTION,
                valueCoding: {
                  system: "http://unitsofmeasure.org",
                  code: "kg",
                  display: "kg",
                },
              },
            ],
          },
        ],
      };

      const response: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        questionnaire: "#questionnaire",
        status: "in-progress",
        item: [
          {
            linkId: "weight",
            answer: [
              {
                valueQuantity: {
                  value: 68,
                  unit: "kg",
                  code: "kg",
                  system: "http://unitsofmeasure.org",
                },
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire, response);
      const question = getQuantityQuestion(form, "weight");

      render(<QuantityRenderer node={question} />);

      const combobox = getCombobox(/weight/i);
      expect(getComboboxValue(combobox)).toBe("kg");
    });

    it("auto selects the single unit option", async () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "volume",
            text: "Volume",
            type: "quantity",
            extension: [
              {
                url: EXT.QUESTIONNAIRE_UNIT_OPTION,
                valueCoding: {
                  system: "http://unitsofmeasure.org",
                  code: "ml",
                  display: "mL",
                },
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getQuantityQuestion(form, "volume");

      const { getByRole } = render(<QuantityRenderer node={question} />);

      const combobox = getByRole("combobox") as HTMLElement;
      expect(getComboboxValue(combobox)).toBe("mL");
      const numberInput = screen.getByRole("spinbutton", {
        name: /volume/i,
      }) as HTMLInputElement;
      expect(numberInput.value).toBe("");

      const user = userEvent.setup();
      const clearButton = combobox.parentElement?.querySelector(
        "button[aria-label='Clear']",
      ) as HTMLButtonElement | null;
      expect(clearButton).not.toBeNull();
      await user.click(clearButton as HTMLButtonElement);

      expect(numberInput.value).toBe("");
      await waitFor(() =>
        expect(getComboboxValue(getByRole("combobox") as HTMLElement)).toBe(
          strings.selection.selectPlaceholder,
        ),
      );
    });

    it("applies the single unit once the user types a value", async () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "temp",
            text: "Temperature",
            type: "quantity",
            extension: [
              {
                url: EXT.QUESTIONNAIRE_UNIT_OPTION,
                valueCoding: {
                  system: "http://unitsofmeasure.org",
                  code: "Cel",
                  display: "°C",
                },
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getQuantityQuestion(form, "temp");

      const { container } = render(<QuantityRenderer node={question} />);

      const numberInput = container.querySelector(
        "input[type='number']",
      ) as HTMLInputElement;
      expect(numberInput).toBeTruthy();
      if (!numberInput) return;

      const combobox = getCombobox(/temperature/i);

      const user = userEvent.setup();
      await user.type(numberInput, "37.5");

      expect(numberInput.value).toBe("37.5");
      await waitFor(() =>
        expect(getComboboxValue(getCombobox(/temperature/i))).toBe("°C"),
      );
    });

    it("does not auto select when value is prepopulated", async () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "temp",
            text: "Temperature",
            type: "quantity",
            extension: [
              {
                url: EXT.QUESTIONNAIRE_UNIT_OPTION,
                valueCoding: {
                  system: "http://unitsofmeasure.org",
                  code: "Cel",
                  display: "°C",
                },
              },
            ],
            initial: [
              {
                valueQuantity: {
                  value: 39,
                },
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getQuantityQuestion(form, "temp");

      const { getByRole } = render(<QuantityRenderer node={question} />);

      const combobox = getByRole("combobox") as HTMLElement;
      await waitFor(() =>
        expect(getComboboxValue(combobox)).toBe(
          strings.selection.selectPlaceholder,
        ),
      );
      const tempInput = screen.getByRole("spinbutton", {
        name: /temperature/i,
      }) as HTMLInputElement;
      expect(tempInput.value).toBe("39");
    });

    it("shows a disabled option for legacy units until a new selection is made", async () => {
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
                url: EXT.QUESTIONNAIRE_UNIT_OPTION,
                valueCoding: {
                  system: "http://unitsofmeasure.org",
                  code: "mL/h",
                  display: "mL/hour",
                },
              },
              {
                url: EXT.QUESTIONNAIRE_UNIT_OPTION,
                valueCoding: {
                  system: "http://unitsofmeasure.org",
                  code: "L/h",
                  display: "L/hour",
                },
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

      const form = new FormStore(questionnaire, response);
      const question = getQuantityQuestion(form, "rate");

      const { getByRole } = render(<QuantityRenderer node={question} />);

      const combobox = getByRole("combobox") as HTMLElement;
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

      const refreshedCombobox = getByRole("combobox") as HTMLElement;
      fireEvent.click(refreshedCombobox);
      const refreshedListbox = getListbox(refreshedCombobox);
      expect(
        within(refreshedListbox).queryByRole("option", {
          name: "mL/day",
        }),
      ).toBeNull();
      expect(
        within(refreshedListbox).getByRole("option", { name: "mL/hour" }),
      ).toHaveAttribute("aria-selected", "true");
    });

    it("does not reintroduce the legacy fallback after clearing a new selection", async () => {
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
                url: EXT.QUESTIONNAIRE_UNIT_OPTION,
                valueCoding: {
                  system: "http://unitsofmeasure.org",
                  code: "mL/h",
                  display: "mL/hour",
                },
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
                  value: 50,
                  unit: "mL/day",
                },
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire, response);
      const question = getQuantityQuestion(form, "rate");

      const { getByRole } = render(<QuantityRenderer node={question} />);

      const combobox = getByRole("combobox") as HTMLElement;
      const user = userEvent.setup();
      await selectComboboxOption(user, combobox, "mL/hour");
      const selectedCombobox = getByRole("combobox") as HTMLElement;
      const clearButton = selectedCombobox.parentElement?.querySelector(
        "button[aria-label='Clear']",
      ) as HTMLButtonElement | null;
      expect(clearButton).not.toBeNull();
      await user.click(clearButton as HTMLButtonElement);

      const clearedCombobox = getByRole("combobox") as HTMLElement;
      fireEvent.click(clearedCombobox);
      const listbox = getListbox(clearedCombobox);
      expect(
        within(listbox).queryByRole("option", { name: "mL/day" }),
      ).toBeNull();
      const rateInput = screen.getByRole("spinbutton", {
        name: /infusion rate/i,
      }) as HTMLInputElement;
      expect(rateInput.value).toBe("50");
      await waitFor(() =>
        expect(getComboboxValue(getByRole("combobox") as HTMLElement)).toBe(
          strings.selection.selectPlaceholder,
        ),
      );
    });

    it("keeps free-form unit entry as text when no unit options are provided", async () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "volume",
            text: "Volume",
            type: "quantity",
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getQuantityQuestion(form, "volume");

      const { container } = render(<QuantityRenderer node={question} />);

      expect(container.querySelector("select")).toBeNull();

      const unitInput = container.querySelector(
        "input[placeholder='unit']",
      ) as HTMLInputElement;
      expect(unitInput).toBeTruthy();
      if (!unitInput) return;

      const user = userEvent.setup();
      await user.type(unitInput, "fl oz");

      expect(unitInput).toHaveValue("fl oz");
    });
  });

  describe("constraints", () => {
    it("applies min and max quantity values as input attributes", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "weight",
            text: "Weight",
            type: "quantity",
            extension: [
              {
                url: EXT.SDC_MIN_QUANTITY,
                valueQuantity: {
                  value: 40,
                  unit: "kg",
                },
              },
              {
                url: EXT.SDC_MAX_QUANTITY,
                valueQuantity: {
                  value: 200,
                  unit: "kg",
                },
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = getQuantityQuestion(form, "weight");

      render(<QuantityRenderer node={question} />);

      const input = screen.getByRole("spinbutton", {
        name: /weight/i,
      }) as HTMLInputElement;
      expect(input).toHaveAttribute("min", "40");
      expect(input).toHaveAttribute("max", "200");
    });
  });
});
