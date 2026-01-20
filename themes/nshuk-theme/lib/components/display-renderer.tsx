import type { DisplayRendererProperties } from "@formbox/theme";

export function DisplayRenderer({
  linkId,
  children,
}: DisplayRendererProperties) {
  return (
    <div className="nhsuk-form-group" data-linkid={linkId}>
      {children}
    </div>
  );
}
