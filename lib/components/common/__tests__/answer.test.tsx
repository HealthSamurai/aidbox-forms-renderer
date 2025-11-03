import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createElement } from "react";
import type { ChangeEvent } from "react";
import type { Questionnaire } from "fhir/r5";

import { Answer } from "../answer.tsx";
import { FormStore } from "../../../stores/form-store.ts";
import { isQuestionNode } from "../../../stores/question-store.ts";
import { getAnswerErrorId } from "../../../utils.ts";

function buildQuestionnaire(minLength = 3): Questionnaire {
  return {
    resourceType: "Questionnaire",
    status: "active",
    item: [
      {
        linkId: "required",
        text: "Description",
        type: "string",
        extension: [
          {
            url: "http://hl7.org/fhir/StructureDefinition/minLength",
            valueInteger: minLength,
          },
        ],
      },
    ],
  };
}

describe("Answer", () => {
  it("renders error messages when the answer has issues", async () => {
    const form = new FormStore(buildQuestionnaire());
    const node = form.scope.lookupNode("required");
    expect(node && isQuestionNode(node)).toBe(true);
    if (!node || !isQuestionNode(node)) throw new Error("Missing question node");

    const answer = node.answers[0];
    if (!answer) throw new Error("Expected answer instance");

    const errorId = getAnswerErrorId(answer);

    render(
      <Answer
        item={node}
        answer={answer}
        index={0}
        renderRow={({ inputId, labelId, describedById, value, setValue }) =>
          createElement("input", {
            id: inputId,
            "aria-labelledby": labelId,
            "aria-describedby": describedById ?? undefined,
            value: value ?? "",
            onChange: (event: ChangeEvent<HTMLInputElement>) =>
              setValue(event.currentTarget.value),
          })
        }
      />,
    );

    const inputs = screen.getAllByRole("textbox");
    const input = inputs[inputs.length - 1];
    fireEvent.change(input, { target: { value: "a" } });
        form.validateAll();

        expect(answer.issues).toHaveLength(1);
    expect(answer.issues[0]?.diagnostics).toMatch(/at least 3/i);

    expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(
      errorId,
    );
  });

  it("shows validation feedback after user edits to an invalid state", async () => {
    const form = new FormStore(buildQuestionnaire());
    const node = form.scope.lookupNode("required");
    expect(node && isQuestionNode(node)).toBe(true);
    if (!node || !isQuestionNode(node)) throw new Error("Missing question node");

    const answer = node.answers[0];
    if (!answer) throw new Error("Expected answer instance");

    render(
      <Answer
        item={node}
        answer={answer}
        index={0}
        renderRow={({ inputId, labelId, describedById, value, setValue }) =>
          createElement("input", {
            id: inputId,
            "aria-labelledby": labelId,
            "aria-describedby": describedById ?? undefined,
            value: value ?? "",
            onChange: (event: ChangeEvent<HTMLInputElement>) =>
              setValue(event.currentTarget.value),
          })
        }
      />,
    );

    const inputs = screen.getAllByRole("textbox");
    const input = inputs[inputs.length - 1];
    fireEvent.change(input, { target: { value: "Able" } });
    expect(form.validateAll()).toBe(true);
    expect(answer.issues).toHaveLength(0);

    fireEvent.change(input, { target: { value: "a" } });
        form.validateAll();

        expect(answer.issues).toHaveLength(1);
    expect(answer.issues[0]?.diagnostics).toMatch(/at least 3/i);
  });
});
