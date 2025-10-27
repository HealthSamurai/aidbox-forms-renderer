import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form-store.ts";
import { isQuestion, isRepeatingGroup } from "../../utils.ts";

const minOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs",
  valueInteger: value,
});

const maxOccurs = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
  valueInteger: value,
});

describe("validation", () => {
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

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("first-name");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    expect(question.hasErrors).toBe(false);
    expect(question.issues).toHaveLength(0);

    expect(store.validateAll()).toBe(false);
    expect(question.hasErrors).toBe(true);
    expect(question.issues.at(0)?.diagnostics).toMatch(/required/i);

    question.setAnswer(0, null);
    expect(question.issues).toHaveLength(1);

    question.setAnswer(0, "Alice");
    expect(store.validateAll()).toBe(true);
    expect(question.hasErrors).toBe(false);
  });

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

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("notes");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    question.setAnswer(0, "Too long");
    const longIssues = question.issues ?? [];
    expect(longIssues).toHaveLength(1);
    expect(longIssues[0]?.diagnostics).toMatch(/maximum length/i);

    question.setAnswer(0, "   ");
    expect(question.hasErrors).toBe(false);
    expect(question.issues).toHaveLength(0);

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
          minValueInteger: 0,
          maxValueInteger: 120,
        },
      ],
    };

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("age");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    question.setAnswer(0, -1);
    const minIssues = question.issues ?? [];
    expect(minIssues).toHaveLength(1);
    expect(minIssues[0]?.diagnostics).toMatch(/greater than or equal to/i);

    question.setAnswer(0, 130);
    const maxIssues = question.issues ?? [];
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
          minValueDate: "2000-01-01",
          maxValueDate: "2020-12-31",
        },
        {
          linkId: "check-in",
          text: "Check-in",
          type: "dateTime",
          minValueDateTime: "2024-01-01T00:00:00Z",
          maxValueDateTime: "2024-12-31T23:59:59Z",
        },
      ],
    };

    const store = new FormStore(questionnaire);
    const birth = store.lookupStore("birth");
    const checkIn = store.lookupStore("check-in");
    expect(birth && checkIn && isQuestion(birth) && isQuestion(checkIn)).toBe(
      true,
    );
    if (!birth || !checkIn || !isQuestion(birth) || !isQuestion(checkIn))
      return;

    birth.setAnswer(0, "1999-12-31");
    expect(birth.issues.at(0)?.diagnostics).toMatch(/not be earlier/i);

    birth.setAnswer(0, "2021-01-01");
    expect(birth.issues.at(0)?.diagnostics).toMatch(/not be later/i);

    birth.setAnswer(0, "2010-05-05");
    expect(birth.hasErrors).toBe(false);

    checkIn.setAnswer(0, "2023-12-31T23:59:59Z");
    expect(checkIn.issues.at(0)?.diagnostics).toMatch(/not be earlier/i);

    checkIn.setAnswer(0, "2025-01-01T00:00:00Z");
    expect(checkIn.issues.at(0)?.diagnostics).toMatch(/not be later/i);

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
          minValueQuantity: { value: 10, unit: "kg" },
          maxValueQuantity: { value: 200, unit: "kg" },
        },
      ],
    };

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("weight");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    question.setAnswer(0, { value: 5, unit: "kg" });
    expect(question.issues.at(0)?.diagnostics).toMatch(
      /greater than or equal to/i,
    );

    question.setAnswer(0, { value: 250, unit: "kg" });
    expect(question.issues.at(0)?.diagnostics).toMatch(
      /less than or equal to/i,
    );

    question.setAnswer(0, { value: 75, unit: "kg" });
    expect(question.hasErrors).toBe(false);
  });

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

    const store = new FormStore(questionnaire);
    const group = store.lookupStore("family-history");
    expect(group && isRepeatingGroup(group)).toBe(true);
    if (!group || !isRepeatingGroup(group)) return;

    // Submit with empty answers
    expect(store.validateAll()).toBe(false);
    expect(group.issues).toHaveLength(1);
    expect(group.issues[0]?.diagnostics).toMatch(/occurrence/i);

    const firstInstance = group.instances.at(0);
    expect(firstInstance).toBeDefined();
    if (!firstInstance) return;

    const question = firstInstance.children.at(0);
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    question.setAnswer(0, "Diabetes");
    expect(group.issues).toHaveLength(0);
    expect(store.validateAll()).toBe(true);
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

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("symptom");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    expect(store.validateAll()).toBe(false);
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

    const store = new FormStore(questionnaire);
    expect(store.validateAll()).toBe(true);
    const question = store.lookupStore("readonly-question");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;
    expect(question.hasErrors).toBe(false);
  });

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

    const store = new FormStore(questionnaire);
    const group = store.lookupStore("lifestyle");
    expect(group && isRepeatingGroup(group)).toBe(false);
    if (!group || isRepeatingGroup(group)) return;

    expect(store.validateAll()).toBe(false);
    expect(group.issues.at(0)?.diagnostics).toMatch(/At least one answer/);

    const child = group.children.at(0);
    expect(child && isQuestion(child)).toBe(true);
    if (!child || !isQuestion(child)) return;
    child.setAnswer(0, "Runs daily");

    expect(store.validateAll()).toBe(true);
    expect(group.hasErrors).toBe(false);
  });

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

    const store = new FormStore(questionnaire);
    const question = store.lookupStore("email");
    expect(question && isQuestion(question)).toBe(true);
    if (!question || !isQuestion(question)) return;

    expect(store.validateAll()).toBe(false);
    expect(store.isSubmitAttempted).toBe(true);

    question.setAnswer(0, "user@example.com");
    expect(store.validateAll()).toBe(true);
    expect(store.isSubmitAttempted).toBe(false);
    expect(question.hasErrors).toBe(false);
  });
});
