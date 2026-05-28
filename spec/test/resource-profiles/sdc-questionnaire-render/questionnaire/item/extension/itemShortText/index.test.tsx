import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { StringRenderer } from "@formbox/renderer/component/question/fhir/string/string-renderer.tsx";
import { EXT } from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

function getStringQuestion(form: FormStore, linkId: string) {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error("Expected string question");
  }
  return node as IQuestionNode<"string">;
}

function mockMatchMedia(matches: boolean) {
  const original = globalThis.matchMedia;
  const mediaQueryList = {
    matches,
    media: "(max-width: 40rem)",
    onchange: undefined,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList;

  Object.defineProperty(globalThis, "matchMedia", {
    configurable: true,
    writable: true,
    value: () => mediaQueryList,
  });

  return () => {
    Object.defineProperty(globalThis, "matchMedia", {
      configurable: true,
      writable: true,
      value: original,
    });
  };
}

describe("itemShortText", () => {
  it("uses shortText as label on small screens", () => {
    const restoreMatchMedia = mockMatchMedia(true);
    try {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "age",
            text: "How old are you in completed years?",
            type: "string",
            extension: [
              {
                url: EXT.SDC_SHORT_TEXT,
                valueString: "Age in years",
              },
            ],
          },
        ],
      };

      const form = new FormStore(
        en,
        "r5",
        "form",
        questionnaire,
        undefined,
        undefined,
      );
      const question = getStringQuestion(form, "age");

      render(<StringRenderer node={question} />);

      expect(screen.getByLabelText("Age in years")).toBeInTheDocument();
      expect(
        screen.queryByLabelText("How old are you in completed years?"),
      ).toBeNull();
    } finally {
      restoreMatchMedia();
    }
  });

  it("uses the regular item text as label on large screens", () => {
    const restoreMatchMedia = mockMatchMedia(false);
    try {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "age",
            text: "How old are you in completed years?",
            type: "string",
            extension: [
              {
                url: EXT.SDC_SHORT_TEXT,
                valueString: "Age in years",
              },
            ],
          },
        ],
      };

      const form = new FormStore(
        en,
        "r5",
        "form",
        questionnaire,
        undefined,
        undefined,
      );
      const question = getStringQuestion(form, "age");

      render(<StringRenderer node={question} />);

      expect(
        screen.getByLabelText("How old are you in completed years?"),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("Age in years")).toBeNull();
    } finally {
      restoreMatchMedia();
    }
  });

  it("keeps regular item text on small screens when shortText is not present", () => {
    const restoreMatchMedia = mockMatchMedia(true);
    try {
      const questionnaire: Questionnaire = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
          {
            linkId: "age",
            text: "How old are you in completed years?",
            type: "string",
          },
        ],
      };

      const form = new FormStore(
        en,
        "r5",
        "form",
        questionnaire,
        undefined,
        undefined,
      );
      const question = getStringQuestion(form, "age");

      render(<StringRenderer node={question} />);

      expect(
        screen.getByLabelText("How old are you in completed years?"),
      ).toBeInTheDocument();
    } finally {
      restoreMatchMedia();
    }
  });
});
