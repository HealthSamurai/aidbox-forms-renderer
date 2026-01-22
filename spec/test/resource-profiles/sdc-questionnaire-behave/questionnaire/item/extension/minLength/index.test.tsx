import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { StringRenderer } from "@formbox/renderer/component/question/fhir/string/string-renderer.tsx";
import { ListSelectRenderer } from "@formbox/renderer/component/question/renderer/list-select-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

const minLengthExtension = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/minLength",
  valueInteger: value,
});

describe("minLength", () => {
  it("enforces minLength lower bound", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "nickname",
          text: "Preferred name",
          type: "string",
          maxLength: 10,
          extension: [minLengthExtension(3)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("nickname");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    const shortAnswer = question.answers[0];
    assertDefined(shortAnswer);
    shortAnswer.setValueByUser("Jo");
    expect(form.validateAll()).toBe(false);
    expect(answer.issues).toHaveLength(1);
    expect(answer.issues[0]?.diagnostics).toMatch(/at least 3/i);

    const validAnswer = question.answers[0];
    assertDefined(validAnswer);
    validAnswer.setValueByUser("Joan");
    expect(answer.issues).toHaveLength(0);
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

  it("applies minLength and maxLength as input attributes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "nickname",
          text: "Nickname",
          type: "string",
          maxLength: 10,
          extension: [minLengthExtension(2)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("nickname");
    assertQuestionNode(question);

    render(<StringRenderer node={question as IQuestionNode<"string">} />);

    const input = screen.getByLabelText("Nickname") as HTMLInputElement;
    expect(input).toHaveAttribute("minlength", "2");
    expect(input).toHaveAttribute("maxlength", "10");
  });

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
          extension: [minLengthExtension(3)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("call-sign");
    assertQuestionNode(question);

    render(<ListSelectRenderer node={question as IQuestionNode<"string">} />);

    fireEvent.click(screen.getByRole("radio", { name: /specify other/i }));

    const customInput = screen.getByRole("textbox", {
      name: "Call sign",
    }) as HTMLInputElement;
    expect(customInput.minLength).toBe(3);
    expect(customInput.maxLength).toBe(8);
  });
});
