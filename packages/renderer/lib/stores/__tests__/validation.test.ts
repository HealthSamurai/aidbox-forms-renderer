import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form/form-store.ts";
import {
  assertGroupListStore,
  isGroupListStore,
} from "../nodes/groups/group-list-store.ts";
import { assertGroupNode, isGroupNode } from "../nodes/groups/group-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "../nodes/questions/question-store.ts";
import {
  makeCqfExpression,
  makeMaxOccursExpression,
  makeMinOccursExpression,
  makeVariable,
} from "./expression-fixtures.ts";
import { assertDefined } from "../../utils.ts";

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
      const question = form.scope.lookupNode("first-name");
      assertQuestionNode(question);

      expect(question.hasErrors).toBe(false);
      expect(question.issues).toHaveLength(0);

      expect(form.validateAll()).toBe(false);
      expect(question.hasErrors).toBe(true);
      expect(question.issues.at(0)?.diagnostics).toMatch(/required/i);

      const answer1 = question.answers[0];
      assertDefined(answer1);
      answer1.setValueByUser(null);
      expect(question.issues).toHaveLength(1);

      const answer2 = question.answers[0];
      assertDefined(answer2);
      answer2.setValueByUser("Alice");
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

      assertQuestionNode(gate);
      assertQuestionNode(target);

      expect(target.minOccurs).toBe(1);
      expect(target.canRemove).toBe(false);
      expect(target.answers).toHaveLength(1);

      const answer3 = gate.answers[0];
      assertDefined(answer3);
      answer3.setValueByUser(true);
      expect(target.minOccurs).toBe(2);
      expect(target.canRemove).toBe(false);
      expect(target.answers).toHaveLength(2);

      target.addAnswer("extra");
      expect(target.answers).toHaveLength(3);
      expect(target.canRemove).toBe(true);

      const answer4 = gate.answers[0];
      assertDefined(answer4);
      answer4.setValueByUser(false);
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

      assertQuestionNode(gate);
      assertQuestionNode(target);

      expect(target.expressionRegistry.maxOccurs).toBeDefined();
      expect(target.expressionRegistry.maxOccurs?.error).toBeUndefined();
      expect(target.maxOccurs).toBe(3);

      target.addAnswer("first");
      target.addAnswer("second");
      target.addAnswer("third");
      expect(target.answers).toHaveLength(3);
      expect(target.canAdd).toBe(false);

      const answer5 = gate.answers[0];
      assertDefined(answer5);
      answer5.setValueByUser(true);
      expect(target.maxOccurs).toBe(1);
      expect(target.canAdd).toBe(false);

      const before = target.answers.length;
      target.addAnswer("fourth");
      expect(target.answers.length).toBe(before);

      const thirdAnswer = target.answers[2];
      assertDefined(thirdAnswer);
      target.removeAnswer(thirdAnswer);

      const secondAnswer = target.answers[1];
      assertDefined(secondAnswer);
      target.removeAnswer(secondAnswer);
      expect(target.answers).toHaveLength(1);
      expect(target.canAdd).toBe(false);

      const answer6 = gate.answers[0];
      assertDefined(answer6);
      answer6.setValueByUser(false);
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
      const question = form.scope.lookupNode("symptom");
      assertQuestionNode(question);

      expect(form.validateAll()).toBe(false);
      expect(question.issues.at(0)?.diagnostics).toMatch(/least 2/);

      const answer7 = question.answers[0];
      assertDefined(answer7);
      answer7.setValueByUser("Cough");
      expect(question.issues.at(0)?.diagnostics).toMatch(/least 2/);

      question.answers[1]!.setValueByUser("Fever");
      expect(question.hasErrors).toBe(false);

      question.addAnswer();
      question.answers[2]!.setValueByUser("Fatigue");
      expect(question.canAdd).toBe(false);
      expect(question.hasErrors).toBe(false);

      question.answers[1]!.setValueByUser(null);
      question.answers[2]!.setValueByUser(null);
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
      const question = form.scope.lookupNode("readonly-question");
      assertQuestionNode(question);
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

      assertQuestionNode(gate);
      assertQuestionNode(detail);

      expect(form.validateAll()).toBe(true);
      expect(detail.required).toBe(false);

      const answer8 = gate.answers[0];
      assertDefined(answer8);
      answer8.setValueByUser(true);
      expect(detail.required).toBe(true);
      expect(form.validateAll()).toBe(false);

      expect(detail.issues.some((issue) => issue.code === "required")).toBe(
        true,
      );

      const answer9 = detail.answers[0];
      assertDefined(answer9);
      answer9.setValueByUser("value");
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
      const question = form.scope.lookupNode("notes");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);

      const tooLongAnswer = question.answers[0];
      assertDefined(tooLongAnswer);
      tooLongAnswer.setValueByUser("Too long");
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
      const question = form.scope.lookupNode("age");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);
      const ageAnswerMin = question.answers[0];
      assertDefined(ageAnswerMin);
      ageAnswerMin.setValueByUser(-1);
      const minIssues = answer.issues ?? [];
      expect(minIssues).toHaveLength(1);
      expect(minIssues[0]?.diagnostics).toMatch(/greater than or equal to/i);

      const ageAnswerMax = question.answers[0];
      assertDefined(ageAnswerMax);
      ageAnswerMax.setValueByUser(130);
      const maxIssues = answer.issues ?? [];
      expect(maxIssues).toHaveLength(1);
      expect(maxIssues[0]?.diagnostics).toMatch(/less than or equal to/i);

      const ageAnswerOk = question.answers[0];
      assertDefined(ageAnswerOk);
      ageAnswerOk.setValueByUser(35);
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
      const birth = form.scope.lookupNode("birth");
      assertQuestionNode(birth);
      const checkIn = form.scope.lookupNode("check-in");
      assertQuestionNode(checkIn);
      const birthAnswer = birth.answers[0];
      assertDefined(birthAnswer);
      const checkInAnswer = checkIn.answers[0];
      assertDefined(checkInAnswer);

      const birthAnswer0a = birth.answers[0];
      assertDefined(birthAnswer0a);
      birthAnswer0a.setValueByUser("1999-12-31");
      expect(birthAnswer.issues.at(0)?.diagnostics).toMatch(/not be earlier/i);

      const birthAnswer0b = birth.answers[0];
      assertDefined(birthAnswer0b);
      birthAnswer0b.setValueByUser("2021-01-01");
      expect(birthAnswer.issues.at(0)?.diagnostics).toMatch(/not be later/i);

      const birthAnswer0c = birth.answers[0];
      assertDefined(birthAnswer0c);
      birthAnswer0c.setValueByUser("2010-05-05");
      expect(birth.hasErrors).toBe(false);

      const checkInAnswer0a = checkIn.answers[0];
      assertDefined(checkInAnswer0a);
      checkInAnswer0a.setValueByUser("2023-12-31T23:59:59Z");
      expect(checkInAnswer.issues.at(0)?.diagnostics).toMatch(
        /not be earlier/i,
      );

      const checkInAnswer0b = checkIn.answers[0];
      assertDefined(checkInAnswer0b);
      checkInAnswer0b.setValueByUser("2025-01-01T00:00:00Z");
      expect(checkInAnswer.issues.at(0)?.diagnostics).toMatch(/not be later/i);

      const checkInAnswer0c = checkIn.answers[0];
      assertDefined(checkInAnswer0c);
      checkInAnswer0c.setValueByUser("2024-06-01T12:00:00Z");
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
      const question = form.scope.lookupNode("weight");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);

      const weightAnswer0 = question.answers[0];
      assertDefined(weightAnswer0);
      weightAnswer0.setValueByUser({ value: 5, unit: "kg" });
      expect(answer.issues.at(0)?.diagnostics).toMatch(
        /greater than or equal to/i,
      );

      const weightAnswer0b = question.answers[0];
      assertDefined(weightAnswer0b);
      weightAnswer0b.setValueByUser({ value: 250, unit: "kg" });
      expect(answer.issues.at(0)?.diagnostics).toMatch(
        /less than or equal to/i,
      );

      const weightAnswer0c = question.answers[0];
      assertDefined(weightAnswer0c);
      weightAnswer0c.setValueByUser({ value: 75, unit: "kg" });
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
      const question = form.scope.lookupNode("nickname");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);

      const answer10 = question.answers[0];
      assertDefined(answer10);
      answer10.setValueByUser("Jo");
      expect(answer.issues).toHaveLength(1);
      expect(answer.issues[0]?.diagnostics).toMatch(/at least 3/i);

      const answer11 = question.answers[0];
      assertDefined(answer11);
      answer11.setValueByUser("Joan");
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

      const answer12 = question.answers[0];
      assertDefined(answer12);
      answer12.setValueByUser(12.345);
      expect(answer.issues).toHaveLength(1);
      expect(answer.issues[0]?.diagnostics).toMatch(/decimal place/i);

      const answer13 = question.answers[0];
      assertDefined(answer13);
      answer13.setValueByUser(12.34);
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
      const question = form.scope.lookupNode("priority");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);

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
      const question = form.scope.lookupNode("dose");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);

      const mgQuantity = (value: number) => ({
        value,
        unit: "mg",
        system: "http://unitsofmeasure.org",
        code: "mg",
      });

      {
        const answer = question.answers[0];
        assertDefined(answer);
        answer.setValueByUser(mgQuantity(5));
      }
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

      const answer14 = question.answers[0];
      assertDefined(answer14);
      answer14.setValueByUser({
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

      const answer15 = question.answers[0];
      assertDefined(answer15);
      answer15.setValueByUser({
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

      const mgQuantity = (value: number) => ({
        value,
        unit: "mg",
        system: "http://unitsofmeasure.org",
        code: "mg",
      });

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
      const question = form.scope.lookupNode("fluid");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);

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

      {
        const answer = question.answers[0];
        assertDefined(answer);
        answer.setValueByUser(mlQuantity(15));
      }
      expect(
        answer.issues.some((issue) =>
          issue.diagnostics?.match(/greater than or equal to 20/),
        ),
      ).toBe(true);

      {
        const answer = question.answers[0];
        assertDefined(answer);
        answer.setValueByUser(mlQuantity(22));
      }
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
      const question = form.scope.lookupNode("score");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);

      const registry = question.expressionRegistry;
      Object.defineProperty(registry, "minValue", {
        configurable: true,
        value: {
          value: [true],
        },
      });

      const answer16 = question.answers[0];
      assertDefined(answer16);
      answer16.setValueByUser(3);
      expect(answer.issues).toHaveLength(0);

      const answer17 = question.answers[0];
      assertDefined(answer17);
      answer17.setValueByUser(12);
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
      const question = form.scope.lookupNode("score");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);

      const registry = question.expressionRegistry;
      Object.defineProperty(registry, "minValue", {
        configurable: true,
        value: {
          value: [25],
        },
      });

      const answer18 = question.answers[0];
      assertDefined(answer18);
      answer18.setValueByUser(20);
      expect(
        answer.issues.some((issue) =>
          issue.diagnostics?.match(/greater than or equal to 25/),
        ),
      ).toBe(true);

      const answer19 = question.answers[0];
      assertDefined(answer19);
      answer19.setValueByUser(30);
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
      const question = form.scope.lookupNode("score");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);

      const registry = question.expressionRegistry;
      Object.defineProperty(registry, "minValue", {
        configurable: true,
        value: {
          value: [true, 40],
        },
      });

      const answer20 = question.answers[0];
      assertDefined(answer20);
      answer20.setValueByUser(5);
      expect(answer.issues).toHaveLength(0);

      const answer21 = question.answers[0];
      assertDefined(answer21);
      answer21.setValueByUser(45);
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
      const question = form.scope.lookupNode("photo");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);

      const answer22 = question.answers[0];
      assertDefined(answer22);
      answer22.setValueByUser({
        contentType: "image/gif",
        size: "200",
      });
      expect(
        answer.issues.some((issue) =>
          issue.diagnostics?.match(/allowed content types/i),
        ),
      ).toBe(true);

      const answer23 = question.answers[0];
      assertDefined(answer23);
      answer23.setValueByUser({
        contentType: "image/png",
        size: "1024",
      });
      expect(
        answer.issues.some((issue) =>
          issue.diagnostics?.match(/exceed 512 bytes/i),
        ),
      ).toBe(true);

      const answer24 = question.answers[0];
      assertDefined(answer24);
      answer24.setValueByUser({
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
      const question = form.scope.lookupNode("passcode");
      assertQuestionNode(question);
      const passcodeAnswer = question.answers[0];
      assertDefined(passcodeAnswer);

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
      const question = form.scope.lookupNode("amount");
      assertQuestionNode(question);
      const answer = question.answers[0];
      assertDefined(answer);

      const answer25 = question.answers[0];
      assertDefined(answer25);
      answer25.setValueByUser(12.345);
      expect(answer.issues).toHaveLength(1);
      expect(answer.issues[0]?.diagnostics).toMatch(/decimal place/i);

      const answer26 = question.answers[0];
      assertDefined(answer26);
      answer26.setValueByUser(12.34);
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
      expect(group && isGroupListStore(group)).toBe(true);
      assertGroupListStore(group);

      // Submit with empty answers
      expect(form.validateAll()).toBe(false);
      expect(group.issues).toHaveLength(1);
      expect(group.issues[0]?.diagnostics).toMatch(/occurrence/i);

      const firstNode = group.nodes.at(0);
      expect(firstNode).toBeDefined();
      assertDefined(firstNode);

      const question = firstNode.nodes.at(0);
      expect(question && isQuestionNode(question)).toBe(true);
      assertQuestionNode(question);

      const answer27 = question.answers[0];
      assertDefined(answer27);
      answer27.setValueByUser("Diabetes");
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
      assertGroupNode(group);

      expect(form.validateAll()).toBe(false);
      expect(group.issues.at(0)?.diagnostics).toMatch(/At least one answer/);

      const child = group.nodes.at(0);
      expect(child && isQuestionNode(child)).toBe(true);
      assertQuestionNode(child);
      const answer28 = child.answers[0];
      assertDefined(answer28);
      answer28.setValueByUser("Runs daily");

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
      const question = form.scope.lookupNode("email");
      assertQuestionNode(question);

      expect(form.validateAll()).toBe(false);
      expect(form.isSubmitAttempted).toBe(true);

      const answer29 = question.answers[0];
      assertDefined(answer29);
      answer29.setValueByUser("user@example.com");
      expect(form.validateAll()).toBe(true);
      expect(form.isSubmitAttempted).toBe(false);
      expect(question.hasErrors).toBe(false);
    });
  });
});
