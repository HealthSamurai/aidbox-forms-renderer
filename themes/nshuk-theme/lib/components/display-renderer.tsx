import type { DisplayRendererProps } from "@aidbox-forms/theme";

export function DisplayRenderer({ linkId, content }: DisplayRendererProps) {
  return (
    <div className="nhsuk-body" data-linkid={linkId}>
      {content}
    </div>
  );
}
