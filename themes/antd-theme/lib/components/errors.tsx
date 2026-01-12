import type { ErrorsProperties } from "@aidbox-forms/theme";
import { Alert } from "antd";

export function Errors({ id, messages }: ErrorsProperties) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div id={id}>
      <Alert
        type="error"
        showIcon
        message="Issues"
        description={
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            {messages.map((message, index) => (
              <li key={`${index}-${message}`}>{message}</li>
            ))}
          </ul>
        }
      />
    </div>
  );
}
