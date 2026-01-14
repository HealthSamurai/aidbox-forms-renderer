import type { QuestionScaffoldProperties } from "@aidbox-forms/theme";

export function QuestionScaffold({
  linkId,
  header,
  children,
  errors,
}: QuestionScaffoldProperties) {
  return (
    <box flexDirection="column" style={{ gap: 1 }}>
      {header}
      <box id={linkId} flexDirection="column" style={{ gap: 1 }}>
        {children}
      </box>
      {errors}
    </box>
  );
}
