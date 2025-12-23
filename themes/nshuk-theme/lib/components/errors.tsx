import type { ErrorsProps } from "@aidbox-forms/theme";

export function Errors({ id, messages }: ErrorsProps) {
  if (messages.length === 0) return null;
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
