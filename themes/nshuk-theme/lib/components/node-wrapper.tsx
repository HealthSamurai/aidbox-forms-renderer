import type { NodeWrapperProps } from "@aidbox-forms/theme";

export function NodeWrapper({ linkId, className, children }: NodeWrapperProps) {
  return (
    <div className={className} data-linkid={linkId}>
      {children}
    </div>
  );
}
