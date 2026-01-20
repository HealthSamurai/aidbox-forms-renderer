import type { ErrorSummaryProperties } from "@formbox/theme";
import { useEffect, useRef } from "react";

export function ErrorSummary({
  id,
  title = "There is a problem",
  description,
  items,
}: ErrorSummaryProperties) {
  const focusReference = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }
    focusReference.current?.focus();
  }, [items.length]);

  if (items.length === 0) return;

  return (
    <div className="nhsuk-error-summary" id={id}>
      <div role="alert" tabIndex={-1} ref={focusReference}>
        <h2 className="nhsuk-error-summary__title">{title}</h2>
        <div className="nhsuk-error-summary__body">
          {description && <p className="nhsuk-body">{description}</p>}
          <ul className="nhsuk-list nhsuk-error-summary__list">
            {items.map((item, index) => {
              const key = `${item.href ?? ""}::${item.message}::${index}`;
              return (
                <li key={key}>
                  {item.href ? (
                    <a href={item.href}>{item.message}</a>
                  ) : (
                    item.message
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
