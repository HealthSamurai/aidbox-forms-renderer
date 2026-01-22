import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Questionnaire, QuestionnaireItemAnswerOption } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { ListSelectRenderer } from "@formbox/renderer/component/question/renderer/list-select-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

const minLengthExtension = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/minLength",
  valueInteger: value,
});

describe("maxLength", () => {
  it("enforces maxLength on text answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "notes",
          text: "Notes",
          type: "text",
          maxLength: 5,
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("notes");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    const tooLongAnswer = question.answers[0];
    assertDefined(tooLongAnswer);
    tooLongAnswer.setValueByUser("Too long");
    expect(form.validateAll()).toBe(false);
    const longIssues = answer.issues ?? [];
    expect(longIssues).toHaveLength(1);
    expect(longIssues[0]?.diagnostics).toMatch(/maximum length/i);

    const spacesAnswer = question.answers[0];
    assertDefined(spacesAnswer);
    spacesAnswer.setValueByUser("   ");
    expect(question.hasErrors).toBe(false);
    expect(answer.issues).toHaveLength(0);

    const shortAnswer = question.answers[0];
    assertDefined(shortAnswer);
    shortAnswer.setValueByUser("short");
    expect(question.hasErrors).toBe(false);
  });

  it("ignores conflicting minLength/maxLength configuration", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "passcode",
          text: "Passcode",
          type: "string",
          maxLength: 3,
          extension: [minLengthExtension(5)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("passcode");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    expect(form.validateAll()).toBe(true);
    expect(answer.issues).toHaveLength(0);
  });

  it("ignores maxLength for non-simple types", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "weight",
          text: "Weight",
          type: "quantity",
          maxLength: 2,
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("weight");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    answer.setValueByUser({ value: 120, unit: "kg" });
    expect(form.validateAll()).toBe(true);
    expect(answer.issues).toHaveLength(0);
  });

  it("applies maxLength to open-choice string inputs", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          answerConstraint: "optionsOrString",
          maxLength: 4,
          answerOption: [
            {
              valueQuantity: {
                value: 1,
                unit: "mg",
              },
            } as QuestionnaireItemAnswerOption,
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("dose");
    assertQuestionNode(question);

    render(<ListSelectRenderer node={question as IQuestionNode<"quantity">} />);

    fireEvent.click(screen.getByRole("radio", { name: /specify other/i }));

    const customInput = screen.getByRole("textbox", {
      name: "Dose",
    }) as HTMLInputElement;
    expect(customInput).toHaveAttribute("maxlength", "4");
  });
});
