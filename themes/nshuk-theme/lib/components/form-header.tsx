import type { FormHeaderProps } from "@aidbox-forms/theme";

export function FormHeader({ title, description }: FormHeaderProps) {
  if (!title && !description) return null;
  return (
    <header>
      {title ? <h1 className="nhsuk-heading-l">{title}</h1> : null}
      {description ? <p className="nhsuk-body">{description}</p> : null}
    </header>
  );
}
