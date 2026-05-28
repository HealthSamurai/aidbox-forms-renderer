import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { type QuestionnaireOf } from "@formbox/renderer";
import {
  CustomQuestionnaireExtensionsProvider,
  CustomItemExtensionsProvider,
  type InferCustomExtensionValues,
  useCustomExtension,
} from "@formbox/theme";
import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";

type Questionnaire = QuestionnaireOf<"r5">;

const FORM_SHARED_URL =
  "http://example.org/fhir/StructureDefinition/form-shared";
const FORM_ONLY_URL = "http://example.org/fhir/StructureDefinition/form-only";
const FORM_REPEATED_URL =
  "http://example.org/fhir/StructureDefinition/form-repeated";
const ITEM_SHARED_URL =
  "http://example.org/fhir/StructureDefinition/item-shared";
const ITEM_ONLY_URL = "http://example.org/fhir/StructureDefinition/item-only";

function getStringValue(extension: unknown): string | undefined {
  return typeof extension === "object" &&
    extension !== null &&
    "valueString" in extension &&
    typeof extension.valueString === "string"
    ? extension.valueString
    : undefined;
}

function getIntegerValue(extension: unknown): number | undefined {
  return typeof extension === "object" &&
    extension !== null &&
    "valueInteger" in extension &&
    typeof extension.valueInteger === "number"
    ? extension.valueInteger
    : undefined;
}

const questionnaire: Questionnaire = {
  resourceType: "Questionnaire",
  status: "active",
  extension: [
    { url: FORM_SHARED_URL, valueString: "form-shared" },
    { url: FORM_ONLY_URL, valueString: "form-only" },
    { url: FORM_REPEATED_URL, valueInteger: 1 },
    { url: FORM_REPEATED_URL, valueInteger: 2 },
  ],
  item: [
    {
      linkId: "q-1",
      type: "string",
      text: "Question 1",
      extension: [
        { url: ITEM_SHARED_URL, valueString: "item-shared" },
        { url: ITEM_ONLY_URL, valueString: "item-only" },
      ],
    },
  ],
};

const customExtensions = {
  formShared: {
    target: "questionnaire",
    url: FORM_SHARED_URL,
    repeats: false,
    extract: getStringValue,
  },
  formOnly: {
    target: "questionnaire",
    url: FORM_ONLY_URL,
    repeats: false,
    extract: getStringValue,
  },
  repeatedNumbers: {
    target: "questionnaire",
    url: FORM_REPEATED_URL,
    repeats: true,
    extract: (extension: unknown) => getIntegerValue(extension) ?? -1,
  },
  itemShared: {
    target: "item",
    url: ITEM_SHARED_URL,
    repeats: false,
    extract: getStringValue,
  },
  itemOnly: {
    target: "item",
    url: ITEM_ONLY_URL,
    repeats: false,
    extract: getStringValue,
  },
} as const;

declare module "@formbox/theme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomExtensionValueRegistry extends InferCustomExtensionValues<
    typeof customExtensions
  > {}
}

function HookProbe() {
  const formShared = useCustomExtension("formShared");
  const formOnly = useCustomExtension("formOnly");
  const itemOnly = useCustomExtension("itemOnly");
  const repeatedNumbersRaw = useCustomExtension("repeatedNumbers");
  const repeatedNumbers = Array.isArray(repeatedNumbersRaw)
    ? repeatedNumbersRaw
    : undefined;

  return (
    <>
      <span data-testid="hook-form-shared">{formShared}</span>
      <span data-testid="hook-form-only">{formOnly}</span>
      <span data-testid="hook-item-only">{itemOnly}</span>
      <span data-testid="hook-repeated-numbers">
        {repeatedNumbers?.join(",")}
      </span>
    </>
  );
}

describe("custom extensions", () => {
  it("extracts questionnaire and item custom extension values at runtime", () => {
    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      customExtensions,
    );

    expect(form.customExtensions["formShared"]).toBe("form-shared");
    expect(form.customExtensions["formOnly"]).toBe("form-only");
    expect(form.customExtensions["repeatedNumbers"]).toEqual([1, 2]);

    const question = form.scope.lookupNode("q-1");
    expect(question && isQuestionNode(question)).toBe(true);
    if (!question || !isQuestionNode(question)) {
      throw new Error('Expected question node for linkId "q-1"');
    }

    expect(question.customExtensions["itemShared"]).toBe("item-shared");
    expect(question.customExtensions["itemOnly"]).toBe("item-only");
  });

  it("resolves node-first then form-level values via useCustomExtension", () => {
    render(
      <CustomQuestionnaireExtensionsProvider
        value={{
          formShared: "form-shared",
          formOnly: "form-only",
          repeatedNumbers: [1, 2],
        }}
      >
        <CustomItemExtensionsProvider value={{ itemOnly: "item-only" }}>
          <HookProbe />
        </CustomItemExtensionsProvider>
      </CustomQuestionnaireExtensionsProvider>,
    );

    expect(screen.getByTestId("hook-form-shared")).toHaveTextContent(
      "form-shared",
    );
    expect(screen.getByTestId("hook-form-only")).toHaveTextContent("form-only");
    expect(screen.getByTestId("hook-item-only")).toHaveTextContent("item-only");
    expect(screen.getByTestId("hook-repeated-numbers")).toHaveTextContent(
      "1,2",
    );
  });
});
