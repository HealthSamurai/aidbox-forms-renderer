import type { CustomOptionFormProperties } from "@aidbox-forms/theme";
import { useId } from "react";
import { ActionButton } from "./action-button.tsx";

export function CustomOptionForm({
  content,
  errors,
  submit,
  cancel,
}: CustomOptionFormProperties) {
  const submitId = useId();
  const cancelId = useId();

  return (
    <box flexDirection="column" style={{ border: true, padding: 1, gap: 1 }}>
      {content}
      {errors}
      <box flexDirection="row" style={{ gap: 2 }}>
        <ActionButton
          id={submitId}
          label={submit.label}
          onClick={submit.onClick}
          disabled={submit.disabled}
        />
        <ActionButton
          id={cancelId}
          label={cancel.label}
          onClick={cancel.onClick}
          disabled={cancel.disabled}
        />
      </box>
    </box>
  );
}
