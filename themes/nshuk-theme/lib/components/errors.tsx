import type { ErrorsProperties } from "@aidbox-forms/theme";

export function Errors({ id, messages }: ErrorsProperties) {
  if (messages.length === 0) return;
  return (
    <div className="nhsuk-error-message" id={id} role="alert">
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
