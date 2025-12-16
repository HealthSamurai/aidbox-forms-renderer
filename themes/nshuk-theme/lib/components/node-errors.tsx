import type { NodeErrorsProps } from "@aidbox-forms/theme";

export function NodeErrors({ id, messages }: NodeErrorsProps) {
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
