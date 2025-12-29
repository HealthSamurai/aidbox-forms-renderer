import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { BooleanInput } from "../boolean-input.tsx";
import { strings } from "../../../../../../strings.ts";

describe("boolean-input", () => {
  describe("value mapping", () => {
    it("maps yes/no selections to boolean values", () => {
      const handleChange = vi.fn();

      render(
        <BooleanInput
          id="consent"
          ariaLabelledBy="consent-label"
          value={null}
          onChange={handleChange}
        />,
      );

      fireEvent.click(screen.getByLabelText(strings.boolean.yes));
      fireEvent.click(screen.getByLabelText(strings.boolean.no));

      expect(handleChange).toHaveBeenCalledWith(true);
      expect(handleChange).toHaveBeenCalledWith(false);
    });
  });
});
