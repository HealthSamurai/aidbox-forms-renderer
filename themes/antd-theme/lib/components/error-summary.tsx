import type { ErrorSummaryProperties } from "@aidbox-forms/theme";
import { Alert } from "antd";
import { useEffect, useRef } from "react";

export function ErrorSummary({
  id,
  title = "There is a problem",
  description,
  items,
}: ErrorSummaryProperties) {
  const focusReference = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    focusReference.current?.focus();
  }, [items.length]);

  if (items.length === 0) return;

  return (
    <div id={id} role="alert" tabIndex={-1} ref={focusReference}>
      <Alert
        type="error"
        showIcon
        message={title}
        description={
          <>
            {description ? (
              <div style={{ marginBottom: "0.5rem" }}>{description}</div>
            ) : undefined}
            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
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
          </>
        }
      />
    </div>
  );
}
