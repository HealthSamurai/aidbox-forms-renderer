import { describe, expect, it } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  Questionnaire,
  QuestionnaireItemAnswerOption,
  QuestionnaireResponse,
} from "fhir/r5";

import { FormStore } from "../../../../../stores/form/form-store.ts";
import { isQuestionNode } from "../../../../../stores/nodes/questions/question-store.ts";
import type { AnswerType, IQuestionNode } from "../../../../../types.ts";
import { EXT } from "../../../../../utils.ts";
import { strings } from "../../../../../strings.ts";
import { DropdownSelectRenderer } from "../dropdown-select-renderer.tsx";
import { VALUE_DISPLAY_BY_TYPE } from "../../fhir/index.ts";

function getQuestion<T extends AnswerType>(
  form: FormStore,
  linkId: string,
): IQuestionNode<T> {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected question node for ${linkId}`);
  }
  return node as IQuestionNode<T>;
}

function getStringAnswers(question: IQuestionNode<AnswerType>) {
  return question.answers
    .map((answer) => answer.value)
    .filter((value): value is string => typeof value === "string");
}

function getAnswerValues(question: IQuestionNode<AnswerType>) {
  return question.answers.map((answer) => answer.value);
}

function getCombobox(label: string) {
  return screen.getByRole("combobox", {
    name: label,
  }) as HTMLElement;
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

function getListbox(input: HTMLElement) {
  const listboxId = input.getAttribute("aria-controls");
  expect(listboxId).toBeTruthy();
  const listbox = document.getElementById(listboxId!);
  expect(listbox).not.toBeNull();
  return listbox as HTMLElement;
}

function selectOption(label: string, optionLabel: string | RegExp) {
  const input = getCombobox(label);
  fireEvent.click(input);
  const listbox = getListbox(input);
  const option = within(listbox).getByRole("option", {
    name: optionLabel,
  }) as HTMLButtonElement;
  fireEvent.click(option);
  return option;
}

function getChipButton(label: string) {
  const buttons = screen.getAllByRole("button", { name: "Remove" });
  const match = buttons.find((button) => within(button).queryByText(label));
  expect(match).toBeDefined();
  return match as HTMLDivElement;
}

describe("dropdown-select-renderer", () => {
  describe("optionsOnly", () => {
    describe("single (select)", () => {
      it("renders a disabled legacy option for response values outside the options list", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "color",
              text: "Favorite color",
              type: "string",
              answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
            },
          ],
        };

        const response: QuestionnaireResponse = {
          resourceType: "QuestionnaireResponse",
          questionnaire: "#Q",
          status: "in-progress",
          item: [
            {
              linkId: "color",
              answer: [{ valueString: "Green" }],
            },
          ],
        };

        const form = new FormStore(questionnaire, response);
        const question = getQuestion(form, "color");

        render(<DropdownSelectRenderer node={question} />);

        const input = getCombobox("Favorite color");
        fireEvent.click(input);
        const listbox = getListbox(input);
        const legacy = within(listbox).getByRole("option", {
          name: "Green",
        }) as HTMLButtonElement;

        expect(legacy).toHaveAttribute("aria-selected", "true");
        expect(legacy).toBeDisabled();
        expect(
          within(listbox).getByRole("option", { name: "Red" }),
        ).not.toBeDisabled();
        expect(
          within(listbox).getByRole("option", { name: "Blue" }),
        ).not.toBeDisabled();
        expect(
          within(listbox).queryByRole("option", {
            name: /specify other/i,
          }),
        ).toBeNull();
      });

      it("filters options by search query", async () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "call-sign",
              text: "Call sign",
              type: "string",
              answerOption: [
                { valueString: "Alpha" },
                { valueString: "Bravo" },
                { valueString: "Charlie" },
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "call-sign");

        render(<DropdownSelectRenderer node={question} />);

        const input = getCombobox("Call sign");
        const user = userEvent.setup();
        await user.click(input);
        const searchInput = getCombobox("Call sign");
        let listbox = getListbox(searchInput);
        expect(
          within(listbox).getByRole("option", { name: "Alpha" }),
        ).toBeInTheDocument();
        expect(
          within(listbox).getByRole("option", { name: "Bravo" }),
        ).toBeInTheDocument();
        expect(
          within(listbox).getByRole("option", { name: "Charlie" }),
        ).toBeInTheDocument();

        await user.type(searchInput, "br");
        expect(searchInput).toHaveValue("br");
        listbox = getListbox(searchInput);
        await waitFor(() => {
          const optionLabels = within(listbox)
            .getAllByRole("option")
            .map((option) => option.textContent ?? "");
          expect(optionLabels).toEqual(["Bravo"]);
        });

        fireEvent.click(within(listbox).getByRole("option", { name: "Bravo" }));
        expect(getStringAnswers(question)).toEqual(["Bravo"]);
        expect(getComboboxValue(getCombobox("Call sign"))).toBe("Bravo");
      });

      it("renders a disabled select when readOnly and no answers", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "color",
              text: "Favorite color",
              type: "string",
              readOnly: true,
              answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "color");

        render(<DropdownSelectRenderer node={question} />);

        const input = getCombobox("Favorite color");
        expect(input).toHaveAttribute("aria-disabled", "true");
        expect(getComboboxValue(input)).toBe(
          strings.selection.selectPlaceholder,
        );
      });
    });

    describe("multi (multi-select)", () => {
      it("prevents removing the last answer when minOccurs is reached", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "color",
              text: "Favorite color",
              type: "string",
              repeats: true,
              answerConstraint: "optionsOnly",
              extension: [{ url: EXT.MIN_OCCURS, valueInteger: 1 }],
              answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "color");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Favorite color", "Red");

        const remove = getChipButton("Red");
        expect(remove).toHaveAttribute("aria-disabled", "true");

        selectOption("Favorite color", "Blue");
        screen.getAllByRole("button", { name: "Remove" }).forEach((button) => {
          expect(button).not.toHaveAttribute("aria-disabled", "true");
        });
      });

      it("renders legacy selections as chips for repeating answers", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "call-sign",
              text: "Call sign",
              type: "string",
              repeats: true,
              answerConstraint: "optionsOnly",
              answerOption: [
                { valueString: "Alpha" },
                { valueString: "Bravo" },
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
              linkId: "call-sign",
              answer: [{ valueString: "Alpha" }, { valueString: "Zulu" }],
            },
          ],
        };

        const form = new FormStore(questionnaire, response);
        const question = getQuestion(form, "call-sign");

        render(<DropdownSelectRenderer node={question} />);

        const input = getCombobox("Call sign");
        fireEvent.click(input);
        const listbox = getListbox(input);
        expect(
          within(listbox).queryByRole("option", { name: "Alpha" }),
        ).toBeNull();
        expect(
          within(listbox).getByRole("option", { name: "Bravo" }),
        ).toBeInTheDocument();
        expect(
          within(listbox).queryByRole("option", { name: "Zulu" }),
        ).toBeNull();
        expect(screen.getByText("Zulu")).toBeInTheDocument();
        expect(getChipButton("Alpha")).toBeInTheDocument();
        expect(getChipButton("Zulu")).toBeInTheDocument();
        expect(
          within(listbox).queryByRole("option", { name: /specify other/i }),
        ).toBeNull();
        expect(getStringAnswers(question).sort()).toEqual(["Alpha", "Zulu"]);
      });
    });
  });

  describe("optionsOrString", () => {
    describe("single (select)", () => {
      it("renders custom string answers with string display for open-choice quantities", () => {
        const originalString = VALUE_DISPLAY_BY_TYPE.string;
        const originalQuantity = VALUE_DISPLAY_BY_TYPE.quantity;

        try {
          VALUE_DISPLAY_BY_TYPE.string = ({ value }) => (
            <>String: {String(value)}</>
          );
          VALUE_DISPLAY_BY_TYPE.quantity = ({ value }) => (
            <>
              Quantity: {value.value} {value.unit}
            </>
          );

          const questionnaire: Questionnaire = {
            resourceType: "Questionnaire",
            status: "active",
            item: [
              {
                linkId: "dose",
                text: "Dose",
                type: "quantity",
                answerConstraint: "optionsOrString",
                answerOption: [
                  {
                    valueQuantity: { value: 1, unit: "mg" },
                  } as QuestionnaireItemAnswerOption,
                ],
              },
            ],
          };

          const form = new FormStore(questionnaire);
          const question = getQuestion(form, "dose");

          render(<DropdownSelectRenderer node={question} />);

          selectOption("Dose", /specify other/i);
          const customInput = screen.getByRole("textbox", {
            name: "Dose",
          }) as HTMLInputElement;
          fireEvent.change(customInput, { target: { value: "custom-dose" } });
          fireEvent.click(screen.getByRole("button", { name: "Add" }));

          expect(screen.getByText("String: custom-dose")).toBeInTheDocument();
          expect(screen.queryByText("Quantity: custom-dose")).toBeNull();

          const input = getCombobox("Dose");
          fireEvent.click(input);
          const listbox = getListbox(input);
          expect(
            within(listbox).getByRole("option", {
              name: "Quantity: 1 mg",
            }),
          ).toBeInTheDocument();
        } finally {
          VALUE_DISPLAY_BY_TYPE.string = originalString;
          VALUE_DISPLAY_BY_TYPE.quantity = originalQuantity;
        }
      });

      it("shows the custom value and opens the custom input on specify other", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "color",
              text: "Favorite color",
              type: "string",
              answerConstraint: "optionsOrString",
              answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
            },
          ],
        };

        const response: QuestionnaireResponse = {
          resourceType: "QuestionnaireResponse",
          questionnaire: "#Q",
          status: "in-progress",
          item: [
            {
              linkId: "color",
              answer: [{ valueString: "Green" }],
            },
          ],
        };

        const form = new FormStore(questionnaire, response);
        const question = getQuestion(form, "color");

        render(<DropdownSelectRenderer node={question} />);

        const input = getCombobox("Favorite color");
        expect(getComboboxValue(input)).toBe("Green");
        expect(
          screen.queryByRole("textbox", { name: "Favorite color" }),
        ).toBeNull();

        selectOption("Favorite color", /specify other/i);
        const customInput = screen.getByRole("textbox", {
          name: "Favorite color",
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");
        const cancelButton = screen.getByRole("button", { name: "Cancel" });
        const addButton = screen.getByRole("button", { name: "Add" });
        expect(cancelButton).not.toBeDisabled();
        expect(addButton).toBeDisabled();
      });

      it("cycles between option and specify other for single select", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "color",
              text: "Favorite color",
              type: "string",
              answerConstraint: "optionsOrString",
              answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "color");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Favorite color", "Red");
        expect(getStringAnswers(question)).toEqual(["Red"]);
        expect(
          screen.queryByRole("textbox", { name: "Favorite color" }),
        ).toBeNull();

        selectOption("Favorite color", /specify other/i);
        const customInput = screen.getByRole("textbox", {
          name: "Favorite color",
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");
        expect(getStringAnswers(question)).toEqual([]);

        fireEvent.change(customInput, { target: { value: "Magenta" } });
        expect(customInput.value).toBe("Magenta");
        expect(getStringAnswers(question)).toEqual(["Magenta"]);

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(
          screen.queryByRole("textbox", { name: "Favorite color" }),
        ).toBeNull();
        expect(getStringAnswers(question)).toEqual([]);
        selectOption("Favorite color", "Blue");
        expect(getStringAnswers(question)).toEqual(["Blue"]);
        expect(
          screen.queryByRole("textbox", { name: "Favorite color" }),
        ).toBeNull();

        selectOption("Favorite color", /specify other/i);
        const customAgain = screen.getByRole("textbox", {
          name: "Favorite color",
        }) as HTMLInputElement;
        expect(customAgain.value).toBe("");
        expect(getStringAnswers(question)).toEqual([]);
      });

      it("commits a custom value and closes the form on Add", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "color",
              text: "Favorite color",
              type: "string",
              answerConstraint: "optionsOrString",
              answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "color");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Favorite color", /specify other/i);

        const customInput = screen.getByRole("textbox", {
          name: "Favorite color",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Magenta" } });
        expect(customInput).toHaveValue("Magenta");

        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        expect(
          screen.queryByRole("textbox", { name: "Favorite color" }),
        ).toBeNull();
        const combobox = getCombobox("Favorite color");
        expect(getComboboxValue(combobox)).toBe("Magenta");
        expect(getStringAnswers(question)).toEqual(["Magenta"]);
      });

      it("keeps custom options available after switching to an option", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "color",
              text: "Favorite color",
              type: "string",
              answerConstraint: "optionsOrString",
              answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "color");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Favorite color", /specify other/i);
        const customInput = screen.getByRole("textbox", {
          name: "Favorite color",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Green" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        expect(getComboboxValue(getCombobox("Favorite color"))).toBe("Green");

        selectOption("Favorite color", "Red");
        const input = getCombobox("Favorite color");
        fireEvent.click(input);
        const listbox = getListbox(input);
        expect(
          within(listbox).getByRole("option", { name: "Green" }),
        ).toBeInTheDocument();
      });

      it("keeps the custom value when selecting it from the dropdown", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "dose",
              text: "Dose",
              type: "quantity",
              answerConstraint: "optionsOrString",
              answerOption: [
                {
                  valueQuantity: { value: 1, unit: "mg" },
                } as QuestionnaireItemAnswerOption,
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "dose");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Dose", /specify other/i);
        const customInput = screen.getByRole("textbox", {
          name: "Dose",
        }) as HTMLInputElement;
        fireEvent.change(customInput, {
          target: { value: "custom-dose" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        expect(getStringAnswers(question)).toEqual(["custom-dose"]);
        expect(getComboboxValue(getCombobox("Dose"))).toContain("custom-dose");

        selectOption("Dose", /custom-dose/);

        expect(getStringAnswers(question)).toEqual(["custom-dose"]);
        expect(getComboboxValue(getCombobox("Dose"))).toContain("custom-dose");

        selectOption("Dose", /specify other/i);
        const reopenedInput = screen.getByRole("textbox", {
          name: "Dose",
        }) as HTMLInputElement;
        expect(reopenedInput).toHaveValue("");
      });
    });

    describe("multi (multi-select)", () => {
      it("renders custom string answers with string display for open-choice quantities", () => {
        const originalString = VALUE_DISPLAY_BY_TYPE.string;
        const originalQuantity = VALUE_DISPLAY_BY_TYPE.quantity;

        try {
          VALUE_DISPLAY_BY_TYPE.string = ({ value }) => (
            <>String: {String(value)}</>
          );
          VALUE_DISPLAY_BY_TYPE.quantity = ({ value }) => (
            <>
              Quantity: {value.value} {value.unit}
            </>
          );

          const questionnaire: Questionnaire = {
            resourceType: "Questionnaire",
            status: "active",
            item: [
              {
                linkId: "dose",
                text: "Dose",
                type: "quantity",
                repeats: true,
                answerConstraint: "optionsOrString",
                answerOption: [
                  {
                    valueQuantity: { value: 1, unit: "mg" },
                  } as QuestionnaireItemAnswerOption,
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
                answer: [{ valueString: "custom-dose" }],
              },
            ],
          };

          const form = new FormStore(questionnaire, response);
          const question = getQuestion(form, "dose");

          render(<DropdownSelectRenderer node={question} />);

          expect(screen.getByText("String: custom-dose")).toBeInTheDocument();
          expect(screen.queryByText("Quantity: custom-dose")).toBeNull();

          const input = getCombobox("Dose");
          fireEvent.click(input);
          const listbox = getListbox(input);
          expect(
            within(listbox).getByRole("option", {
              name: "Quantity: 1 mg",
            }),
          ).toBeInTheDocument();
        } finally {
          VALUE_DISPLAY_BY_TYPE.string = originalString;
          VALUE_DISPLAY_BY_TYPE.quantity = originalQuantity;
        }
      });

      it("creates a custom input when Specify other is selected", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "allergy",
              text: "Allergy",
              type: "string",
              repeats: true,
              answerConstraint: "optionsOrString",
              answerOption: [
                { valueString: "Dust" },
                { valueString: "Pollen" },
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "allergy");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Allergy", /specify other/i);
        const customInput = screen.getByRole("textbox", {
          name: "Allergy",
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");
      });

      it("hides the custom input when canceling specify other", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "allergy",
              text: "Allergy",
              type: "string",
              repeats: true,
              answerConstraint: "optionsOrString",
              answerOption: [
                { valueString: "Dust" },
                { valueString: "Pollen" },
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "allergy");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Allergy", /specify other/i);
        expect(
          screen.getByRole("textbox", { name: "Allergy" }),
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(screen.queryByRole("textbox", { name: "Allergy" })).toBeNull();
        expect(getStringAnswers(question)).toEqual([]);
        expect(question.answers).toHaveLength(0);
      });

      it("cycles between option and specify other for multi select", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "allergy",
              text: "Allergy",
              type: "string",
              repeats: true,
              answerConstraint: "optionsOrString",
              answerOption: [
                { valueString: "Dust" },
                { valueString: "Pollen" },
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "allergy");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Allergy", "Dust");
        expect(getStringAnswers(question)).toEqual(["Dust"]);

        selectOption("Allergy", /specify other/i);
        let customInput = screen.getByRole("textbox", {
          name: "Allergy",
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");

        fireEvent.change(customInput, { target: { value: "Cats" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));
        expect(getStringAnswers(question).sort()).toEqual(["Cats", "Dust"]);
        expect(screen.queryByRole("textbox", { name: "Allergy" })).toBeNull();

        selectOption("Allergy", "Pollen");
        expect(getStringAnswers(question).sort()).toEqual([
          "Cats",
          "Dust",
          "Pollen",
        ]);

        fireEvent.click(getChipButton("Cats"));
        expect(screen.queryByRole("textbox", { name: "Allergy" })).toBeNull();
        expect(getStringAnswers(question).sort()).toEqual(["Dust", "Pollen"]);
        const input = getCombobox("Allergy");
        fireEvent.click(input);
        const listbox = getListbox(input);
        expect(
          within(listbox).getByRole("option", { name: "Cats" }),
        ).toBeInTheDocument();

        selectOption("Allergy", /specify other/i);
        customInput = screen.getByRole("textbox", {
          name: "Allergy",
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");
      });

      it("keeps string answers and shows them as custom chips", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "dose",
              text: "Dose",
              type: "integer",
              repeats: true,
              answerConstraint: "optionsOrString",
              answerOption: [{ valueInteger: 1 }, { valueInteger: 2 }],
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
                { valueInteger: 1 },
                { valueInteger: 2 },
                { valueString: "Other" },
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire, response);
        const question = getQuestion(form, "dose");

        render(<DropdownSelectRenderer node={question} />);

        expect(question.answers.map((answer) => answer.value)).toEqual([
          1,
          2,
          "Other",
        ]);

        expect(screen.getByText("Other")).toBeInTheDocument();
        expect(screen.queryByRole("textbox", { name: /dose/i })).toBeNull();
      });

      it("disables other options when maxOccurs is reached and re-enables after removal", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "color",
              text: "Favorite color",
              type: "string",
              repeats: true,
              answerConstraint: "optionsOrString",
              extension: [{ url: EXT.MAX_OCCURS, valueInteger: 1 }],
              answerOption: [{ valueString: "Red" }, { valueString: "Blue" }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "color");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Favorite color", "Red");
        const input = getCombobox("Favorite color");
        fireEvent.click(input);
        let listbox = getListbox(input);
        const blue = within(listbox).getByRole("option", {
          name: "Blue",
        }) as HTMLButtonElement;
        const specifyOther = within(listbox).getByRole("option", {
          name: /specify other/i,
        }) as HTMLButtonElement;

        expect(blue).toBeDisabled();
        expect(specifyOther).toBeDisabled();

        fireEvent.click(getChipButton("Red"));

        fireEvent.click(input);
        listbox = getListbox(input);
        expect(
          within(listbox).getByRole("option", { name: "Blue" }),
        ).not.toBeDisabled();
        expect(specifyOther).not.toBeDisabled();
      });
    });

    describe("read-only", () => {
      it("disables options and custom input when readOnly", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "call-sign",
              text: "Call sign",
              type: "string",
              readOnly: true,
              answerConstraint: "optionsOrString",
              answerOption: [
                { valueString: "Alpha" },
                { valueString: "Bravo" },
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
              linkId: "call-sign",
              answer: [{ valueString: "Zulu" }],
            },
          ],
        };

        const form = new FormStore(questionnaire, response);
        const question = getQuestion(form, "call-sign");

        render(<DropdownSelectRenderer node={question} />);

        const input = getCombobox("Call sign");
        expect(input).toHaveAttribute("aria-disabled", "true");
        expect(getComboboxValue(input)).toBe("Zulu");
        expect(screen.queryByRole("textbox", { name: "Call sign" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Add" })).toBeNull();
      });
    });
  });

  describe("optionsOrType", () => {
    describe("integer responses", () => {
      it("keeps a non-option integer answer selected until specify other is opened", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "dose",
              text: "Dose",
              type: "integer",
              answerConstraint: "optionsOrType",
              answerOption: [{ valueInteger: 1 }, { valueInteger: 2 }],
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
              answer: [{ valueInteger: 3 }],
            },
          ],
        };

        const form = new FormStore(questionnaire, response);
        const question = getQuestion(form, "dose");

        render(<DropdownSelectRenderer node={question} />);

        const input = getCombobox("Dose");
        expect(getComboboxValue(input)).toBe("3");
        expect(screen.queryByRole("spinbutton", { name: "Dose" })).toBeNull();
        expect(getAnswerValues(question)).toEqual([3]);

        selectOption("Dose", /specify other/i);
        const customInput = screen.getByRole("spinbutton", {
          name: "Dose",
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");
      });

      it("cycles between option and specify other for single select", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "dose",
              text: "Dose",
              type: "integer",
              answerConstraint: "optionsOrType",
              answerOption: [{ valueInteger: 1 }, { valueInteger: 2 }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "dose");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Dose", "1");
        expect(getAnswerValues(question)).toEqual([1]);

        selectOption("Dose", /specify other/i);
        const customInput = screen.getByRole("spinbutton", {
          name: "Dose",
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");
        expect(getAnswerValues(question)).toEqual([null]);

        fireEvent.change(customInput, { target: { value: "5" } });
        expect(customInput.value).toBe("5");
        expect(getAnswerValues(question)).toEqual([5]);

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(screen.queryByRole("spinbutton", { name: "Dose" })).toBeNull();
        expect(getAnswerValues(question)).toEqual([null]);
        selectOption("Dose", "2");
        expect(getAnswerValues(question)).toEqual([2]);

        selectOption("Dose", /specify other/i);
        const customAgain = screen.getByRole("spinbutton", {
          name: "Dose",
        }) as HTMLInputElement;
        expect(customAgain.value).toBe("");
        expect(getAnswerValues(question)).toEqual([null]);
      });

      it("cycles between option and specify other for multi select", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "dose",
              text: "Dose",
              type: "integer",
              repeats: true,
              answerConstraint: "optionsOrType",
              answerOption: [{ valueInteger: 1 }, { valueInteger: 2 }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "dose");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Dose", "1");
        expect(getAnswerValues(question)).toEqual([1]);

        selectOption("Dose", /specify other/i);
        let customInput = screen.getByRole("spinbutton", {
          name: "Dose",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "5" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));
        expect(screen.queryByRole("spinbutton", { name: "Dose" })).toBeNull();
        expect(getAnswerValues(question).sort()).toEqual([1, 5]);

        selectOption("Dose", "2");
        expect(getAnswerValues(question).sort()).toEqual([1, 2, 5]);

        fireEvent.click(getChipButton("5"));
        expect(getAnswerValues(question).sort()).toEqual([1, 2]);

        selectOption("Dose", /specify other/i);
        customInput = screen.getByRole("spinbutton", {
          name: "Dose",
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");
      });

      it("keeps Specify other enabled after removing the custom answer", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "dose",
              text: "Dose",
              type: "integer",
              repeats: true,
              answerConstraint: "optionsOrType",
              answerOption: [{ valueInteger: 1 }, { valueInteger: 2 }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "dose");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Dose", /specify other/i);
        const customInput = screen.getByRole("spinbutton", {
          name: "Dose",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "3" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        fireEvent.click(getChipButton("3"));

        const input = getCombobox("Dose");
        fireEvent.click(input);
        const listbox = getListbox(input);
        const specifyOther = within(listbox).getByRole("option", {
          name: /specify other/i,
        }) as HTMLButtonElement;
        expect(specifyOther).not.toBeDisabled();
      });
    });

    describe("quantity responses", () => {
      it("keeps a custom quantity answer after submitting specify other", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "dose",
              text: "Dose",
              type: "quantity",
              answerConstraint: "optionsOrType",
              answerOption: [
                {
                  valueQuantity: { value: 1, unit: "mg" },
                } as QuestionnaireItemAnswerOption,
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "dose");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Dose", /specify other/i);
        const customInput = screen.getByRole("spinbutton", {
          name: "Dose",
        }) as HTMLInputElement;
        fireEvent.change(customInput, {
          target: { value: "5" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        expect(screen.queryByRole("spinbutton", { name: "Dose" })).toBeNull();
        expect(getComboboxValue(getCombobox("Dose"))).toContain("5");
        const [customAnswer] = getAnswerValues(question);
        expect(customAnswer).toMatchObject({ value: 5 });
      });
    });

    describe("string interactions", () => {
      it("keeps specify other active when custom value matches an option", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "call-sign",
              text: "Call sign",
              type: "string",
              answerConstraint: "optionsOrType",
              answerOption: [{ valueString: "Alpha" }, { valueString: "Echo" }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "call-sign");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Call sign", /specify other/i);
        const customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Echo" } });
        expect(customInput.value).toBe("Echo");
        expect(getStringAnswers(question)).toEqual(["Echo"]);
      });

      it("keeps specify other active when custom value matches an option for multi select", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "call-sign",
              text: "Call sign",
              type: "string",
              repeats: true,
              answerConstraint: "optionsOrType",
              answerOption: [{ valueString: "Alpha" }, { valueString: "Echo" }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "call-sign");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Call sign", /specify other/i);
        const customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Echo" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        expect(getChipButton("Echo")).toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(
          1,
        );

        const input = getCombobox("Call sign");
        fireEvent.click(input);
        const listbox = getListbox(input);
        expect(
          within(listbox).getByRole("option", { name: "Echo" }),
        ).toBeInTheDocument();
      });

      it("keeps specify other active when custom value matches an option with nested items", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "call-sign",
              text: "Call sign",
              type: "string",
              repeats: true,
              answerConstraint: "optionsOrType",
              extension: [{ url: EXT.MIN_OCCURS, valueInteger: 1 }],
              answerOption: [{ valueString: "Alpha" }, { valueString: "Echo" }],
              item: [
                {
                  linkId: "note",
                  text: "Note",
                  type: "string",
                },
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "call-sign");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Call sign", /specify other/i);
        const customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Echo" } });
        expect(getStringAnswers(question)).toEqual(["Echo"]);
      });
    });

    describe("multiple custom answers", () => {
      it("keeps custom answers from auto-selecting options and retains Specify other", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "call-sign",
              text: "Call sign",
              type: "string",
              repeats: true,
              answerConstraint: "optionsOrType",
              answerOption: [{ valueString: "Echo" }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "call-sign");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Call sign", /specify other/i);
        let customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Echo" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        selectOption("Call sign", /specify other/i);
        customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Echoless" } });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));

        expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(
          2,
        );
        expect(getChipButton("Echo")).toBeInTheDocument();
        expect(getChipButton("Echoless")).toBeInTheDocument();

        fireEvent.click(getChipButton("Echo"));
        expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(
          1,
        );
        expect(getChipButton("Echoless")).toBeInTheDocument();

        const input = getCombobox("Call sign");
        fireEvent.click(input);
        const listbox = getListbox(input);
        const specifyOther = within(listbox).getByRole("option", {
          name: /specify other/i,
        }) as HTMLButtonElement;
        expect(specifyOther).not.toBeDisabled();
      });
    });

    describe("type-specific extensions", () => {
      it("applies minLength and maxLength to open-choice string inputs", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "call-sign",
              text: "Call sign",
              type: "string",
              answerConstraint: "optionsOrType",
              maxLength: 8,
              extension: [{ url: EXT.MIN_LENGTH, valueInteger: 3 }],
              answerOption: [{ valueString: "Alpha" }],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "call-sign");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Call sign", /specify other/i);

        const customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        expect(customInput).toHaveAttribute("minlength", "3");
        expect(customInput).toHaveAttribute("maxlength", "8");
      });

      it("uses maxDecimalPlaces and unit display in open-choice decimal inputs", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "dose",
              text: "Dose",
              type: "decimal",
              answerConstraint: "optionsOrType",
              extension: [
                { url: EXT.MAX_DECIMAL_PLACES, valueInteger: 2 },
                {
                  url: EXT.QUESTIONNAIRE_UNIT,
                  valueCoding: {
                    system: "http://unitsofmeasure.org",
                    code: "mg/L",
                    display: "mg/L",
                  },
                },
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "dose");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Dose", /specify other/i);

        const customInput = screen.getByRole("spinbutton", {
          name: "Dose",
        }) as HTMLInputElement;
        expect(customInput).toHaveAttribute("step", "0.01");
        expect(screen.getByText("mg/L")).toBeInTheDocument();
      });

      it("renders unit options from questionnaire-unitOption in open-choice quantity inputs", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "dosage",
              text: "Dosage",
              type: "quantity",
              answerConstraint: "optionsOrType",
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
                    code: "mL",
                    display: "mL",
                  },
                },
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "dosage");

        render(<DropdownSelectRenderer node={question} />);

        selectOption("Dosage", /specify other/i);

        const answer = question.answers[0];
        expect(answer).toBeDefined();
        const unitInputId = `${answer!.token}_/_unit`;
        const unitInput = document.getElementById(
          unitInputId,
        ) as HTMLInputElement | null;
        expect(unitInput).not.toBeNull();
        expect(screen.queryByRole("textbox", { name: "Dosage" })).toBeNull();
        fireEvent.click(unitInput!);
        const listbox = getListbox(unitInput!);
        expect(
          within(listbox).getByRole("option", { name: "mg" }),
        ).toBeInTheDocument();
        expect(
          within(listbox).getByRole("option", { name: "mL" }),
        ).toBeInTheDocument();
      });

      it("passes mimeType extensions to open-choice attachment inputs", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "document",
              text: "Document",
              type: "attachment",
              answerConstraint: "optionsOrType",
              extension: [
                { url: EXT.MIME_TYPE, valueCode: "image/png" },
                { url: EXT.MIME_TYPE, valueCode: "application/pdf" },
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "document");

        const { container } = render(
          <DropdownSelectRenderer node={question} />,
        );

        selectOption("Document", /specify other/i);

        const fileInput = container.querySelector(
          'input[type="file"]',
        ) as HTMLInputElement | null;
        expect(fileInput).not.toBeNull();
        expect(fileInput).toHaveAttribute(
          "accept",
          "image/png,application/pdf",
        );
      });
    });
  });
});
