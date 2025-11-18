import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form/form-store.ts";
import { isRepeatingGroupWrapper } from "../nodes/groups/repeating-group-wrapper.ts";
import { isGroupNode } from "../nodes/groups/group-store.ts";
import { isQuestionNode } from "../nodes/questions/question-store.ts";
import {
  makeCqfExpression,
  makeMaxOccursExpression,
  makeMinOccursExpression,
  makeVariable,
} from "./expression-fixtures.ts";
import type {
  AnswerType,
  IAnswerInstance,
  IPresentableNode,
  IQuestionNode,
} from "../../types.ts";

const minOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs",
  valueInteger: value,
});

const maxOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
  valueInteger: value,
});

const minValueInteger = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/minValue",
  valueInteger: value,
});

const maxValueInteger = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxValue",
  valueInteger: value,
});

const minValueDate = (value: string) => ({
  url: "http://hl7.org/fhir/StructureDefinition/minValue",
  valueDate: value,
});

const maxValueDate = (value: string) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxValue",
  valueDate: value,
});

const minValueDateTime = (value: string) => ({
  url: "http://hl7.org/fhir/StructureDefinition/minValue",
  valueDateTime: value,
});

const maxValueDateTime = (value: string) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxValue",
  valueDateTime: value,
});

const minValueQuantity = (value: { value: number; unit?: string }) => ({
  url: "http://hl7.org/fhir/StructureDefinition/minValue",
  valueQuantity: value,
});

const maxValueQuantity = (value: { value: number; unit?: string }) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxValue",
  valueQuantity: value,
});

const minLengthExtension = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/minLength",
  valueInteger: value,
});

const maxDecimalPlacesExtension = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxDecimalPlaces",
  valueInteger: value,
});

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

const mimeTypeExtension = (code: string) => ({
  url: "http://hl7.org/fhir/StructureDefinition/mimeType",
  valueCode: code,
});

const maxSizeExtension = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxSize",
  valueDecimal: value,
});

const expectQuestionNode = <T extends AnswerType = AnswerType>(
  node: IPresentableNode | undefined,
): IQuestionNode<T> => {
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected question node");
  }
  return node as IQuestionNode<T>;
};

const expectAnswerInstance = <T extends AnswerType = AnswerType>(
  question: IQuestionNode<T>,
  index = 0,
): IAnswerInstance<T> => {
  const answer = question.answers[index];
  expect(answer).toBeDefined();
  if (!answer) {
    throw new Error("Expected answer instance");
  }
  return answer as IAnswerInstance<T>;
};

describe("validation", () => {
  describe("question", () => {
    it("defers validation until submit for untouched required questions", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "first-name",
            text: "First name",
            type: "string",
            required: true,
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = expectQuestionNode(form.scope.lookupNode("first-name"));

      expect(question.hasErrors).toBe(false);
      expect(question.issues).toHaveLength(0);

      expect(form.validateAll()).toBe(false);
      expect(question.hasErrors).toBe(true);
      expect(question.issues.at(0)?.diagnostics).toMatch(/required/i);

      question.setAnswer(0, null);
      expect(question.issues).toHaveLength(1);

      question.setAnswer(0, "Alice");
      expect(form.validateAll()).toBe(true);
      expect(question.hasErrors).toBe(false);
    });

    it("updates question minOccurs when expression output changes", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "panel",
            type: "group",
            extension: [
              makeVariable(
                "requireTwo",
                "%context.item.where(linkId='gate').answer.valueBoolean.last()",
              ),
            ],
            item: [
              {
                linkId: "gate",
                type: "boolean",
              },
              {
                linkId: "target",
                type: "string",
                repeats: true,
                extension: [
                  makeMinOccursExpression(
                    "iif(%requireTwo.exists() and %requireTwo, 2, 1)",
                  ),
                  {
                    url: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
                    valueInteger: 5,
                  },
                ],
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const gate = form.scope.lookupNode("gate");
      const target = form.scope.lookupNode("target");

      if (!isQuestionNode(gate) || !isQuestionNode(target)) {
        throw new Error("Expected gate and target question stores");
      }

      expect(target.minOccurs).toBe(1);
      expect(target.canRemove).toBe(false);

      gate.setAnswer(0, true);
      expect(target.minOccurs).toBe(2);
      expect(target.canRemove).toBe(false);

      target.addAnswer("extra");
      expect(target.answers).toHaveLength(2);
      expect(target.canRemove).toBe(false);

      gate.setAnswer(0, false);
      expect(target.minOccurs).toBe(1);
      expect(target.canRemove).toBe(true);
    });

    it("caps additions when expression reduces maxOccurs", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "panel",
            type: "group",
            extension: [
              makeVariable(
                "limitOne",
                "%context.item.where(linkId='gate').answer.valueBoolean.last()",
              ),
            ],
            item: [
              {
                linkId: "gate",
                type: "boolean",
              },
              {
                linkId: "target",
                type: "string",
                repeats: true,
                extension: [
                  makeMaxOccursExpression(
                    "iif(%limitOne.exists() and %limitOne, 1, 3)",
                  ),
                ],
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const gate = form.scope.lookupNode("gate");
      const target = form.scope.lookupNode("target");

      if (!isQuestionNode(gate) || !isQuestionNode(target)) {
        throw new Error("Expected gate and target question stores");
      }

      expect(target.expressionRegistry.maxOccurs).toBeDefined();
      expect(target.expressionRegistry.maxOccurs?.error).toBeUndefined();
      expect(target.maxOccurs).toBe(3);

      target.addAnswer("first");
      target.addAnswer("second");
      target.addAnswer("third");
      expect(target.answers).toHaveLength(3);
      expect(target.canAdd).toBe(false);

      gate.setAnswer(0, true);
      expect(target.maxOccurs).toBe(1);
      expect(target.canAdd).toBe(false);

      const before = target.answers.length;
      target.addAnswer("fourth");
      expect(target.answers.length).toBe(before);

      target.removeAnswer(2);
      target.removeAnswer(1);
      expect(target.answers).toHaveLength(1);
      expect(target.canAdd).toBe(false);

      gate.setAnswer(0, false);
      expect(target.maxOccurs).toBe(3);
      expect(target.canAdd).toBe(true);
    });

    it("validates repeating question minOccurs across populated answers", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "symptom",
            text: "Symptoms",
            type: "string",
            repeats: true,
            extension: [minOccurs(2), maxOccurs(3)],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = expectQuestionNode(form.scope.lookupNode("symptom"));

      expect(form.validateAll()).toBe(false);
      expect(question.issues.at(0)?.diagnostics).toMatch(/least 2/);

      question.setAnswer(0, "Cough");
      expect(question.issues.at(0)?.diagnostics).toMatch(/least 2/);

      question.setAnswer(1, "Fever");
      expect(question.hasErrors).toBe(false);

      question.addAnswer();
      question.setAnswer(2, "Fatigue");
      expect(question.canAdd).toBe(false);
      expect(question.hasErrors).toBe(false);

      question.setAnswer(1, null);
      question.setAnswer(2, null);
      expect(question.issues.at(0)?.diagnostics).toMatch(/least 2/);
    });

    it("ignores readOnly questions during validation", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "readonly-question",
            text: "Read only value",
            type: "string",
            required: true,
            readOnly: true,
          },
        ],
      };

      const form = new FormStore(questionnaire);
      expect(form.validateAll()).toBe(true);
      const question = expectQuestionNode(
        form.scope.lookupNode("readonly-question"),
      );
      expect(question.hasErrors).toBe(false);
    });

    it("makes questions required only when the guard expression is true", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "panel",
            type: "group",
            extension: [
              makeVariable(
                "gateFlag",
                "%context.item.where(linkId='gate').answer.valueBoolean.last()",
              ),
            ],
            item: [
              {
                linkId: "gate",
                type: "boolean",
              },
              {
                linkId: "detail",
                type: "string",
                _required: {
                  extension: [makeCqfExpression("%gateFlag")],
                },
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const gate = form.scope.lookupNode("gate");
      const detail = form.scope.lookupNode("detail");

      if (!isQuestionNode(gate) || !isQuestionNode(detail)) {
        throw new Error("Expected gate and detail questions");
      }

      expect(form.validateAll()).toBe(true);
      expect(detail.required).toBe(false);

      gate.setAnswer(0, true);
      expect(detail.required).toBe(true);
      expect(form.validateAll()).toBe(false);

      expect(detail.issues.some((issue) => issue.code === "required")).toBe(
        true,
      );

      detail.setAnswer(0, "value");
      expect(form.validateAll()).toBe(true);
    });
  });

  describe("answer", () => {
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
      const question = expectQuestionNode(form.scope.lookupNode("notes"));
      const answer = expectAnswerInstance(question);

      question.setAnswer(0, "Too long");
      const longIssues = answer.issues ?? [];
      expect(longIssues).toHaveLength(1);
      expect(longIssues[0]?.diagnostics).toMatch(/maximum length/i);

      question.setAnswer(0, "   ");
      expect(question.hasErrors).toBe(false);
      expect(answer.issues).toHaveLength(0);

      question.setAnswer(0, "short");
      expect(question.hasErrors).toBe(false);
    });

    it("checks numeric boundaries", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "age",
            text: "Age",
            type: "integer",
            extension: [minValueInteger(0), maxValueInteger(120)],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = expectQuestionNode(form.scope.lookupNode("age"));
      const answer = expectAnswerInstance(question);
      question.setAnswer(0, -1);
      const minIssues = answer.issues ?? [];
      expect(minIssues).toHaveLength(1);
      expect(minIssues[0]?.diagnostics).toMatch(/greater than or equal to/i);

      question.setAnswer(0, 130);
      const maxIssues = answer.issues ?? [];
      expect(maxIssues).toHaveLength(1);
      expect(maxIssues[0]?.diagnostics).toMatch(/less than or equal to/i);

      question.setAnswer(0, 35);
      expect(question.hasErrors).toBe(false);
    });

    it("validates date and dateTime boundaries", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "birth",
            text: "Date of birth",
            type: "date",
            extension: [minValueDate("2000-01-01"), maxValueDate("2020-12-31")],
          },
          {
            linkId: "check-in",
            text: "Check-in",
            type: "dateTime",
            extension: [
              minValueDateTime("2024-01-01T00:00:00Z"),
              maxValueDateTime("2024-12-31T23:59:59Z"),
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const birth = expectQuestionNode(form.scope.lookupNode("birth"));
      const checkIn = expectQuestionNode(form.scope.lookupNode("check-in"));
      const birthAnswer = expectAnswerInstance(birth);
      const checkInAnswer = expectAnswerInstance(checkIn);

      birth.setAnswer(0, "1999-12-31");
      expect(birthAnswer.issues.at(0)?.diagnostics).toMatch(/not be earlier/i);

      birth.setAnswer(0, "2021-01-01");
      expect(birthAnswer.issues.at(0)?.diagnostics).toMatch(/not be later/i);

      birth.setAnswer(0, "2010-05-05");
      expect(birth.hasErrors).toBe(false);

      checkIn.setAnswer(0, "2023-12-31T23:59:59Z");
      expect(checkInAnswer.issues.at(0)?.diagnostics).toMatch(
        /not be earlier/i,
      );

      checkIn.setAnswer(0, "2025-01-01T00:00:00Z");
      expect(checkInAnswer.issues.at(0)?.diagnostics).toMatch(/not be later/i);

      checkIn.setAnswer(0, "2024-06-01T12:00:00Z");
      expect(checkIn.hasErrors).toBe(false);
    });

    it("enforces quantity limits", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "weight",
            text: "Weight",
            type: "quantity",
            extension: [
              minValueQuantity({ value: 10, unit: "kg" }),
              maxValueQuantity({ value: 200, unit: "kg" }),
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = expectQuestionNode(form.scope.lookupNode("weight"));
      const answer = expectAnswerInstance(question);

      question.setAnswer(0, { value: 5, unit: "kg" });
      expect(answer.issues.at(0)?.diagnostics).toMatch(
        /greater than or equal to/i,
      );

      question.setAnswer(0, { value: 250, unit: "kg" });
      expect(answer.issues.at(0)?.diagnostics).toMatch(
        /less than or equal to/i,
      );

      question.setAnswer(0, { value: 75, unit: "kg" });
      expect(answer.issues).toHaveLength(0);
    });

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
      const question = expectQuestionNode(form.scope.lookupNode("nickname"));
      const answer = expectAnswerInstance(question);

      question.setAnswer(0, "Jo");
      expect(answer.issues).toHaveLength(1);
      expect(answer.issues[0]?.diagnostics).toMatch(/at least 3/i);

      question.setAnswer(0, "Joan");
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
      const question = expectQuestionNode(form.scope.lookupNode("passcode"));
      const answer = expectAnswerInstance(question);

      expect(form.validateAll()).toBe(true);
      expect(answer.issues).toHaveLength(0);
    });

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
      const question = expectQuestionNode(form.scope.lookupNode("amount"));
      const answer = expectAnswerInstance(question);

      question.setAnswer(0, 12.345);
      expect(answer.issues).toHaveLength(1);
      expect(answer.issues[0]?.diagnostics).toMatch(/decimal place/i);

      question.setAnswer(0, 12.34);
      expect(answer.issues).toHaveLength(0);
    });

    it("ignores min/max conflicts for integer bounds", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "priority",
            text: "Priority",
            type: "integer",
            extension: [minValueInteger(5), maxValueInteger(3)],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = expectQuestionNode(form.scope.lookupNode("priority"));
      const answer = expectAnswerInstance(question);

      expect(form.validateAll()).toBe(true);
      expect(answer.issues).toHaveLength(0);
    });

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
      const question = expectQuestionNode(form.scope.lookupNode("dose"));
      const answer = expectAnswerInstance(question);

      const mgQuantity = (value: number) => ({
        value,
        unit: "mg",
        system: "http://unitsofmeasure.org",
        code: "mg",
      });

      question.setAnswer(0, mgQuantity(5));
      expect(
        answer.issues.some((issue) =>
          issue.diagnostics?.match(/greater than or equal to/i),
        ),
      ).toBe(true);

      question.setAnswer(0, mgQuantity(30));
      expect(
        answer.issues.some((issue) =>
          issue.diagnostics?.match(/less than or equal to/i),
        ),
      ).toBe(true);

      question.setAnswer(0, {
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

      question.setAnswer(0, {
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

      question.setAnswer(0, mgQuantity(15));
      expect(answer.issues).toHaveLength(0);
    });

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
      const question = expectQuestionNode(form.scope.lookupNode("dose"));
      const answer = expectAnswerInstance(question);

      const mgQuantity = (value: number) => ({
        value,
        unit: "mg",
        system: "http://unitsofmeasure.org",
        code: "mg",
      });

      question.setAnswer(0, mgQuantity(12));
      expect(answer.issues).toHaveLength(0);

      question.setAnswer(0, mgQuantity(8));
      expect(
        answer.issues.some((issue) =>
          issue.diagnostics?.match(/greater than or equal to 10/),
        ),
      ).toBe(true);
    });

    it("prefers expression-based quantity bounds over static values", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "fluid",
            text: "Fluid intake",
            type: "quantity",
            extension: [minQuantityExtension(5, "ml")],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = expectQuestionNode(form.scope.lookupNode("fluid"));
      const answer = expectAnswerInstance(question);

      const registry = question.expressionRegistry;

      Object.defineProperty(registry, "minValue", {
        configurable: true,
        value: {
          value: [
            {
              value: 20,
              unit: "ml",
              system: "http://unitsofmeasure.org",
              code: "ml",
            },
          ],
        },
      });

      const mlQuantity = (value: number) => ({
        value,
        unit: "ml",
        system: "http://unitsofmeasure.org",
        code: "ml",
      });

      question.setAnswer(0, mlQuantity(15));
      expect(
        answer.issues.some((issue) =>
          issue.diagnostics?.match(/greater than or equal to 20/),
        ),
      ).toBe(true);

      question.setAnswer(0, mlQuantity(22));
      expect(answer.issues).toHaveLength(0);
    });

    it("ignores static numeric bounds when expression slot is invalid", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "score",
            text: "Score",
            type: "integer",
            extension: [minValueInteger(10)],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = expectQuestionNode(form.scope.lookupNode("score"));
      const answer = expectAnswerInstance(question);

      const registry = question.expressionRegistry;
      Object.defineProperty(registry, "minValue", {
        configurable: true,
        value: {
          value: [true],
        },
      });

      question.setAnswer(0, 3);
      expect(answer.issues).toHaveLength(0);

      question.setAnswer(0, 12);
      expect(answer.issues).toHaveLength(0);
    });

    it("enforces numeric bounds from expression slot results", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "score",
            text: "Score",
            type: "integer",
            extension: [minValueInteger(10)],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = expectQuestionNode(form.scope.lookupNode("score"));
      const answer = expectAnswerInstance(question);

      const registry = question.expressionRegistry;
      Object.defineProperty(registry, "minValue", {
        configurable: true,
        value: {
          value: [25],
        },
      });

      question.setAnswer(0, 20);
      expect(
        answer.issues.some((issue) =>
          issue.diagnostics?.match(/greater than or equal to 25/),
        ),
      ).toBe(true);

      question.setAnswer(0, 30);
      expect(answer.issues).toHaveLength(0);
    });

    it("considers only the first entry from expression result arrays", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "score",
            text: "Score",
            type: "integer",
            extension: [minValueInteger(10)],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = expectQuestionNode(form.scope.lookupNode("score"));
      const answer = expectAnswerInstance(question);

      const registry = question.expressionRegistry;
      Object.defineProperty(registry, "minValue", {
        configurable: true,
        value: {
          value: [true, 40],
        },
      });

      question.setAnswer(0, 5);
      expect(answer.issues).toHaveLength(0);

      question.setAnswer(0, 45);
      expect(answer.issues).toHaveLength(0);
    });

    it("enforces attachment mime type and max size", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "photo",
            text: "Upload photo",
            type: "attachment",
            extension: [
              mimeTypeExtension("image/png"),
              mimeTypeExtension("image/jpeg"),
              maxSizeExtension(512),
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = expectQuestionNode(form.scope.lookupNode("photo"));
      const answer = expectAnswerInstance(question);

      question.setAnswer(0, {
        contentType: "image/gif",
        size: "200",
      });
      expect(
        answer.issues.some((issue) =>
          issue.diagnostics?.match(/allowed content types/i),
        ),
      ).toBe(true);

      question.setAnswer(0, {
        contentType: "image/png",
        size: "1024",
      });
      expect(
        answer.issues.some((issue) =>
          issue.diagnostics?.match(/exceed 512 bytes/i),
        ),
      ).toBe(true);

      question.setAnswer(0, {
        contentType: "image/jpeg",
        size: "256",
      });
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
      const question = expectQuestionNode(form.scope.lookupNode("passcode"));
      const passcodeAnswer = expectAnswerInstance(question);

      expect(form.validateAll()).toBe(true);
      expect(passcodeAnswer.issues).toHaveLength(0);
    });

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
      const question = expectQuestionNode(form.scope.lookupNode("amount"));
      const answer = expectAnswerInstance(question);

      question.setAnswer(0, 12.345);
      expect(answer.issues).toHaveLength(1);
      expect(answer.issues[0]?.diagnostics).toMatch(/decimal place/i);

      question.setAnswer(0, 12.34);
      expect(answer.issues).toHaveLength(0);
    });
  });

  describe("repeating group", () => {
    it("validates repeating group occurs limits", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "family-history",
            text: "Family history",
            type: "group",
            repeats: true,
            extension: [minOccurs(1), maxOccurs(2)],
            item: [
              {
                linkId: "condition",
                text: "Condition",
                type: "string",
                required: true,
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const group = form.scope.lookupNode("family-history");
      expect(group && isRepeatingGroupWrapper(group)).toBe(true);
      if (!group || !isRepeatingGroupWrapper(group)) return;

      // Submit with empty answers
      expect(form.validateAll()).toBe(false);
      expect(group.issues).toHaveLength(1);
      expect(group.issues[0]?.diagnostics).toMatch(/occurrence/i);

      const firstNode = group.nodes.at(0);
      expect(firstNode).toBeDefined();
      if (!firstNode) return;

      const question = firstNode.nodes.at(0);
      expect(question && isQuestionNode(question)).toBe(true);
      if (!question || !isQuestionNode(question)) return;

      question.setAnswer(0, "Diabetes");
      expect(group.issues).toHaveLength(0);
      expect(form.validateAll()).toBe(true);
    });
  });

  describe("non-repeating group", () => {
    it("validates group minOccurs when descendants empty", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "lifestyle",
            text: "Lifestyle",
            type: "group",
            extension: [minOccurs(1)],
            item: [
              {
                linkId: "exercise",
                text: "Exercise details",
                type: "string",
              },
            ],
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const group = form.scope.lookupNode("lifestyle");
      expect(group && isGroupNode(group)).toBe(true);
      if (!group || !isGroupNode(group)) return;

      expect(form.validateAll()).toBe(false);
      expect(group.issues.at(0)?.diagnostics).toMatch(/At least one answer/);

      const child = group.nodes.at(0);
      expect(child && isQuestionNode(child)).toBe(true);
      if (!child || !isQuestionNode(child)) return;
      child.setAnswer(0, "Runs daily");

      expect(form.validateAll()).toBe(true);
      expect(group.hasErrors).toBe(false);
    });
  });

  describe("form interactions", () => {
    it("clears submit state after successful validation", () => {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "email",
            text: "Email",
            type: "string",
            required: true,
          },
        ],
      };

      const form = new FormStore(questionnaire);
      const question = expectQuestionNode(form.scope.lookupNode("email"));

      expect(form.validateAll()).toBe(false);
      expect(form.isSubmitAttempted).toBe(true);

      question.setAnswer(0, "user@example.com");
      expect(form.validateAll()).toBe(true);
      expect(form.isSubmitAttempted).toBe(false);
      expect(question.hasErrors).toBe(false);
    });
  });
});
