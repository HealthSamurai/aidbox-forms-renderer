import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "../../../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../../../stores/nodes/questions/question-store.ts";
import { QuantityRenderer } from "../quantity-renderer.tsx";
import { EXT } from "../../../../../../utils.ts";
import type { IQuestionNode } from "../../../../../../types.ts";

function getQuantityQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected quantity question for ${linkId}`);
  }
  return node as IQuestionNode<"quantity">;
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

      const combobox = screen.getByRole("combobox", { name: /dosage/i });
      const mgOption = screen.getByRole("option", {
        name: "mg",
      }) as HTMLOptionElement;

      expect(combobox).toBeInTheDocument();
      expect(mgOption.selected).toBe(false);

      const user = userEvent.setup();
      await user.selectOptions(combobox, mgOption.value);

      expect(mgOption.selected).toBe(true);
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

      const option = screen.getByRole("option", {
        name: "kg",
      }) as HTMLOptionElement;
      expect(option.selected).toBe(true);
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

      const combobox = getByRole("combobox");
      const option = screen.getByRole("option", {
        name: "mL",
      }) as HTMLOptionElement;
      expect(combobox).toHaveValue(option.value);
      const numberInput = screen.getByRole("spinbutton", {
        name: /volume/i,
      }) as HTMLInputElement;
      expect(numberInput.value).toBe("");

      const user = userEvent.setup();
      await user.selectOptions(combobox, "");

      expect(numberInput.value).toBe("");
      expect(combobox).toHaveValue("");
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

      const combobox = screen.getByRole("combobox", { name: /temperature/i });

      const user = userEvent.setup();
      await user.type(numberInput, "37.5");

      expect(numberInput.value).toBe("37.5");
      const option = screen.getByRole("option", {
        name: "°C",
      }) as HTMLOptionElement;
      expect(combobox).toHaveValue(option.value);
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

      const combobox = getByRole("combobox");
      await waitFor(() => expect(combobox).toHaveValue(""));
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

      const { getByRole, queryByRole } = render(
        <QuantityRenderer node={question} />,
      );

      const legacyOption = getByRole("option", {
        name: "mL/day",
        hidden: true,
      }) as HTMLOptionElement;

      expect(legacyOption.disabled).toBe(true);
      expect(legacyOption.selected).toBe(true);

      const combobox = getByRole("combobox");
      const newOption = getByRole("option", {
        name: "mL/hour",
      }) as HTMLOptionElement;
      const user = userEvent.setup();
      await user.selectOptions(combobox, newOption.value);

      expect(
        queryByRole("option", { name: "mL/day", hidden: true }),
      ).toBeNull();
      expect(newOption).toHaveProperty("selected", true);
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

      const { getByRole, queryByRole } = render(
        <QuantityRenderer node={question} />,
      );

      const combobox = getByRole("combobox");
      const newOption = getByRole("option", {
        name: "mL/hour",
      }) as HTMLOptionElement;
      const user = userEvent.setup();
      await user.selectOptions(combobox, newOption.value);
      await user.selectOptions(combobox, "");

      expect(
        queryByRole("option", { name: "mL/day", hidden: true }),
      ).toBeNull();
      const rateInput = screen.getByRole("spinbutton", {
        name: /infusion rate/i,
      }) as HTMLInputElement;
      expect(rateInput.value).toBe("50");
      expect(combobox).toHaveValue("");
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
});
