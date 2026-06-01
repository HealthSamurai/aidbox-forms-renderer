import type { LinkProperties } from "@formbox/theme";

export function Link({ id, href, children, target, rel }: LinkProperties) {
  return (
    <a id={id} href={href} className="nhsuk-link" target={target} rel={rel}>
      {children}
    </a>
  );
}
