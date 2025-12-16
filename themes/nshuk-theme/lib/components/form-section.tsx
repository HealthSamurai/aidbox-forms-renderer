import type { FormSectionProps } from "@aidbox-forms/theme";
import classNames from "classnames";

export function FormSection({
  children,
  variant = "default",
}: FormSectionProps) {
  return (
    <section
      className={classNames("nhsuk-form-group", {
        "nhsuk-form-group--header": variant === "header",
        "nhsuk-form-group--footer": variant === "footer",
      })}
    >
      {children}
    </section>
  );
}
