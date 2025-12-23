import type { QuestionScaffoldProps } from "@aidbox-forms/theme";

export function QuestionScaffold({
  linkId,
  header,
  children,
}: QuestionScaffoldProps) {
  return (
    <div data-linkid={linkId}>
      {header ? <div className="nhsuk-u-margin-bottom-2">{header}</div> : null}
      {children}
    </div>
  );
}
