import type { LinkProperties } from "@aidbox-forms/theme";

export function Link({ href, children, target, rel }: LinkProperties) {
  return (
    <a href={href} className="nhsuk-link" target={target} rel={rel}>
      {children}
    </a>
  );
}
