import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../form-store.ts";
import { isRepeatingGroupWrapper } from "../repeating-group-wrapper.ts";
import { isNonRepeatingGroupNode } from "../non-repeating-group-store.ts";
import { isQuestionNode } from "../question-store.ts";

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

const maxSize = (value: number) => ({
  url: "http://hl7.org/fhir/StructureDefinition/maxSize",
  valueDecimal: value,
});

const mimeType = (value: string) => ({
  url: "http://hl7.org/fhir/StructureDefinition/mimeType",
  valueCode: value,
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

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("first-name");
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

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
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

    question.setAnswer(0, "Too long");
    const longIssues = question.answerIssues.at(0) ?? [];
    expect(longIssues).toHaveLength(1);
    expect(longIssues[0]?.diagnostics).toMatch(/maximum length/i);

    question.setAnswer(0, "   ");
    const blankIssues = question.answerIssues.at(0) ?? [];
    expect(blankIssues).toHaveLength(1);
    expect(blankIssues[0]?.diagnostics).toMatch(/may not be blank/i);
    expect(question.hasErrors).toBe(true);
    

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
    const question = form.scope.lookupNode("age");
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

    question.setAnswer(0, -1);
    const minIssues = question.answerIssues.at(0) ?? [];
    expect(minIssues).toHaveLength(1);
    expect(minIssues[0]?.diagnostics).toMatch(/greater than or equal to/i);

    question.setAnswer(0, 130);
    const maxIssues = question.answerIssues.at(0) ?? [];
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
    const birth = form.scope.lookupNode("birth");
    const checkIn = form.scope.lookupNode("check-in");
    expect(
      birth && checkIn && isQuestionNode(birth) && isQuestionNode(checkIn),
    ).toBe(true);
    if (
      !birth ||
      !checkIn ||
      !isQuestionNode(birth) ||
      !isQuestionNode(checkIn)
    )
      return;

    birth.setAnswer(0, "1999-12-31");
    expect(birth.answerIssues.at(0)?.at(0)?.diagnostics).toMatch(/not be earlier/i);

    birth.setAnswer(0, "2021-01-01");
    expect(birth.answerIssues.at(0)?.at(0)?.diagnostics).toMatch(/not be later/i);

    birth.setAnswer(0, "2010-05-05");
    expect(birth.hasErrors).toBe(false);

    checkIn.setAnswer(0, "2023-12-31T23:59:59Z");
    expect(checkIn.answerIssues.at(0)?.at(0)?.diagnostics).toMatch(/not be earlier/i);

    checkIn.setAnswer(0, "2025-01-01T00:00:00Z");
    expect(checkIn.answerIssues.at(0)?.at(0)?.diagnostics).toMatch(/not be later/i);

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
    const question = form.scope.lookupNode("weight");
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

    question.setAnswer(0, { value: 5, unit: "kg" });
    expect(question.answerIssues.at(0)?.at(0)?.diagnostics).toMatch(
      /greater than or equal to/i,
    );
    
    question.setAnswer(0, { value: 250, unit: "kg" });
    expect(question.answerIssues.at(0)?.at(0)?.diagnostics).toMatch(
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

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("family-history");
    expect(group && isRepeatingGroupWrapper(group)).toBe(true);
    if (!group || !isRepeatingGroupWrapper(group)) return;

    // Submit with empty answers
    expect(form.validateAll()).toBe(false);
    expect(group.issues).toHaveLength(1);
    expect(group.issues[0]?.diagnostics).toMatch(/occurrence/i);

    const firstInstance = group.nodes.at(0);
    expect(firstInstance).toBeDefined();
    if (!firstInstance) return;

    const question = firstInstance.nodes.at(0);
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

    question.setAnswer(0, "Diabetes");
    expect(group.issues).toHaveLength(0);
    expect(form.validateAll()).toBe(true);
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
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

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
    const question = form.scope.lookupNode("readonly-question");
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;
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

    const form = new FormStore(questionnaire);
    const group = form.scope.lookupNode("lifestyle");
    expect(group && isNonRepeatingGroupNode(group)).toBe(true);
    if (!group || !isNonRepeatingGroupNode(group)) return;

    expect(form.validateAll()).toBe(false);
    expect(group.issues.at(0)?.diagnostics).toMatch(/At least one answer/);

    const child = group.nodes.at(0);
    expect(child && isQuestionNode(child)).toBe(true);
    if (!child || !isQuestionNode(child)) return;
    child.setAnswer(0, "Runs daily");

    expect(form.validateAll()).toBe(true);
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

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("email");
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

    expect(form.validateAll()).toBe(false);
    expect(form.isSubmitAttempted).toBe(true);

    question.setAnswer(0, "user@example.com");
    expect(form.validateAll()).toBe(true);
    expect(form.isSubmitAttempted).toBe(false);
    expect(question.hasErrors).toBe(false);
  });

  it("validates attachment max size", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "document",
          text: "Document",
          type: "attachment",
          extension: [maxSize(2097152)], // 2 MB in bytes
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("document");
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

    // File larger than 2 MB (3 MB = 3 * 1024 * 1024 bytes)
    question.setAnswer(0, {
      contentType: "application/pdf",
      size: "3145728", // 3 MB in bytes
      title: "large-file.pdf",
    });
    const largeIssues = question.answerIssues.at(0) ?? [];
    expect(largeIssues).toHaveLength(1);
    expect(largeIssues[0]?.diagnostics).toMatch(/exceeds the maximum allowed size/i);
    expect(largeIssues[0]?.diagnostics).toMatch(/2097152 bytes/);

    // File within limit (1 MB)
    question.setAnswer(0, {
      contentType: "application/pdf",
      size: "1048576", // 1 MB in bytes
      title: "small-file.pdf",
    });
    expect(question.hasErrors).toBe(false);
  });

  it("validates attachment MIME type", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "image",
          text: "Image",
          type: "attachment",
          extension: [
            mimeType("image/png"),
            mimeType("image/jpeg"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("image");
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

    // Invalid MIME type
    question.setAnswer(0, {
      contentType: "application/pdf",
      size: "1024",
      title: "document.pdf",
    });
    const invalidIssues = question.answerIssues.at(0) ?? [];
    expect(invalidIssues).toHaveLength(1);
    expect(invalidIssues[0]?.diagnostics).toMatch(/not allowed/i);
    expect(invalidIssues[0]?.diagnostics).toMatch(/image\/png, image\/jpeg/);

    // Valid MIME type (PNG)
    question.setAnswer(0, {
      contentType: "image/png",
      size: "1024",
      title: "photo.png",
    });
    expect(question.hasErrors).toBe(false);

    // Valid MIME type (JPEG)
    question.setAnswer(0, {
      contentType: "image/jpeg",
      size: "1024",
      title: "photo.jpg",
    });
    expect(question.hasErrors).toBe(false);
  });

  it("validates attachment with wildcard MIME type", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "media",
          text: "Media",
          type: "attachment",
          extension: [
            mimeType("image/*"),
            mimeType("video/*"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("media");
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

    // Invalid MIME type (not image or video)
    question.setAnswer(0, {
      contentType: "application/pdf",
      size: "1024",
      title: "document.pdf",
    });
    const invalidIssues = question.answerIssues.at(0) ?? [];
    expect(invalidIssues).toHaveLength(1);
    expect(invalidIssues[0]?.diagnostics).toMatch(/not allowed/i);

    // Valid image types
    question.setAnswer(0, {
      contentType: "image/png",
      size: "1024",
      title: "photo.png",
    });
    expect(question.hasErrors).toBe(false);

    question.setAnswer(0, {
      contentType: "image/gif",
      size: "1024",
      title: "animation.gif",
    });
    expect(question.hasErrors).toBe(false);

    // Valid video types
    question.setAnswer(0, {
      contentType: "video/mp4",
      size: "1024",
      title: "clip.mp4",
    });
    expect(question.hasErrors).toBe(false);

    question.setAnswer(0, {
      contentType: "video/webm",
      size: "1024",
      title: "clip.webm",
    });
    expect(question.hasErrors).toBe(false);
  });

  it("validates attachment with both size and MIME type constraints", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "profile-photo",
          text: "Profile Photo",
          type: "attachment",
          extension: [
            maxSize(5242880), // 5 MB in bytes
            mimeType("image/png"),
            mimeType("image/jpeg"),
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("profile-photo");
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

    // Valid size, invalid MIME type
    question.setAnswer(0, {
      contentType: "image/gif",
      size: "1048576", // 1 MB
      title: "avatar.gif",
    });
    let issues = question.answerIssues.at(0) ?? [];
    expect(issues).toHaveLength(1);
    expect(issues[0]?.diagnostics).toMatch(/not allowed/i);

    // Invalid size, valid MIME type
    question.setAnswer(0, {
      contentType: "image/png",
      size: "6291456", // 6 MB
      title: "large-photo.png",
    });
    issues = question.answerIssues.at(0) ?? [];
    expect(issues).toHaveLength(1);
    expect(issues[0]?.diagnostics).toMatch(/exceeds the maximum allowed size/i);

    // Both invalid
    question.setAnswer(0, {
      contentType: "application/pdf",
      size: "10485760", // 10 MB
      title: "huge-document.pdf",
    });
    issues = question.answerIssues.at(0) ?? [];
    expect(issues).toHaveLength(2);
    expect(issues.some((i) => i.diagnostics?.match(/exceeds the maximum allowed size/i))).toBe(true);
    expect(issues.some((i) => i.diagnostics?.match(/not allowed/i))).toBe(true);

    // Both valid
    question.setAnswer(0, {
      contentType: "image/jpeg",
      size: "2097152", // 2 MB
      title: "photo.jpg",
    });
    expect(question.hasErrors).toBe(false);
  });

  it("allows attachments without size or contentType when no constraints", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "any-file",
          text: "Any File",
          type: "attachment",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const question = form.scope.lookupNode("any-file");
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) return;

    // Attachment with no size or contentType
    question.setAnswer(0, {
      url: "https://example.com/file.pdf",
      title: "External File",
    });
    expect(question.hasErrors).toBe(false);

    // Attachment with size but no contentType
    question.setAnswer(0, {
      size: "1024",
      title: "file.dat",
    });
    expect(question.hasErrors).toBe(false);
  });
});
