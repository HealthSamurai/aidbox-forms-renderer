import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type {
  Quantity,
  Questionnaire,
  QuestionnaireItemAnswerOption,
  QuestionnaireResponse,
} from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { ListSelectRenderer } from "@formbox/renderer/component/question/renderer/list-select-renderer.tsx";
import type { AnswerType, IQuestionNode } from "@formbox/renderer/types.ts";
import { EXT } from "@formbox/renderer/utilities.ts";
import { strings } from "@formbox/renderer/strings.ts";

const valueDisplayOverrides = vi.hoisted(
  () => new Map<AnswerType, (properties: { value: unknown }) => ReactNode>(),
);

vi.mock(
  "@formbox/renderer/component/question/fhir/value-display.tsx",
  async () => {
    const actual = await vi.importActual<
      typeof import("@formbox/renderer/component/question/fhir/value-display.tsx")
    >("@formbox/renderer/component/question/fhir/value-display.tsx");

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
  },
);

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

describe("itemControl.radio-button", () => {
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
  });
});
