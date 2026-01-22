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

const mgQuantity = (value: number) => ({
  value,
  unit: "mg",
  system: "http://unitsofmeasure.org",
  code: "mg",
});

describe("minQuantity", () => {
  it("uses SDC minQuantity over core minValue when both present", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [
            minQuantityExtension(10, "mg"),
            {
              url: "http://hl7.org/fhir/StructureDefinition/minValue",
              valueQuantity: {
                value: 30,
                unit: "mg",
                system: "http://unitsofmeasure.org",
                code: "mg",
              },
            },
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
      answer.setValueByUser(mgQuantity(12));
    }
    expect(answer.issues).toHaveLength(0);

    {
      const answer = question.answers[0];
      assertDefined(answer);
      answer.setValueByUser(mgQuantity(8));
    }
    expect(form.validateAll()).toBe(false);
    expect(
      answer.issues.some((issue) =>
        issue.diagnostics?.match(/greater than or equal to 10/),
      ),
    ).toBe(true);
  });

  it("applies minQuantity as the input minimum", () => {
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
            {
              url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-maxQuantity",
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
    const question = form.scope.lookupNode("weight");
    assertQuestionNode(question);

    render(<QuantityRenderer node={question as IQuestionNode<"quantity">} />);

    const input = screen.getByRole("spinbutton", {
      name: /weight/i,
    }) as HTMLInputElement;
    expect(input.getAttribute("min")).toBe("40");
  });

  it("converts UCUM units when validating minQuantity", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "dose",
          text: "Dose",
          type: "quantity",
          extension: [minQuantityExtension(1, "g")],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("dose");
    assertQuestionNode(question);
    const answer = question.answers[0];
    assertDefined(answer);

    answer.setValueByUser({
      value: 500,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(form.validateAll()).toBe(false);
    expect(answer.issues.at(0)?.diagnostics).toMatch(/greater than or equal/i);

    answer.setValueByUser({
      value: 1000,
      unit: "mg",
      system: "http://unitsofmeasure.org",
      code: "mg",
    });
    expect(form.validateAll()).toBe(true);
    expect(answer.issues).toHaveLength(0);
  });
});
