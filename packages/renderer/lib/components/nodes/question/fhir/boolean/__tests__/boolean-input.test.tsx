import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BooleanInput } from "../boolean-input.tsx";
import { strings } from "../../../../../../strings.ts";

describe("boolean-input", () => {
  describe("value mapping", () => {
    it("maps yes/no selections to boolean values", async () => {
      const handleChange = vi.fn();

      render(
        <BooleanInput
          id="consent"
          ariaLabelledBy="consent-label"
          value={null}
          onChange={handleChange}
        />,
      );

      const user = userEvent.setup();
      await user.click(screen.getByLabelText(strings.boolean.yes));
      await user.click(screen.getByLabelText(strings.boolean.no));

      expect(handleChange).toHaveBeenCalledWith(true);
      expect(handleChange).toHaveBeenCalledWith(false);
    });
  });
});
