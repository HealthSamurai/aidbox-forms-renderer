import type { FormErrorsProps } from "@aidbox-forms/theme";

export function FormErrors({ messages }: FormErrorsProps) {
  if (messages.length === 0) return null;
  return (
    <div className="nhsuk-error-summary" role="alert">
      <h2 className="nhsuk-error-summary__title">There is a problem</h2>
      <div className="nhsuk-error-summary__body">
        <ul className="nhsuk-list nhsuk-error-summary__list">
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
