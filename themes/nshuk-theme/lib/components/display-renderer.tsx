import type { DisplayRendererProperties } from "@aidbox-forms/theme";

export function DisplayRenderer({
  linkId,
  children,
}: DisplayRendererProperties) {
  return (
    <div className="nhsuk-body" data-linkid={linkId}>
      {children}
    </div>
  );
}
