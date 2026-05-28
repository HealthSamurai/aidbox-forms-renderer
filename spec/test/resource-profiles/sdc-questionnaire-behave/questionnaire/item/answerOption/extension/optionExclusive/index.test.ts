import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { EXT, assertDefined } from "@formbox/renderer/utilities.ts";
import type { IQuestionNode } from "@formbox/renderer/types.ts";

import type { QuestionnaireOf } from "@formbox/renderer";
type Questionnaire = QuestionnaireOf<"r5">;

function getQuestion(form: FormStore, linkId: string): IQuestionNode<"string"> {
  const node = form.scope.lookupNode(linkId);
  assertQuestionNode(node);
  return node as IQuestionNode<"string">;
}

function getToken(question: IQuestionNode<"string">, value: string): string {
  const option = question.answerOption.inherentOptions.find(
    (entry) => entry.value === value,
  );
  assertDefined(option);
  return option.token;
}

const exclusiveOptionExtension = {
  url: EXT.OPTION_EXCLUSIVE,
  valueBoolean: true,
};

describe("optionExclusive", () => {
  it("keeps only the exclusive option when selected after non-exclusive values", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "symptoms",
          type: "string",
          repeats: true,
          required: true,
          answerOption: [
            { valueString: "Fever" },
            { valueString: "Cough" },
            {
              valueString: "None of the above",
              extension: [exclusiveOptionExtension],
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
    const question = getQuestion(form, "symptoms");
    const selection = question.answerOption.select;

    selection.selectOption(getToken(question, "Fever"));
    selection.selectOption(getToken(question, "Cough"));
    expect(selection.selectedOptions.map((option) => option.value)).toEqual([
      "Fever",
      "Cough",
    ]);

    selection.selectOption(getToken(question, "None of the above"));
    expect(selection.selectedOptions.map((option) => option.value)).toEqual([
      "None of the above",
    ]);

    const fever = selection.filteredOptions.find(
      (option) => option.value === "Fever",
    );
    assertDefined(fever);
    expect(fever.disabled).toBe(false);
  });

  it("replaces the exclusive option when a regular option is selected", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "symptoms",
          type: "string",
          repeats: true,
          required: true,
          answerOption: [
            { valueString: "Fever" },
            {
              valueString: "None of the above",
              extension: [exclusiveOptionExtension],
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
    const question = getQuestion(form, "symptoms");
    const selection = question.answerOption.select;

    selection.selectOption(getToken(question, "None of the above"));
    expect(selection.selectedOptions.map((option) => option.value)).toEqual([
      "None of the above",
    ]);

    selection.selectOption(getToken(question, "Fever"));
    expect(selection.selectedOptions.map((option) => option.value)).toEqual([
      "Fever",
    ]);
  });
});
