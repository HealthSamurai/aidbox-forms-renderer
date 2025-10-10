import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Renderer from "../index";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";

describe("Renderer", () => {
  it("updates QuestionnaireResponse when a user answers a question", async () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      id: "test",
      status: "active",
      item: [
        {
          linkId: "name",
          text: "Full name",
          type: "string",
          required: true,
        },
      ],
    };

    const handleChange = vi.fn();

    render(<Renderer questionnaire={questionnaire} onChange={handleChange} />);

    const user = userEvent.setup();
    const input = screen.getByRole("textbox", { name: /full name/i });
    await user.clear(input);
    await user.type(input, "Ada Lovelace");

    expect(handleChange).toHaveBeenCalled();

    const lastCall = handleChange.mock.calls.at(-1) as [QuestionnaireResponse];
    const response = lastCall[0];
    const valueString = response.item?.[0]?.answer?.[0]?.valueString;
    expect(valueString).toBe("Ada Lovelace");
    expect(response.status).toBe("in-progress");
  });
});
