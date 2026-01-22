import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { assertDefined } from "@formbox/renderer/utilities.ts";

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

describe("maxValue", () => {
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

    const earlyBirth = birth.answers[0];
    assertDefined(earlyBirth);
    earlyBirth.setValueByUser("1999-12-31");
    expect(form.validateAll()).toBe(false);
    expect(birthAnswer.issues.at(0)?.diagnostics).toMatch(/not be earlier/i);

    const lateBirth = birth.answers[0];
    assertDefined(lateBirth);
    lateBirth.setValueByUser("2021-01-01");
    expect(birthAnswer.issues.at(0)?.diagnostics).toMatch(/not be later/i);

    const okBirth = birth.answers[0];
    assertDefined(okBirth);
    okBirth.setValueByUser("2010-05-05");
    expect(birth.hasErrors).toBe(false);

    const earlyCheckIn = checkIn.answers[0];
    assertDefined(earlyCheckIn);
    earlyCheckIn.setValueByUser("2023-12-31T23:59:59Z");
    expect(checkInAnswer.issues.at(0)?.diagnostics).toMatch(/not be earlier/i);

    const lateCheckIn = checkIn.answers[0];
    assertDefined(lateCheckIn);
    lateCheckIn.setValueByUser("2025-01-01T00:00:00Z");
    expect(checkInAnswer.issues.at(0)?.diagnostics).toMatch(/not be later/i);

    const okCheckIn = checkIn.answers[0];
    assertDefined(okCheckIn);
    okCheckIn.setValueByUser("2024-06-01T12:00:00Z");
    expect(checkIn.hasErrors).toBe(false);
  });
});
