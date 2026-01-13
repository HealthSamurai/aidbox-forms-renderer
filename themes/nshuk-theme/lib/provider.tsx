import { CSSProperties, PropsWithChildren } from "react";

export function Provider({ children }: PropsWithChildren) {
  return (
    <div
      className="nhsuk-frontend-supported"
      style={
        {
          display: "contents",
          "--nhsuk-border-width-form-element": "2px",
          "--nhsuk-focus-width": "4px",
          "--nhsuk-border-table-cell-width": "1px",
          "--nhsuk-base-line-height": "24px",
          "--nhsuk-spacing-1": "4px",
          "--nhsuk-spacing-2": "8px",
          "--nhsuk-spacing-3": "16px",
          "--nhsuk-spacing-4": "24px",
          "--nhsuk-spacing-5": "32px",
          "--nhsuk-spacing-6": "40px",
          "--nhsuk-spacing-7": "48px",
          "--nhsuk-spacing-8": "56px",
          "--nhsuk-spacing-9": "64px",
          "--nhsuk-font-size-s": "0.875rem",
          "--nhsuk-opacity-disabled": "0.5",
          "--nhsuk-opacity-solid": "1",
          "--nhsuk-z-index-dropdown": "10",
          "--nhsuk-z-index-sticky": "1",
          "--nhsuk-spinner-duration": "0.7s",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
