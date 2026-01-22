import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { QuantityRenderer } from "@formbox/renderer/component/question/fhir/quantity/quantity-renderer.tsx";
import type { IQuestionNode } from "@formbox/renderer/types.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

const minQuantityExtension = (value: number, unit = "kg") => ({
  url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-minQuantity",
  valueQuantity: {
    value,
    unit,
    system: "http://unitsofmeasure.org",
    code: unit,
  },
});

const maxQuantityExtension = (value: number, unit = "kg") => ({
  url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-maxQuantity",
  valueQuantity: {
    value,
    unit,
    system: "http://unitsofmeasure.org",
    code: unit,
  },
});

const mgQuantity = (value: number) => ({
  value,
  unit: "mg",
  system: "http://unitsofmeasure.org",
  code: "mg",
});

describe("maxQuantity", () => {
  it("enforces quantity extensions and unit compatibility", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "dose",
          text: "Medication dose",
          type: "quantity",
          extension: [
            minQuantityExtension(10, "mg"),
            maxQuantityExtension(20, "mg"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("dose");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    {
      const answer = question.answers[0];
      assertDefined(answer);
      answer.setValueByUser(mgQuantity(5));
    }
    expect(form.validateAll()).toBe(false);
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/greater than or equal to/i),
      ),
    ).toBe(true);

    {
      const answer = question.answers[0];
      assertDefined(answer);
      answer.setValueByUser(mgQuantity(30));
    }
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/less than or equal to/i),
      ),
    ).toBe(true);

    const incompatibleUnitAnswer = question.answers[0];
    assertDefined(incompatibleUnitAnswer);
    incompatibleUnitAnswer.setValueByUser({
      value: 15,
      unit: "g",
      system: "http://unitsofmeasure.org",
      code: "g",
    });
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/greater than or equal to/i),
      ),
    ).toBe(false);
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/less than or equal to/i),
      ),
    ).toBe(true);

    const customUnitAnswer = question.answers[0];
    assertDefined(customUnitAnswer);
    customUnitAnswer.setValueByUser({
      value: 15,
      unit: "mgplus",
      system: "http://example.com/unit-system",
      code: "mgplus",
    });
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/greater than or equal to/i),
      ),
    ).toBe(true);
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/less than or equal to/i),
      ),
    ).toBe(true);

    {
      const answer = question.answers[0];
      assertDefined(answer);
      answer.setValueByUser(mgQuantity(15));
    }
    expect(answer.issues).toHaveLength(0);
  });

  it("applies maxQuantity as the input maximum", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "weight",
          text: "Weight",
          type: "quantity",
          extension: [
            minQuantityExtension(40, "kg"),
            maxQuantityExtension(200, "kg"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("weight");
    assertQuestionNode(question);

    render(<QuantityRenderer node={question as IQuestionNode<"quantity">} />);

    const input = screen.getByRole("spinbutton", {
      name: /weight/i,
    }) as HTMLInputElement;
    expect(input.getAttribute("max")).toBe("200");
  });

  it("converts UCUM units when validating maxQuantity", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [maxQuantityExtension(1, "g")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("dose");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    answer.setValueByUser({
      value: 1500,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(form.validateAll()).toBe(false);
    expect(answer.issues.at(0)?.diagnostics).toMatch(/less than or equal/i);

    answer.setValueByUser({
      value: 500,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(form.validateAll()).toBe(true);
    expect(answer.issues).toHaveLength(0);
  });
});
