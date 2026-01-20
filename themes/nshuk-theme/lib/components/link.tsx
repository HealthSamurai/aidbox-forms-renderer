import type { LinkProperties } from "@formbox/theme";

export function Link({ href, children, target, rel }: LinkProperties) {
  return (
    <a href={href} className="nhsuk-link" target={target} rel={rel}>
      {children}
    </a>
  );
}
