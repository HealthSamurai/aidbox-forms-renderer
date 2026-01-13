import { styled } from "@linaria/react";
import type { FooterProperties } from "@aidbox-forms/theme";

export function Footer({ linkId, children }: FooterProperties) {
  return (
    <footer className="nhsuk-footer" role="contentinfo" data-linkid={linkId}>
      <div className="nhsuk-width-container">{children}</div>
    </footer>
  );
}
