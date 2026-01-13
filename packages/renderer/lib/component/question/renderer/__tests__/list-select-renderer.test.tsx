import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import type {
  Quantity,
  Questionnaire,
  QuestionnaireItemAnswerOption,
  QuestionnaireResponse,
} from "fhir/r5";

import { FormStore } from "../../../../store/form/form-store.ts";
import { isQuestionNode } from "../../../../store/question/question-store.ts";
import { ListSelectRenderer } from "../list-select-renderer.tsx";
import type { AnswerType, IQuestionNode } from "../../../../types.ts";
import { EXT } from "../../../../utilities.ts";
import { strings } from "../../../../strings.ts";

const valueDisplayOverrides = vi.hoisted(
  () => new Map<AnswerType, (properties: { value: unknown }) => ReactNode>(),
);

vi.mock("../../fhir/value-display.tsx", async () => {
  const actual = await vi.importActual<
    typeof import("../../fhir/value-display.tsx")
  >("../../fhir/value-display.tsx");

  return {
    ValueDisplay: ({ type, value }: { type: AnswerType; value: unknown }) => {
      const override = valueDisplayOverrides.get(type);
      if (override) {
        return override({ value });
      }
      return actual.ValueDisplay({
        type,
        value,
      } as Parameters<typeof actual.ValueDisplay>[0]);
    },
  };
});

afterEach(() => {
  valueDisplayOverrides.clear();
});

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

function getStringAnswers(question: IQuestionNode) {
  return question.answers
    .map((answer) => answer.value)
    .filter((value): value is string => typeof value === "string");
}

function getQuantityAnswers(question: IQuestionNode) {
  return question.answers
    .map((answer) => answer.value)
    .filter(
      (value): value is Quantity =>
        typeof value === "object" && value !== undefined,
    );
}

function getListbox(input: HTMLElement) {
  const listboxId = input.getAttribute("aria-controls");
  expect(listboxId).toBeTruthy();
  const listbox = document.querySelector<HTMLElement>(
    `#${CSS.escape(listboxId!)}`,
  );
  expect(listbox).not.toBeNull();
  return listbox as HTMLElement;
}

describe("list-select-renderer", () => {
  describe("optionsOnly", () => {
    describe("single (radio)", () => {
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

        render(<ListSelectRenderer node={question} />);

        const legacy = screen.getByLabelText("Green") as HTMLInputElement;
        expect(legacy).toBeChecked();
        expect(legacy).toBeDisabled();
        expect(screen.getByRole("radio", { name: "Red" })).not.toBeDisabled();
        expect(screen.getByRole("radio", { name: "Blue" })).not.toBeDisabled();
      });

      it("disables options when readOnly and no answers", () => {
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

        render(<ListSelectRenderer node={question} />);

        const red = screen.getByRole("radio", { name: "Red" });
        const blue = screen.getByRole("radio", { name: "Blue" });

        expect(red).toBeDisabled();
        expect(blue).toBeDisabled();
        expect(red).not.toBeChecked();
        expect(blue).not.toBeChecked();
        expect(
          screen.queryByRole("radio", { name: /specify other/i }),
        ).toBeNull();
      });

      it("renders boolean tri-state options and clears to undefined", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "consent",
              text: "Consent",
              type: "boolean",
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "consent");

        render(<ListSelectRenderer node={question} />);

        const yes = screen.getByRole("radio", {
          name: strings.value.yes,
        }) as HTMLInputElement;
        const no = screen.getByRole("radio", {
          name: strings.value.no,
        }) as HTMLInputElement;
        const unanswered = screen.getByRole("radio", {
          name: strings.value.undefined,
        }) as HTMLInputElement;

        expect(unanswered).toBeChecked();

        fireEvent.click(yes);
        expect(question.answers[0]?.value).toBe(true);

        fireEvent.click(no);
        expect(question.answers[0]?.value).toBe(false);

        fireEvent.click(unanswered);
        expect(question.answers[0]?.value).toBeUndefined();
      });
    });

    describe("multi (checkbox)", () => {
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

        render(<ListSelectRenderer node={question} />);

        const red = screen.getByRole("checkbox", { name: /red/i });
        const blue = screen.getByRole("checkbox", { name: /blue/i });
        const assertBeforeAdd = () => {
          expect(red).toBeDisabled();
          expect(blue).not.toBeDisabled();
        };
        const assertAfterAdd = () => {
          expect(red).not.toBeDisabled();
          expect(blue).not.toBeDisabled();
        };

        fireEvent.click(red);
        expect(red).toBeChecked();
        assertBeforeAdd();

        fireEvent.click(blue);
        expect(blue).toBeChecked();
        assertAfterAdd();
      });

      it("renders legacy selections as disabled options for repeating answers", () => {
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

        render(<ListSelectRenderer node={question} />);

        const alpha = screen.getByRole("checkbox", { name: /alpha/i });
        const bravo = screen.getByRole("checkbox", { name: /bravo/i });
        const legacy = screen.getByRole("checkbox", { name: /zulu/i });

        expect(alpha).toBeChecked();
        expect(alpha).not.toBeDisabled();
        expect(bravo).not.toBeDisabled();
        expect(legacy).toBeChecked();
        expect(legacy).toBeDisabled();
        expect(
          screen.queryByRole("checkbox", { name: /specify other/i }),
        ).toBeNull();
      });
    });
  });

  describe("optionsOrString", () => {
    describe("single (radio)", () => {
      it("renders option labels using the question type display for optionsOrString", () => {
        valueDisplayOverrides.set("string", ({ value }) => (
          <>String: {String(value)}</>
        ));
        valueDisplayOverrides.set("quantity", ({ value }) => {
          const quantity = value as { value: number; unit?: string };
          return (
            <>
              Quantity: {quantity.value} {quantity.unit}
            </>
          );
        });

        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "note",
              text: "Note",
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
        const question = getQuestion(form, "note");

        render(<ListSelectRenderer node={question} />);

        expect(
          screen.getByRole("radio", { name: "Quantity: 1 mg" }),
        ).toBeInTheDocument();
        expect(
          screen.queryByRole("radio", {
            name: "String: [object Object]",
          }),
        ).toBeNull();
      });

      it("renders custom string answers with string display for open-choice quantities", () => {
        valueDisplayOverrides.set("string", ({ value }) => (
          <>String: {String(value)}</>
        ));
        valueDisplayOverrides.set("quantity", ({ value }) => {
          const quantity = value as { value: number; unit?: string };
          return (
            <>
              Quantity: {quantity.value} {quantity.unit}
            </>
          );
        });

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

        render(<ListSelectRenderer node={question} />);

        expect(
          screen.getByRole("radio", { name: "String: custom-dose" }),
        ).toBeChecked();
        expect(
          screen.queryByRole("radio", {
            name: "Quantity: custom-dose",
          }),
        ).toBeNull();
        expect(
          screen.getByRole("radio", { name: "Quantity: 1 mg" }),
        ).toBeInTheDocument();
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

        render(<ListSelectRenderer node={question} />);

        fireEvent.click(screen.getByRole("radio", { name: /specify other/i }));
        const customInput = screen.getByRole("textbox", {
          name: "Favorite color",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Green" } });
        fireEvent.click(
          screen.getByRole("button", { name: strings.dialog.add }),
        );

        expect(screen.getByRole("radio", { name: "Green" })).toBeChecked();

        fireEvent.click(screen.getByRole("radio", { name: "Red" }));
        expect(screen.getByRole("radio", { name: "Green" })).not.toBeChecked();
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

        render(<ListSelectRenderer node={question} />);

        const fallback = screen.getByRole("radio", {
          name: "Green",
        }) as HTMLInputElement;
        expect(fallback).toBeChecked();
        const specifyOther = screen.getByRole("radio", {
          name: /specify other/i,
        }) as HTMLInputElement;
        expect(specifyOther).not.toBeChecked();
        expect(
          screen.queryByRole("textbox", { name: "Favorite color" }),
        ).toBeNull();

        fireEvent.click(specifyOther);
        const customInput = screen.getByRole("textbox", {
          name: "Favorite color",
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");
        expect(
          screen.getByRole("radio", { name: "Green" }),
        ).toBeInTheDocument();
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

        render(<ListSelectRenderer node={question} />);

        const red = screen.getByRole("radio", { name: "Red" });
        const blue = screen.getByRole("radio", { name: "Blue" });
        const specifyOther = screen.getByRole("radio", {
          name: /specify other/i,
        });
        const assertOptionsEnabled = () => {
          expect(red).not.toBeDisabled();
          expect(blue).not.toBeDisabled();
          expect(specifyOther).not.toBeDisabled();
        };

        assertOptionsEnabled();
        fireEvent.click(red);
        expect(red).toBeChecked();
        expect(getStringAnswers(question)).toEqual(["Red"]);
        expect(
          screen.queryByRole("textbox", { name: "Favorite color" }),
        ).toBeNull();
        assertOptionsEnabled();

        fireEvent.click(specifyOther);
        const customInput = screen.getByRole("textbox", {
          name: "Favorite color",
        }) as HTMLInputElement;
        expect(customInput).toHaveValue("");
        expect(getStringAnswers(question)).toEqual([]);
        assertOptionsEnabled();

        fireEvent.change(customInput, { target: { value: "Magenta" } });
        expect(customInput).toHaveValue("Magenta");
        expect(getStringAnswers(question)).toEqual(["Magenta"]);
        assertOptionsEnabled();

        fireEvent.click(blue);
        expect(blue).toBeChecked();
        expect(getStringAnswers(question)).toEqual(["Blue"]);
        expect(
          screen.queryByRole("textbox", { name: "Favorite color" }),
        ).toBeNull();
        assertOptionsEnabled();

        fireEvent.click(specifyOther);
        const customAgain = screen.getByRole("textbox", {
          name: "Favorite color",
        }) as HTMLInputElement;
        expect(customAgain).toHaveValue("");
        expect(getStringAnswers(question)).toEqual([]);
        assertOptionsEnabled();
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

        render(<ListSelectRenderer node={question} />);

        fireEvent.click(screen.getByRole("radio", { name: /specify other/i }));
        const customInput = screen.getByRole("textbox", {
          name: "Favorite color",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Magenta" } });
        fireEvent.click(
          screen.getByRole("button", { name: strings.dialog.add }),
        );

        expect(
          screen.queryByRole("textbox", { name: "Favorite color" }),
        ).toBeNull();
        expect(screen.getByRole("radio", { name: "Magenta" })).toBeChecked();
        expect(getStringAnswers(question)).toEqual(["Magenta"]);
      });
    });

    describe("multi (checkbox)", () => {
      it("creates a custom input when Specify other is checked", () => {
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

        render(<ListSelectRenderer node={question} />);

        const assertOptionsEnabled = () => {
          expect(
            screen.getByRole("checkbox", { name: /dust/i }),
          ).not.toBeDisabled();
          expect(
            screen.getByRole("checkbox", { name: /pollen/i }),
          ).not.toBeDisabled();
          expect(
            screen.getByRole("checkbox", { name: /specify other/i }),
          ).not.toBeDisabled();
        };

        assertOptionsEnabled();
        fireEvent.click(
          screen.getByRole("checkbox", { name: /specify other/i }),
        );
        expect(
          screen.getByRole("checkbox", { name: /specify other/i }),
        ).toBeChecked();
        assertOptionsEnabled();

        expect(
          screen.getByRole("textbox", { name: "Allergy" }),
        ).toBeInTheDocument();
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

        render(<ListSelectRenderer node={question} />);

        const dust = screen.getByRole("checkbox", { name: /dust/i });
        const pollen = screen.getByRole("checkbox", { name: /pollen/i });
        const specifyOther = screen.getByRole("checkbox", {
          name: /specify other/i,
        });
        const assertOptionsEnabled = () => {
          expect(dust).not.toBeDisabled();
          expect(pollen).not.toBeDisabled();
          expect(specifyOther).not.toBeDisabled();
        };

        assertOptionsEnabled();
        fireEvent.click(dust);
        expect(dust).toBeChecked();
        expect(getStringAnswers(question)).toEqual(["Dust"]);
        assertOptionsEnabled();

        fireEvent.click(specifyOther);
        let customInput = screen.getByRole("textbox", {
          name: "Allergy",
        }) as HTMLInputElement;
        expect(customInput).toHaveValue("");
        assertOptionsEnabled();

        fireEvent.change(customInput, { target: { value: "Cats" } });
        expect(getStringAnswers(question).toSorted()).toEqual(["Cats", "Dust"]);
        assertOptionsEnabled();

        fireEvent.click(
          screen.getByRole("button", { name: strings.dialog.add }),
        );
        expect(specifyOther).not.toBeChecked();
        expect(screen.queryByRole("textbox", { name: "Allergy" })).toBeNull();
        expect(screen.getByRole("checkbox", { name: /cats/i })).toBeChecked();
        assertOptionsEnabled();

        fireEvent.click(pollen);
        expect(pollen).toBeChecked();
        expect(getStringAnswers(question).toSorted()).toEqual([
          "Cats",
          "Dust",
          "Pollen",
        ]);
        assertOptionsEnabled();

        fireEvent.click(specifyOther);
        customInput = screen.getByRole("textbox", {
          name: "Allergy",
        }) as HTMLInputElement;
        expect(customInput).toHaveValue("");
        assertOptionsEnabled();

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(specifyOther).not.toBeChecked();
        expect(screen.queryByRole("textbox", { name: "Allergy" })).toBeNull();
        expect(getStringAnswers(question).toSorted()).toEqual([
          "Cats",
          "Dust",
          "Pollen",
        ]);
        assertOptionsEnabled();
      });

      it("keeps string answers as custom selections", () => {
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

        render(<ListSelectRenderer node={question} />);

        expect(question.answers.map((answer) => answer.value)).toEqual([
          1,
          2,
          "Other",
        ]);

        const one = screen.getByRole("checkbox", { name: /dose.*1/i });
        const two = screen.getByRole("checkbox", { name: /dose.*2/i });
        const other = screen.getByRole("checkbox", {
          name: /dose\s+other/i,
        });
        const specifyOther = screen.getByRole("checkbox", {
          name: /specify other/i,
        });

        expect(one).toBeChecked();
        expect(two).toBeChecked();
        expect(other).toBeChecked();
        expect(specifyOther).not.toBeChecked();
        expect(one).not.toBeDisabled();
        expect(two).not.toBeDisabled();
        expect(other).not.toBeDisabled();
        expect(screen.queryByRole("spinbutton", { name: /dose/i })).toBeNull();
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

        render(<ListSelectRenderer node={question} />);

        const red = screen.getByRole("checkbox", { name: /red/i });
        const blue = screen.getByRole("checkbox", { name: /blue/i });
        const specifyOther = screen.getByRole("checkbox", {
          name: /specify other/i,
        });
        const assertOptionsEnabled = () => {
          expect(red).not.toBeDisabled();
          expect(blue).not.toBeDisabled();
          expect(specifyOther).not.toBeDisabled();
        };
        const assertAtCapacity = () => {
          expect(red).not.toBeDisabled();
          expect(blue).toBeDisabled();
          expect(specifyOther).toBeDisabled();
        };

        assertOptionsEnabled();
        fireEvent.click(red);
        expect(red).toBeChecked();
        assertAtCapacity();

        fireEvent.click(red);
        expect(red).not.toBeChecked();
        assertOptionsEnabled();
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

        render(<ListSelectRenderer node={question} />);

        const alpha = screen.getByRole("radio", { name: "Alpha" });
        const bravo = screen.getByRole("radio", { name: "Bravo" });
        const custom = screen.getByRole("radio", {
          name: "Zulu",
        }) as HTMLInputElement;
        const specifyOther = screen.getByRole("radio", {
          name: /specify other/i,
        }) as HTMLInputElement;

        expect(alpha).toBeDisabled();
        expect(bravo).toBeDisabled();
        expect(custom).toBeDisabled();
        expect(custom).toBeChecked();
        expect(specifyOther).toBeDisabled();
        expect(specifyOther).not.toBeChecked();
        expect(screen.queryByRole("textbox", { name: "Call sign" })).toBeNull();
      });
    });
  });

  describe("optionsOrType", () => {
    describe("integer responses", () => {
      it("shows a custom selection for non-option integer answers", () => {
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

        render(<ListSelectRenderer node={question} />);

        const specifyOther = screen.getByRole("checkbox", {
          name: /specify other/i,
        });
        const customOption = screen.getByRole("checkbox", {
          name: /dose.*3/i,
        }) as HTMLInputElement;
        expect(customOption).toBeChecked();
        expect(
          screen.getByRole("checkbox", { name: /dose.*1/i }),
        ).not.toBeDisabled();
        expect(
          screen.getByRole("checkbox", { name: /dose.*2/i }),
        ).not.toBeDisabled();
        expect(specifyOther).not.toBeDisabled();
        expect(specifyOther).not.toBeChecked();

        expect(screen.queryByRole("spinbutton", { name: /dose/i })).toBeNull();
        expect(screen.queryByRole("textbox", { name: /dose/i })).toBeNull();
      });

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

        render(<ListSelectRenderer node={question} />);

        const custom = screen.getByRole("radio", { name: "3" });
        const specifyOther = screen.getByRole("radio", {
          name: /specify other/i,
        });
        expect(custom).toBeChecked();
        expect(specifyOther).not.toBeChecked();
        expect(screen.queryByRole("spinbutton", { name: /dose/i })).toBeNull();

        fireEvent.click(specifyOther);
        const customInput = screen.getByRole("spinbutton", {
          name: /dose/i,
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

        render(<ListSelectRenderer node={question} />);

        const one = screen.getByRole("radio", { name: "1" });
        const two = screen.getByRole("radio", { name: "2" });
        const specifyOther = screen.getByRole("radio", {
          name: /specify other/i,
        });
        const assertOptionsEnabled = () => {
          expect(one).not.toBeDisabled();
          expect(two).not.toBeDisabled();
          expect(specifyOther).not.toBeDisabled();
        };

        assertOptionsEnabled();
        fireEvent.click(one);
        expect(one).toBeChecked();
        expect(question.answers.map((answer) => answer.value)).toEqual([1]);
        assertOptionsEnabled();

        fireEvent.click(specifyOther);
        const customInput = screen.getByRole("spinbutton", {
          name: /dose/i,
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");
        assertOptionsEnabled();

        fireEvent.change(customInput, { target: { value: "5" } });
        expect(customInput.value).toBe("5");
        expect(question.answers.map((answer) => answer.value)).toEqual([5]);
        assertOptionsEnabled();

        fireEvent.click(two);
        expect(two).toBeChecked();
        expect(question.answers.map((answer) => answer.value)).toEqual([2]);
        expect(screen.queryByRole("spinbutton", { name: /dose/i })).toBeNull();
        assertOptionsEnabled();

        fireEvent.click(specifyOther);
        const customAgain = screen.getByRole("spinbutton", {
          name: /dose/i,
        }) as HTMLInputElement;
        expect(customAgain.value).toBe("");
        expect(question.answers.map((answer) => answer.value)).toEqual([
          undefined,
        ]);
        assertOptionsEnabled();
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

        render(<ListSelectRenderer node={question} />);

        const one = screen.getByRole("checkbox", { name: /dose.*1/i });
        const two = screen.getByRole("checkbox", { name: /dose.*2/i });
        const specifyOther = screen.getByRole("checkbox", {
          name: /specify other/i,
        });
        const assertOptionsEnabled = () => {
          expect(one).not.toBeDisabled();
          expect(two).not.toBeDisabled();
          expect(specifyOther).not.toBeDisabled();
        };

        assertOptionsEnabled();
        fireEvent.click(one);
        expect(one).toBeChecked();
        expect(question.answers.map((answer) => answer.value)).toEqual([1]);
        assertOptionsEnabled();

        fireEvent.click(specifyOther);
        let customInput = screen.getByRole("spinbutton", {
          name: /dose/i,
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");
        assertOptionsEnabled();

        fireEvent.change(customInput, { target: { value: "5" } });
        expect(
          question.answers.map((answer) => answer.value).toSorted(),
        ).toEqual([1, 5]);
        assertOptionsEnabled();

        fireEvent.click(
          screen.getByRole("button", { name: strings.dialog.add }),
        );
        expect(specifyOther).not.toBeChecked();
        expect(screen.queryByRole("spinbutton", { name: /dose/i })).toBeNull();
        expect(
          screen.getByRole("checkbox", { name: /dose.*5/i }),
        ).toBeChecked();
        assertOptionsEnabled();

        fireEvent.click(two);
        expect(two).toBeChecked();
        expect(
          question.answers.map((answer) => answer.value).toSorted(),
        ).toEqual([1, 2, 5]);
        assertOptionsEnabled();

        fireEvent.click(specifyOther);
        customInput = screen.getByRole("spinbutton", {
          name: /dose/i,
        }) as HTMLInputElement;
        expect(customInput.value).toBe("");
        assertOptionsEnabled();

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(specifyOther).not.toBeChecked();
        expect(screen.queryByRole("spinbutton", { name: /dose/i })).toBeNull();
        expect(
          question.answers.map((answer) => answer.value).toSorted(),
        ).toEqual([1, 2, 5]);
        assertOptionsEnabled();
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

        render(<ListSelectRenderer node={question} />);

        const one = screen.getByRole("checkbox", { name: /dose.*1/i });
        const two = screen.getByRole("checkbox", { name: /dose.*2/i });
        const specifyOther = screen.getByRole("checkbox", {
          name: /specify other/i,
        });
        const assertOptionsEnabled = () => {
          expect(one).not.toBeDisabled();
          expect(two).not.toBeDisabled();
          expect(specifyOther).not.toBeDisabled();
        };

        assertOptionsEnabled();
        fireEvent.click(specifyOther);
        expect(specifyOther).toBeChecked();
        expect(
          screen.getByRole("spinbutton", { name: /dose/i }),
        ).toBeInTheDocument();
        assertOptionsEnabled();

        fireEvent.change(screen.getByRole("spinbutton", { name: /dose/i }), {
          target: { value: "5" },
        });
        fireEvent.click(
          screen.getByRole("button", { name: strings.dialog.add }),
        );
        expect(specifyOther).not.toBeChecked();
        expect(screen.queryByRole("spinbutton", { name: /dose/i })).toBeNull();
        assertOptionsEnabled();

        const customOption = screen.getByRole("checkbox", {
          name: /dose.*5/i,
        });
        fireEvent.click(customOption);
        expect(
          screen.getByRole("checkbox", { name: /dose.*5/i }),
        ).not.toBeChecked();
        assertOptionsEnabled();

        fireEvent.click(specifyOther);
        expect(specifyOther).toBeChecked();
        expect(
          screen.getByRole("spinbutton", { name: /dose/i }),
        ).toBeInTheDocument();
        assertOptionsEnabled();
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

        render(<ListSelectRenderer node={question} />);

        fireEvent.click(screen.getByRole("radio", { name: /specify other/i }));
        const customInput = screen.getByRole("spinbutton", {
          name: "Dose",
        }) as HTMLInputElement;
        fireEvent.change(customInput, {
          target: { value: "5" },
        });
        fireEvent.click(
          screen.getByRole("button", { name: strings.dialog.add }),
        );

        expect(screen.queryByRole("spinbutton", { name: "Dose" })).toBeNull();
        const customValue = screen.getByRole("radio", {
          name: /5/,
        }) as HTMLInputElement;
        expect(customValue).toBeChecked();
        expect(customValue).not.toBeDisabled();
        const [customAnswer] = getQuantityAnswers(question);
        expect(customAnswer?.value).toBe(5);
      });
    });

    describe("string interactions", () => {
      it("keeps specify other selected when custom value matches an option", () => {
        const questionnaire: Questionnaire = {
          resourceType: "Questionnaire",
          status: "active",
          item: [
            {
              linkId: "call-sign",
              text: "Call sign",
              type: "string",
              answerConstraint: "optionsOrType",
              answerOption: [
                { valueString: "Alpha" },
                { valueString: "Bravo" },
                { valueString: "Charlie" },
                { valueString: "Delta" },
                { valueString: "Echo" },
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "call-sign");

        render(<ListSelectRenderer node={question} />);

        const optionLabels = ["Alpha", "Bravo", "Charlie", "Delta", "Echo"];
        const optionByLabel = new Map(
          optionLabels.map((label) => [
            label,
            screen.getByRole("radio", { name: label }) as HTMLInputElement,
          ]),
        );
        const specifyOther = screen.getByRole("radio", {
          name: /specify other/i,
        });
        const echo = optionByLabel.get("Echo")!;
        const assertOptionsEnabled = () => {
          optionByLabel.forEach((option) => {
            expect(option).not.toBeDisabled();
          });
          expect(specifyOther).not.toBeDisabled();
        };

        assertOptionsEnabled();
        fireEvent.click(specifyOther);
        expect(specifyOther).toBeChecked();
        assertOptionsEnabled();

        const customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Echo" } });
        expect(echo).not.toBeChecked();
        expect(specifyOther).toBeChecked();
        expect(screen.getByRole("textbox", { name: "Call sign" })).toHaveValue(
          "Echo",
        );
        assertOptionsEnabled();

        fireEvent.change(customInput, { target: { value: "Echoless" } });
        expect(echo).not.toBeChecked();
        expect(specifyOther).toBeChecked();
        expect(screen.getByRole("textbox", { name: "Call sign" })).toHaveValue(
          "Echoless",
        );
        assertOptionsEnabled();
      });

      it("keeps specify other selected when custom value matches an option for multi select", () => {
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
              answerOption: [
                { valueString: "Alpha" },
                { valueString: "Bravo" },
                { valueString: "Charlie" },
                { valueString: "Delta" },
                { valueString: "Echo" },
              ],
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "call-sign");

        render(<ListSelectRenderer node={question} />);

        const optionLabels = ["Alpha", "Bravo", "Charlie", "Delta", "Echo"];
        const optionByLabel = new Map(
          optionLabels.map((label) => [
            label,
            screen.getByRole("checkbox", {
              name: new RegExp(`call sign ${label}`, "i"),
            }) as HTMLInputElement,
          ]),
        );
        const specifyOther = screen.getByRole("checkbox", {
          name: /specify other/i,
        });
        const echo = optionByLabel.get("Echo")!;
        const assertOptionsEnabled = () => {
          optionByLabel.forEach((option) => {
            expect(option).not.toBeDisabled();
          });
          expect(specifyOther).not.toBeDisabled();
        };

        assertOptionsEnabled();
        fireEvent.click(specifyOther);
        expect(specifyOther).toBeChecked();
        assertOptionsEnabled();

        const customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Echo" } });
        expect(echo).not.toBeChecked();
        expect(specifyOther).toBeChecked();
        expect(screen.getByRole("textbox", { name: "Call sign" })).toHaveValue(
          "Echo",
        );
        assertOptionsEnabled();

        fireEvent.change(customInput, { target: { value: "Echoless" } });
        expect(echo).not.toBeChecked();
        expect(specifyOther).toBeChecked();
        expect(screen.getByRole("textbox", { name: "Call sign" })).toHaveValue(
          "Echoless",
        );
        assertOptionsEnabled();
      });

      it("keeps specify other selected when custom value matches an option with nested items", () => {
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

        render(<ListSelectRenderer node={question} />);

        const optionLabels = ["Alpha", "Echo"];
        const optionByLabel = new Map(
          optionLabels.map((label) => [
            label,
            screen.getByRole("radio", { name: label }) as HTMLInputElement,
          ]),
        );
        const specifyOther = screen.getByRole("radio", {
          name: /specify other/i,
        });
        const echo = optionByLabel.get("Echo")!;
        const assertOptionsEnabled = () => {
          optionByLabel.forEach((option) => {
            expect(option).not.toBeDisabled();
          });
          expect(specifyOther).not.toBeDisabled();
        };

        assertOptionsEnabled();
        fireEvent.click(specifyOther);
        expect(specifyOther).toBeChecked();
        assertOptionsEnabled();

        const customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Echo" } });
        expect(echo).not.toBeChecked();
        expect(specifyOther).toBeChecked();
        expect(screen.getByRole("textbox", { name: "Call sign" })).toHaveValue(
          "Echo",
        );
        assertOptionsEnabled();
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
            },
          ],
        };

        const form = new FormStore(questionnaire);
        const question = getQuestion(form, "call-sign");

        render(<ListSelectRenderer node={question} />);

        fireEvent.click(screen.getByRole("radio", { name: /specify other/i }));

        const customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        expect(customInput.minLength).toBe(3);
        expect(customInput.maxLength).toBe(8);
      });

      it("uses maxDecimalPlaces and unit display extensions in open-choice decimal inputs", () => {
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

        render(<ListSelectRenderer node={question} />);

        fireEvent.click(screen.getByRole("radio", { name: /specify other/i }));

        const customInput = screen.getByRole("spinbutton", {
          name: "Dose",
        }) as HTMLInputElement;
        expect(customInput).toHaveAttribute("step", "0.01");
        expect(screen.getByText("mg/L")).toBeInTheDocument();
      });

      it("renders unit options from questionnaire-unitOption for quantity open-choice inputs", () => {
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

        render(<ListSelectRenderer node={question} />);

        fireEvent.click(screen.getByRole("radio", { name: /specify other/i }));

        const combobox = screen.getByRole("combobox", {
          name: "Dosage",
        }) as HTMLInputElement;
        expect(combobox).toBeInTheDocument();
        expect(screen.queryByRole("textbox", { name: "Dosage" })).toBeNull();
        fireEvent.click(combobox);
        const listbox = getListbox(combobox);
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

        const { container } = render(<ListSelectRenderer node={question} />);

        fireEvent.click(screen.getByRole("radio", { name: /specify other/i }));

        const fileInput = container.querySelector('input[type="file"]') as
          | HTMLInputElement
          | undefined;
        expect(fileInput).not.toBeNull();
        expect(fileInput).toHaveAttribute(
          "accept",
          "image/png,application/pdf",
        );
      });
    });

    describe("multiple custom answers", () => {
      it("adds multiple custom answers without auto-selecting options", () => {
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

        render(<ListSelectRenderer node={question} />);

        const option = screen.getByRole("checkbox", { name: /echo/i });
        const specifyOther = screen.getByRole("checkbox", {
          name: /specify other/i,
        });
        const assertOptionsEnabled = () => {
          expect(option).not.toBeDisabled();
          expect(specifyOther).not.toBeDisabled();
        };

        assertOptionsEnabled();
        fireEvent.click(specifyOther);
        expect(specifyOther).toBeChecked();
        assertOptionsEnabled();

        let customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Whiskey" } });
        expect(option).not.toBeChecked();
        assertOptionsEnabled();

        fireEvent.click(
          screen.getByRole("button", { name: strings.dialog.add }),
        );
        expect(specifyOther).not.toBeChecked();
        expect(option).not.toBeChecked();
        expect(
          screen.getByRole("checkbox", { name: /whiskey/i }),
        ).toBeChecked();
        assertOptionsEnabled();

        fireEvent.click(specifyOther);
        customInput = screen.getByRole("textbox", {
          name: "Call sign",
        }) as HTMLInputElement;
        fireEvent.change(customInput, { target: { value: "Zulu" } });
        fireEvent.click(
          screen.getByRole("button", { name: strings.dialog.add }),
        );
        expect(specifyOther).not.toBeChecked();
        expect(option).not.toBeChecked();
        expect(screen.getByRole("checkbox", { name: /zulu/i })).toBeChecked();
        assertOptionsEnabled();
      });
    });
  });
});
