import type { LabelProperties } from "@aidbox-forms/theme";
import { ReactNode } from "react";

export function Label({
  prefix,
  children,
  id,
  htmlFor,
  required,
  help,
  legal,
  flyover,
  as = "label",
}: LabelProperties) {
  if (as === "legend") {
    return (
      <div className="nhsuk-label nhsuk-label--xl">
        <div id={id}>
          {prefix && <Prefix>{prefix}</Prefix>}
          {children}
          {required && <span aria-hidden="true"> *</span>}
        </div>
        {help}
        {legal}
        {flyover}
      </div>
    );
  }

  const labelFor = as === "label" ? htmlFor : undefined;

  return (
    <div className="nhsuk-form-group">
      <div className="nhsuk-label-wrapper">
        {as === "label" ? (
          <label
            className="nhsuk-label nhsuk-label--m"
            id={id}
            htmlFor={labelFor}
          >
            {prefix && <Prefix>{prefix}</Prefix>}
            {children}
            {required && <span aria-hidden="true"> *</span>}
          </label>
        ) : (
          <div className="nhsuk-label nhsuk-label--m" id={id}>
            {prefix && <Prefix>{prefix}</Prefix>}
            {children}
            {required && <span aria-hidden="true"> *</span>}
          </div>
        )}
        {help}
        {legal}
        {flyover}
      </div>
    </div>
  );
}

function Prefix({ children }: { children: ReactNode }) {
  return <span className="nhsuk-label__prefix">{children} </span>;
}
