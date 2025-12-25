import type { DisplayRendererProps } from "@aidbox-forms/theme";

export function DisplayRenderer({ linkId, children }: DisplayRendererProps) {
  return (
    <div className="nhsuk-body" data-linkid={linkId}>
      {children}
    </div>
  );
}
