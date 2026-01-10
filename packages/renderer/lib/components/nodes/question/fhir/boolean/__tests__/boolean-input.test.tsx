import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { BooleanInput } from "../boolean-input.tsx";
describe("boolean-input", () => {
  describe("value mapping", () => {
    it("toggles checkbox selections to boolean values", () => {
      const handleChange = vi.fn();

      const { rerender } = render(
        <BooleanInput
          id="consent"
          ariaLabelledBy="consent-label"
          ariaDescribedBy="consent-help"
          value={undefined}
          onChange={handleChange}
        />,
      );

      fireEvent.click(screen.getByRole("checkbox"));
      expect(handleChange).toHaveBeenCalledWith(true);

      rerender(
        <BooleanInput
          id="consent"
          ariaLabelledBy="consent-label"
          ariaDescribedBy="consent-help"
          value
          onChange={handleChange}
        />,
      );

      fireEvent.click(screen.getByRole("checkbox"));
      expect(handleChange).toHaveBeenCalledWith(false);
    });
  });
});
