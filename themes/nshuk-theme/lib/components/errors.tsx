import type { ErrorsProperties } from "@formbox/theme";

export function Errors({ id, messages }: ErrorsProperties) {
  if (messages.length === 0) return;

  return (
    <div id={id}>
      {messages.map((message, index) => (
        <span className="nhsuk-error-message" key={index}>
          <span className="nhsuk-u-visually-hidden">Error:</span> {message}
        </span>
      ))}
    </div>
  );
}
