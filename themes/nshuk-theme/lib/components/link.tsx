import type { LinkProps } from "@aidbox-forms/theme";

export function Link({ href, children, target, rel }: LinkProps) {
  return (
    <a href={href} className="nhsuk-link" target={target} rel={rel}>
      {children}
    </a>
  );
}
