import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { ListSelectRenderer } from "@formbox/renderer/component/question/renderer/list-select-renderer.tsx";
import type { AnswerType, IQuestionNode } from "@formbox/renderer/types.ts";
import { EXT } from "@formbox/renderer/utilities.ts";
import { strings } from "@formbox/renderer/strings.ts";

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

describe("itemControl.check-box", () => {
  describe("optionsOnly", () => {
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

    describe("string interactions", () => {
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
