import type { QuestionScaffoldProperties } from "@aidbox-forms/theme";

export function QuestionScaffold({
  linkId,
  header,
  children,
  errors,
}: QuestionScaffoldProperties) {
  const className = errors
    ? "nhsuk-form-group nhsuk-form-group--error"
    : "nhsuk-form-group";

  return (
    <div className={className} data-linkid={linkId}>
      {header}
      {errors}
      {children}
    </div>
  );
}
