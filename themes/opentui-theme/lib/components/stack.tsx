import type { StackProperties } from "@aidbox-forms/theme";

export function Stack({ children }: StackProperties) {
  return (
    <box flexDirection="column" style={{ gap: 1 }}>
      {children}
    </box>
  );
}
