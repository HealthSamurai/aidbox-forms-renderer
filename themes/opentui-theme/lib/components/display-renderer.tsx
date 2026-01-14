import type { DisplayRendererProperties } from "@aidbox-forms/theme";

export function DisplayRenderer({
  linkId,
  children,
}: DisplayRendererProperties) {
  return (
    <box id={linkId} style={{ border: true, padding: 1 }}>
      {children}
    </box>
  );
}
