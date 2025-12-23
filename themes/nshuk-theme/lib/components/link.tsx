import type { LinkProps } from "@aidbox-forms/theme";

export function Link({ href, label, target, rel }: LinkProps) {
  return (
    <a href={href} className="nhsuk-link" target={target} rel={rel}>
      {label}
    </a>
  );
}
