import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { DecimalRenderer } from "@formbox/renderer/component/question/fhir/decimal/decimal-renderer.tsx";
import { ListSelectRenderer } from "@formbox/renderer/component/question/renderer/list-select-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { EXT } from "@formbox/renderer/utilities.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

const maxDecimalPlacesExtension = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxDecimalPlaces",
  valueInteger: value,
});

describe("maxDecimalPlaces", () => {
  it("enforces maxDecimalPlaces for decimal answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "amount",
          text: "Donation amount",
          type: "decimal",
          extension: [maxDecimalPlacesExtension(2)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("amount");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    const invalidAnswer = question.answers[0];
    assertDefined(invalidAnswer);
    invalidAnswer.setValueByUser(12.345);
    expect(form.validateAll()).toBe(false);
    expect(answer.issues).toHaveLength(1);
    expect(answer.issues[0]?.diagnostics).toMatch(/decimal place/i);

    const validAnswer = question.answers[0];
    assertDefined(validAnswer);
    validAnswer.setValueByUser(12.34);
    expect(answer.issues).toHaveLength(0);
  });

  it("continues enforcing maxDecimalPlaces on subsequent updates", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "amount",
          text: "Donation amount",
          type: "decimal",
          extension: [maxDecimalPlacesExtension(2)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("amount");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    const invalidAnswer = question.answers[0];
    assertDefined(invalidAnswer);
    invalidAnswer.setValueByUser(12.345);
    expect(form.validateAll()).toBe(false);
    expect(answer.issues).toHaveLength(1);
    expect(answer.issues[0]?.diagnostics).toMatch(/decimal place/i);

    const validAnswer = question.answers[0];
    assertDefined(validAnswer);
    validAnswer.setValueByUser(12.34);
    expect(answer.issues).toHaveLength(0);
  });

  it("counts decimal places for scientific notation", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "concentration",
          text: "Concentration",
          type: "decimal",
          extension: [maxDecimalPlacesExtension(2)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("concentration");
    assertQuestionNode(question);

    const answer = question.answers[0];
    assertDefined(answer);
    answer.setValueByUser(1.23e-4);

    expect(form.validateAll()).toBe(false);
    expect(answer.issues.at(0)?.diagnostics).toMatch(/decimal place/i);
  });

  it("enforces maxDecimalPlaces for quantity answers", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [maxDecimalPlacesExtension(2)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("dose");
    assertQuestionNode(question);

    const answer = question.answers[0];
    assertDefined(answer);
    answer.setValueByUser({ value: 1.234, unit: "mg" });

    expect(form.validateAll()).toBe(false);
    expect(answer.issues.at(0)?.diagnostics).toMatch(/decimal place/i);
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
            maxDecimalPlacesExtension(2),
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
    const question = form.scope.lookupNode("dose");
    assertQuestionNode(question);

    render(<ListSelectRenderer node={question as IQuestionNode<"decimal">} />);

    fireEvent.click(screen.getByRole("radio", { name: /specify other/i }));

    const customInput = screen.getByRole("spinbutton", {
      name: "Dose",
    }) as HTMLInputElement;
    expect(customInput).toHaveAttribute("step", "0.01");
    expect(screen.getByText("mg/L")).toBeInTheDocument();
  });

  it("applies maxDecimalPlaces to decimal inputs", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "glucose",
          text: "Glucose",
          type: "decimal",
          extension: [maxDecimalPlacesExtension(2)],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("glucose");
    assertQuestionNode(question);

    render(<DecimalRenderer node={question as IQuestionNode<"decimal">} />);

    const input = screen.getByLabelText("Glucose") as HTMLInputElement;
    expect(input).toHaveAttribute("step", "0.01");
  });
});
