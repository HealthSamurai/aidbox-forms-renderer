import { describe, expect, it } from "vitest";
import type {
  Attachment,
  Coding,
  Element,
  Quantity,
  QuestionnaireItemAnswerOption,
  Reference,
} from "fhir/r5";

import {
  answerify,
  areValuesEqual,
  cloneValue,
  compareQuantities,
  countDecimalPlaces,
  estimateAttachmentSize,
  extractExtensionValue,
  getValue,
  normalizeExpressionValues,
  stringifyValue,
  tokenify,
} from "../utils.ts";

describe("getValue", () => {
  it("returns boolean", () => {
    expect(getValue({ valueBoolean: true }, "boolean")).toBe(true);
  });

  it("returns decimal", () => {
    expect(getValue({ valueDecimal: 3.14 }, "decimal")).toBe(3.14);
  });

  it("returns integer", () => {
    expect(getValue({ valueInteger: 5 }, "integer")).toBe(5);
  });

  it("returns date", () => {
    expect(getValue({ valueDate: "2024-01-01" }, "date")).toBe("2024-01-01");
  });

  it("returns dateTime", () => {
    expect(
      getValue({ valueDateTime: "2024-01-01T10:00:00Z" }, "dateTime"),
    ).toBe("2024-01-01T10:00:00Z");
  });

  it("returns time", () => {
    expect(getValue({ valueTime: "08:30:00" }, "time")).toBe("08:30:00");
  });

  it("returns string", () => {
    expect(getValue({ valueString: "alpha" }, "string")).toBe("alpha");
  });

  it("returns url", () => {
    expect(getValue({ valueUri: "https://example.org" }, "uri")).toBe(
      "https://example.org",
    );
  });

  it("returns coding", () => {
    const coding: Coding = { system: "http://loinc.org", code: "1234-5" };
    expect(getValue({ valueCoding: coding }, "Coding")).toEqual(coding);
  });

  it("returns attachment", () => {
    const attachment: Attachment = { url: "https://example.org" };
    expect(getValue({ valueAttachment: attachment }, "Attachment")).toEqual(
      attachment,
    );
  });

  it("returns reference", () => {
    const reference: Reference = { reference: "Patient/1" };
    expect(getValue({ valueReference: reference }, "Reference")).toEqual(
      reference,
    );
  });

  it("returns quantity", () => {
    const quantity: Quantity = { value: 120, unit: "mmHg" };
    expect(getValue({ valueQuantity: quantity }, "Quantity")).toEqual(quantity);
  });

  it("returns undefined when the value is absent", () => {
    expect(getValue({}, "string")).toBeUndefined();
  });
});

describe("countDecimalPlaces", () => {
  it("counts decimals for standard numbers", () => {
    expect(countDecimalPlaces(12.345)).toBe(3);
  });

  it("counts decimals for exponent notation", () => {
    expect(countDecimalPlaces(1.23e-4)).toBe(6);
  });

  it("returns zero for non-finite numbers", () => {
    expect(countDecimalPlaces(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("estimateAttachmentSize", () => {
  it("returns provided numeric size", () => {
    const attachment = { size: 512 } as unknown as Attachment;
    expect(estimateAttachmentSize(attachment)).toBe(512);
  });

  it("parses string size", () => {
    const attachment: Attachment = { size: "1024" };
    expect(estimateAttachmentSize(attachment)).toBe(1024);
  });

  it("estimates base64 payload size", () => {
    const attachment: Attachment = { data: "TQ==" };
    expect(estimateAttachmentSize(attachment)).toBe(1);
  });

  it("returns undefined when metadata is missing", () => {
    const attachment: Attachment = {};
    expect(estimateAttachmentSize(attachment)).toBeUndefined();
  });
});

describe("extractExtension", () => {
  it("returns the typed extension value when present", () => {
    const element = {
      extension: [{ url: "test", valueInteger: 7 }],
    } as Element;
    expect(extractExtensionValue(element, "test", "integer")).toBe(7);
  });

  it("returns undefined when extension is absent", () => {
    const element = {
      extension: [],
    } as Element;
    expect(extractExtensionValue(element, "missing", "string")).toBeUndefined();
  });
});

describe("stringifyValue", () => {
  describe("coding", () => {
    it("prefers the coding display when present", () => {
      expect(stringifyValue("Coding", { code: "m", display: "Moderate" })).toBe(
        "Moderate",
      );
    });

    it("uses the coding display when only display is present", () => {
      expect(stringifyValue("Coding", { display: "Moderate" })).toBe(
        "Moderate",
      );
    });

    it("falls back to the coding code when display is missing", () => {
      expect(stringifyValue("Coding", { code: "m" })).toBe("m");
    });

    it("returns fallback when coding has no labels", () => {
      expect(
        stringifyValue("Coding", { system: "sys" } as Coding, "fallback"),
      ).toBe("fallback");
    });
  });

  describe("string", () => {
    it("returns the string value", () => {
      expect(stringifyValue("string", "hello")).toBe("hello");
    });
  });

  describe("text", () => {
    it("returns the text value", () => {
      expect(stringifyValue("string", "note")).toBe("note");
    });
  });

  describe("url", () => {
    it("returns the url value", () => {
      expect(stringifyValue("url", "https://example.org")).toBe(
        "https://example.org",
      );
    });
  });

  describe("integer", () => {
    it("stringifies the integer value", () => {
      expect(stringifyValue("integer", 42)).toBe("42");
    });
  });

  describe("decimal", () => {
    it("stringifies the decimal value", () => {
      expect(stringifyValue("decimal", 3.5)).toBe("3.5");
    });
  });

  describe("boolean", () => {
    it("returns Yes for true", () => {
      expect(stringifyValue("boolean", true)).toBe("Yes");
    });

    it("returns No for false", () => {
      expect(stringifyValue("boolean", false)).toBe("No");
    });
  });

  describe("quantity", () => {
    it("formats the quantity value", () => {
      expect(stringifyValue("Quantity", { value: 55, unit: "kg" })).toBe(
        "55 kg",
      );
    });

    it("uses fallback when value is missing", () => {
      expect(stringifyValue("Quantity", {}, "fallback")).toBe("fallback");
    });

    it("returns unit when only unit is provided", () => {
      expect(stringifyValue("Quantity", { unit: "kg" })).toBe("kg");
    });

    it("returns value when only value is provided", () => {
      expect(stringifyValue("Quantity", { value: 12 })).toBe("12");
    });
  });

  describe("reference", () => {
    it("prefers the display value", () => {
      expect(
        stringifyValue("Reference", {
          reference: "Patient/1",
          display: "Alice",
        }),
      ).toBe("Alice");
    });

    it("returns the reference when display is absent", () => {
      expect(stringifyValue("Reference", { reference: "Patient/2" })).toBe(
        "Patient/2",
      );
    });
  });

  describe("attachment", () => {
    it("prefers the title", () => {
      expect(stringifyValue("Attachment", { title: "MRI" })).toBe("MRI");
    });

    it("falls back to content type", () => {
      expect(stringifyValue("Attachment", { contentType: "image/png" })).toBe(
        "image/png attachment",
      );
    });

    it("falls back to url when title and content type are absent", () => {
      expect(stringifyValue("Attachment", { url: "https://file" })).toBe(
        "https://file",
      );
    });
  });
});

describe("tokenify", () => {
  it("ignores coding display when code is present", () => {
    const first = tokenify("Coding", {
      system: "urn:test",
      code: "A",
      display: "Alpha",
    });
    const second = tokenify("Coding", {
      system: "urn:test",
      code: "A",
      display: "Beta",
    });

    expect(first).toBe(second);
  });

  it("uses coding display when code is missing", () => {
    const first = tokenify("Coding", {
      system: "urn:test",
      display: "Gamma",
    });
    const second = tokenify("Coding", {
      system: "urn:test",
      display: "Delta",
    });

    expect(first).not.toBe(second);
  });

  it("drops reference display but keeps identifier", () => {
    const first = tokenify("Reference", {
      reference: "Patient/1",
      display: "Alice",
      identifier: { system: "sys", value: "1" },
    });
    const second = tokenify("Reference", {
      reference: "Patient/1",
      display: "Bob",
      identifier: { system: "sys", value: "1" },
    });

    expect(first).toBe(second);
  });

  it("prefers quantity code over unit display", () => {
    const withUnit = tokenify("Quantity", {
      value: 1,
      unit: "kg",
      code: "kg",
      system: "http://unitsofmeasure.org",
    });
    const withoutUnit = tokenify("Quantity", {
      value: 1,
      code: "kg",
      system: "http://unitsofmeasure.org",
    });

    expect(withUnit).toBe(withoutUnit);
  });

  it("normalizes dateTime by epoch when timezone is present", () => {
    const utc = tokenify("dateTime", "2024-01-01T00:00:00Z");
    const offset = tokenify("dateTime", "2023-12-31T19:00:00-05:00");

    expect(utc).toBe(offset);
  });

  it("keeps time precision differences", () => {
    expect(tokenify("time", "13:30")).not.toBe(tokenify("time", "13:30:00"));
  });
});

describe("answerify", () => {
  it("flattens nested collections", () => {
    const result = answerify("string", ["Alpha", ["Beta", ["Gamma"]]]);
    expect(result).toEqual([
      { valueString: "Alpha" },
      { valueString: "Beta" },
      { valueString: "Gamma" },
    ]);
  });

  it("coerces boolean strings", () => {
    const result = answerify("boolean", ["true", "FALSE", "maybe"]);
    expect(result).toEqual([{ valueBoolean: true }, { valueBoolean: false }]);
  });

  it("parses numerics for integer questions", () => {
    const result = answerify("integer", ["5", 7, "oops"]);
    expect(result).toEqual([{ valueInteger: 5 }, { valueInteger: 7 }]);
  });

  it("parses numerics for decimal questions", () => {
    const result = answerify("decimal", ["1.5", 2, "oops"]);
    expect(result).toEqual([{ valueDecimal: 1.5 }, { valueDecimal: 2 }]);
  });

  it("wraps bare coding objects", () => {
    const coding: Coding = { system: "http://loinc.org", code: "718-7" };
    const [option] = answerify("coding", coding);
    expect(option).toEqual({ valueCoding: coding });
    expect(option.valueCoding).toBe(coding);
  });

  it("returns structured codings unchanged when provided as answerOption", () => {
    const option: QuestionnaireItemAnswerOption = {
      valueCoding: { system: "http://loinc.org", code: "890-5" },
      extension: [{ url: "test", valueString: "meta" }],
    };
    const [result] = answerify("coding", [option]);
    expect(result).not.toBe(option);
    expect(result.valueCoding).toEqual(option.valueCoding);
    expect(result.extension).toBe(option.extension);
  });

  it("clones provided answerOption wrappers", () => {
    const original = {
      valueCoding: { code: "opt", display: "Option" },
      extension: [{ url: "x", valueString: "meta" }],
    } satisfies QuestionnaireItemAnswerOption;

    const [option] = answerify("coding", [original]);

    expect(option.valueCoding).toEqual(original.valueCoding);
    expect(option.valueCoding).toBe(original.valueCoding);
    expect(option.extension).toEqual(original.extension);
    expect(option.extension).toBe(original.extension);
  });

  it("filters unsupported values", () => {
    const result = answerify("boolean", [null, undefined, 1, "maybe"]);
    expect(result).toEqual([]);
  });

  it("clones structured quantity answers", () => {
    const quantity = { value: 42, unit: "kg" } satisfies Quantity;
    const result = answerify("quantity", quantity);
    expect(result).toHaveLength(1);
    expect((result[0] as { valueQuantity?: Quantity }).valueQuantity).toBe(
      quantity,
    );
  });

  it("passes through references", () => {
    const reference = {
      reference: "Patient/1",
      display: "Alice",
    } satisfies Reference;
    const result = answerify("reference", reference);
    expect(result).toHaveLength(1);
    expect((result[0] as { valueReference?: Reference }).valueReference).toBe(
      reference,
    );
  });

  it("passes through attachments", () => {
    const attachment = {
      url: "https://example.org",
      title: "Scan",
    } satisfies Attachment;
    const result = answerify("attachment", attachment);
    expect(result).toHaveLength(1);
    expect(
      (result[0] as { valueAttachment?: Attachment }).valueAttachment,
    ).toBe(attachment);
  });

  it("accepts string-like types", () => {
    const result = answerify("string", "alpha");
    expect(result).toEqual([{ valueString: "alpha" }]);
  });

  it("accepts text type", () => {
    const result = answerify("text", "long form");
    expect(result).toEqual([{ valueString: "long form" }]);
  });

  it("accepts date values", () => {
    const result = answerify("date", ["2025-01-01", "invalid"]);
    expect(result.map((option) => getValue(option, "date"))).toEqual([
      "2025-01-01",
      "invalid",
    ]);
  });

  it("accepts dateTime values", () => {
    const result = answerify("dateTime", ["2025-01-01T09:30:00Z", 42]);
    expect(result).toEqual([{ valueDateTime: "2025-01-01T09:30:00Z" }]);
  });

  it("accepts time values", () => {
    const result = answerify("time", ["08:15:00", null]);
    expect(result).toEqual([{ valueTime: "08:15:00" }]);
  });

  it("rejects unsupported types", () => {
    const result = answerify("reference", ["string", 42, null]);
    expect(result).toEqual([]);
  });

  it("handles empty source arrays", () => {
    expect(answerify("string", [])).toEqual([]);
  });

  it("ignores undefined root value", () => {
    expect(answerify("string", undefined)).toEqual([]);
  });
});

describe("areValuesEqual", () => {
  describe("string", () => {
    it("returns true for equal strings", () => {
      expect(areValuesEqual("string", "a", "a")).toBe(true);
    });

    it("returns false for different strings", () => {
      expect(areValuesEqual("string", "a", "b")).toBe(false);
    });
  });

  describe("boolean", () => {
    it("returns true for equal booleans", () => {
      expect(areValuesEqual("boolean", true, true)).toBe(true);
    });

    it("returns false for different booleans", () => {
      expect(areValuesEqual("boolean", true, false)).toBe(false);
    });
  });

  describe("decimal", () => {
    it("returns true for equal decimals", () => {
      expect(areValuesEqual("decimal", 1.5, 1.5)).toBe(true);
    });

    it("returns false for different decimals", () => {
      expect(areValuesEqual("decimal", 1.5, 2.5)).toBe(false);
    });
  });

  describe("integer", () => {
    it("returns true for equal integers", () => {
      expect(areValuesEqual("integer", 3, 3)).toBe(true);
    });

    it("returns false for different integers", () => {
      expect(areValuesEqual("integer", 3, 4)).toBe(false);
    });
  });

  describe("date", () => {
    it("returns true for equal dates", () => {
      expect(areValuesEqual("date", "2024-01-01", "2024-01-01")).toBe(true);
    });

    it("returns false for different dates", () => {
      expect(areValuesEqual("date", "2024-01-01", "2024-02-01")).toBe(false);
    });
  });

  describe("dateTime", () => {
    it("returns true for equal dateTime values", () => {
      expect(
        areValuesEqual(
          "dateTime",
          "2024-01-01T00:00:00Z",
          "2024-01-01T00:00:00Z",
        ),
      ).toBe(true);
    });

    it("returns false for different dateTime values", () => {
      expect(
        areValuesEqual(
          "dateTime",
          "2024-01-01T00:00:00Z",
          "2024-02-01T00:00:00Z",
        ),
      ).toBe(false);
    });

    it("normalizes timezone offsets when both are present", () => {
      const result = areValuesEqual(
        "dateTime",
        "2024-01-01T08:00:00Z",
        "2024-01-01T10:00:00+02:00",
      );
      expect(result).toBe(true);
    });

    it("returns false when precision differs", () => {
      expect(
        areValuesEqual("dateTime", "2024-01-01T08:00Z", "2024-01-01T08:00:00Z"),
      ).toBe(false);
    });
  });

  describe("url", () => {
    it("returns true for equal urls", () => {
      expect(areValuesEqual("url", "https://a", "https://a")).toBe(true);
    });

    it("returns false for different urls", () => {
      expect(areValuesEqual("url", "https://a", "https://b")).toBe(false);
    });
  });

  describe("time", () => {
    it("returns true for equal times", () => {
      expect(areValuesEqual("time", "08:30:00", "08:30:00")).toBe(true);
    });

    it("returns false for different times", () => {
      expect(areValuesEqual("time", "08:30:00", "09:30:00")).toBe(false);
    });

    it("returns false when precision differs", () => {
      expect(areValuesEqual("time", "08:30", "08:30:00")).toBe(false);
    });
  });

  describe("coding", () => {
    it("returns true for equal codings", () => {
      const codingA: Coding = { system: "sys", code: "1", display: "One" };
      const codingB: Coding = { system: "sys", code: "1", display: "One" };
      expect(areValuesEqual("Coding", codingA, codingB)).toBe(true);
    });

    it("returns false for different codings", () => {
      const codingA: Coding = { system: "sys", code: "1", display: "One" };
      const codingC: Coding = { system: "sys", code: "2" };
      expect(areValuesEqual("Coding", codingA, codingC)).toBe(false);
    });

    it("returns true for display-only codings", () => {
      const codingDisplayOnlyA: Coding = { display: "View" };
      const codingDisplayOnlyB: Coding = { display: "View" };
      expect(
        areValuesEqual("Coding", codingDisplayOnlyA, codingDisplayOnlyB),
      ).toBe(true);
    });

    it("ignores differences in coding version", () => {
      const codingA: Coding = { system: "sys", code: "1", version: "v1" };
      const codingB: Coding = { system: "sys", code: "1", version: "v2" };
      expect(areValuesEqual("Coding", codingA, codingB)).toBe(true);
    });
  });

  describe("quantity", () => {
    it("returns true for equal quantities", () => {
      const quantityA: Quantity = { value: 10, unit: "kg", system: "uom" };
      const quantityB: Quantity = { value: 10, unit: "kg", system: "uom" };
      expect(areValuesEqual("Quantity", quantityA, quantityB)).toBe(true);
    });

    it("returns false for different quantities", () => {
      const quantityA: Quantity = { value: 10, unit: "kg", system: "uom" };
      const quantityC: Quantity = { value: 10, unit: "lb", system: "uom" };
      expect(areValuesEqual("Quantity", quantityA, quantityC)).toBe(false);
    });

    it("detects differences in quantity comparator", () => {
      const quantityA: Quantity = { value: 10, unit: "kg", comparator: ">" };
      const quantityB: Quantity = { value: 10, unit: "kg", comparator: ">=" };
      expect(areValuesEqual("Quantity", quantityA, quantityB)).toBe(false);
    });

    it("returns true for comparator-only structural matches", () => {
      const quantityA: Quantity = { comparator: "<", value: 5, unit: "mg" };
      const quantityB: Quantity = { comparator: "<", value: 5, unit: "mg" };

      expect(areValuesEqual("Quantity", quantityA, quantityB)).toBe(true);
    });

    it("returns true for non-numeric but structurally equal quantities", () => {
      const quantityA: Quantity = { unit: "packs", system: "http://foo" };
      const quantityB: Quantity = { unit: "packs", system: "http://foo" };

      expect(areValuesEqual("Quantity", quantityA, quantityB)).toBe(true);
    });

    it("returns false when non-numeric structures differ", () => {
      const quantityA: Quantity = { unit: "packs", system: "http://foo" };
      const quantityB: Quantity = { unit: "bottles", system: "http://foo" };

      expect(areValuesEqual("Quantity", quantityA, quantityB)).toBe(false);
    });

    it("treats UCUM-convertible units as equal", () => {
      const quantityA: Quantity = {
        value: 1,
        system: "http://unitsofmeasure.org",
        code: "g",
      };
      const quantityB: Quantity = {
        value: 1000,
        system: "http://unitsofmeasure.org",
        code: "mg",
      };

      expect(areValuesEqual("Quantity", quantityA, quantityB)).toBe(true);
    });

    it("treats undefined system with UCUM code as convertible", () => {
      const quantityA: Quantity = { value: 2, code: "g" };
      const quantityB: Quantity = {
        value: 2000,
        system: "http://unitsofmeasure.org",
        code: "mg",
      };

      expect(areValuesEqual("Quantity", quantityA, quantityB)).toBe(true);
    });

    it("returns false when UCUM conversion fails", () => {
      const quantityA: Quantity = {
        value: 5,
        system: "http://unitsofmeasure.org",
        code: "invalid",
      };
      const quantityB: Quantity = {
        value: 5,
        system: "http://unitsofmeasure.org",
        code: "mg",
      };

      expect(areValuesEqual("Quantity", quantityA, quantityB)).toBe(false);
    });
  });

  describe("reference", () => {
    it("returns true for equal references", () => {
      const referenceA: Reference = {
        reference: "Patient/1",
        display: "Alice",
      };
      const referenceB: Reference = {
        reference: "Patient/1",
        display: "Alice",
      };
      expect(areValuesEqual("Reference", referenceA, referenceB)).toBe(true);
    });

    it("returns false for different references", () => {
      const referenceA: Reference = {
        reference: "Patient/1",
        display: "Alice",
      };
      const referenceC: Reference = { reference: "Patient/2" };
      expect(areValuesEqual("Reference", referenceA, referenceC)).toBe(false);
    });

    it("detects differences in reference type", () => {
      const referenceA: Reference = { reference: "Patient/1", type: "Patient" };
      const referenceB: Reference = {
        reference: "Patient/1",
        type: "Practitioner",
      };
      expect(areValuesEqual("Reference", referenceA, referenceB)).toBe(false);
    });

    it("detects differences in reference identifier", () => {
      const referenceA: Reference = {
        identifier: { system: "sys", value: "1" },
      };
      const referenceB: Reference = {
        identifier: { system: "sys", value: "2" },
      };
      expect(areValuesEqual("Reference", referenceA, referenceB)).toBe(false);
    });
  });

  describe("attachment", () => {
    it("returns true for equal attachments", () => {
      const attachmentA: Attachment = { url: "https://file" };
      const attachmentB: Attachment = { url: "https://file" };
      expect(areValuesEqual("Attachment", attachmentA, attachmentB)).toBe(true);
    });

    it("returns false for different attachments", () => {
      const attachmentA: Attachment = { url: "https://file" };
      const attachmentC: Attachment = { url: "https://other" };
      expect(areValuesEqual("Attachment", attachmentA, attachmentC)).toBe(
        false,
      );
    });

    it("detects differences in attachment hash", () => {
      const attachmentA: Attachment = { url: "https://file", hash: "abc" };
      const attachmentB: Attachment = { url: "https://file", hash: "def" };
      expect(areValuesEqual("Attachment", attachmentA, attachmentB)).toBe(
        false,
      );
    });
  });
});

describe("normalizeExpressionValues", () => {
  it("drops undefined entries but keeps null placeholders", () => {
    expect(normalizeExpressionValues("string", undefined)).toEqual([]);
    expect(normalizeExpressionValues("string", null)).toEqual([null]);
  });

  it("parses booleans from primitives and strings", () => {
    expect(normalizeExpressionValues("boolean", [true, "FALSE"])).toEqual([
      true,
      false,
    ]);
  });

  it("parses integers and decimals from numbers and numeric strings", () => {
    expect(normalizeExpressionValues("integer", 42)).toEqual([42]);
    expect(normalizeExpressionValues("decimal", "3.14")).toEqual([3.14]);
  });

  it("parses textual types only from primitives", () => {
    expect(normalizeExpressionValues("text", "note")).toEqual(["note"]);
    expect(normalizeExpressionValues("string", "alpha")).toEqual(["alpha"]);
    expect(normalizeExpressionValues("time", "08:30")).toEqual(["08:30"]);
  });

  it("passes through structured resources like Coding/Attachment/Reference", () => {
    const coding: Coding = { system: "sys", code: "1" };
    const attachment: Attachment = { url: "https://file" };
    const reference: Reference = { reference: "Patient/1" };
    expect(normalizeExpressionValues("coding", coding)).toEqual([coding]);
    expect(normalizeExpressionValues("attachment", attachment)).toEqual([
      attachment,
    ]);
    expect(normalizeExpressionValues("reference", reference)).toEqual([
      reference,
    ]);
  });

  it("parses quoted quantity literals returned as strings", () => {
    const [quantity] = normalizeExpressionValues("quantity", "10 'mg'");
    expect(quantity).toEqual({
      value: 10,
      unit: "mg",
      code: "mg",
      system: "http://unitsofmeasure.org",
    });
  });

  it("parses bare quantity literals returned as strings", () => {
    const [quantity] = normalizeExpressionValues("quantity", "1 day");
    expect(quantity).toEqual({
      value: 1,
      unit: "day",
      code: "day",
      system: "http://unitsofmeasure.org",
    });
  });

  it("parses unitless quantity literals as value-only quantities", () => {
    const [quantity] = normalizeExpressionValues("quantity", "42");
    expect(quantity).toEqual({ value: 42 });
  });

  it("passes through structured quantity objects", () => {
    const original = { value: 5, unit: "kg" };
    expect(normalizeExpressionValues("quantity", original)).toEqual([original]);
  });

  it("ignores unparsable quantity literals", () => {
    const result = normalizeExpressionValues("quantity", "not a quantity");
    expect(result).toHaveLength(0);
  });

  it("only keeps the first value when arrays have multiple entries", () => {
    const values = normalizeExpressionValues("integer", [10, 15]);
    expect(values).toEqual([10, 15]);
  });
});

describe("date", () => {
  it("formats date values for display", () => {
    const formatted = stringifyValue("date", "2025-11-03", "fallback");
    expect(formatted).toContain("November 3, 2025");
  });
});

describe("dateTime", () => {
  it("formats dateTime values in local style", () => {
    const formatted = stringifyValue(
      "dateTime",
      "2025-11-03T10:00:00-05:00",
      "fallback",
    );
    expect(formatted).toContain("November 3, 2025");
  });
});

describe("time formatting", () => {
  it("formats time values using locale", () => {
    const formatted = stringifyValue("time", "13:30:00", "fallback");
    expect(formatted).toMatch(/1:30/);
  });
});

describe("compareQuantities", () => {
  const UCUM_SYSTEM = "http://unitsofmeasure.org";

  it("returns a positive value when actual exceeds expected with identical units", () => {
    const actual: Quantity = {
      value: 5,
      unit: "cup",
      system: "http://example",
    };
    const expected: Quantity = {
      value: 3,
      unit: "cup",
      system: "http://example",
    };

    const diff = compareQuantities(actual, expected);
    expect(diff).toBeGreaterThan(0);
  });

  it("returns a negative value when UCUM conversion shows actual is lower", () => {
    const actual: Quantity = { value: 500, system: UCUM_SYSTEM, code: "mg" };
    const expected: Quantity = { value: 1, system: UCUM_SYSTEM, code: "g" };

    const diff = compareQuantities(actual, expected);
    expect(diff).toBeLessThan(0);
  });

  it("returns zero when UCUM conversion matches even with unit text", () => {
    const actual: Quantity = { value: 1, system: UCUM_SYSTEM, unit: "kg" };
    const expected: Quantity = { value: 1000, system: UCUM_SYSTEM, unit: "g" };

    const diff = compareQuantities(actual, expected);
    expect(diff).toBe(0);
  });

  it("returns undefined when quantities are not comparable", () => {
    const actual: Quantity = { value: 1, system: UCUM_SYSTEM, code: "mg" };
    const expected: Quantity = {
      value: 1,
      system: "http://example",
      code: "mg",
    };

    expect(compareQuantities(actual, expected)).toBeUndefined();
  });

  it("returns undefined when comparators differ", () => {
    const actual: Quantity = {
      value: 5,
      comparator: "<",
      system: UCUM_SYSTEM,
      code: "mg",
    };
    const expected: Quantity = {
      value: 5,
      comparator: "<=",
      system: UCUM_SYSTEM,
      code: "mg",
    };

    expect(compareQuantities(actual, expected)).toBeUndefined();
  });

  it("returns undefined when either value lacks numeric data", () => {
    const actual: Quantity = { unit: "mg", system: UCUM_SYSTEM };
    const expected: Quantity = { value: 5, unit: "mg", system: UCUM_SYSTEM };

    expect(compareQuantities(actual, expected)).toBeUndefined();
  });

  it("treats undefined system with UCUM code as convertible", () => {
    const actual: Quantity = { value: 2, code: "g" };
    const expected: Quantity = { value: 1000, system: UCUM_SYSTEM, code: "mg" };

    const diff = compareQuantities(actual, expected);
    expect(diff).toBeGreaterThan(0);
  });

  it("returns undefined when UCUM conversion fails for invalid code", () => {
    const actual: Quantity = { value: 5, system: UCUM_SYSTEM, code: "invalid" };
    const expected: Quantity = { value: 5, system: UCUM_SYSTEM, code: "mg" };

    expect(compareQuantities(actual, expected)).toBeUndefined();
  });
});
