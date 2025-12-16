import type { DisplayNodeProps } from "@aidbox-forms/theme";

export function DisplayNode({ linkId, content }: DisplayNodeProps) {
  return (
    <div className="nhsuk-body" data-linkid={linkId}>
      {content}
    </div>
  );
}
