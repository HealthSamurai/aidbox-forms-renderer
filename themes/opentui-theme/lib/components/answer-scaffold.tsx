import { useId } from "react";
import type { AnswerScaffoldProperties } from "@aidbox-forms/theme";
import { ActionButton } from "./action-button.tsx";

export function AnswerScaffold({
  control,
  onRemove,
  canRemove,
  errors,
  children,
}: AnswerScaffoldProperties) {
  const removeId = useId();

  return (
    <box flexDirection="column" style={{ gap: 1 }}>
      <box flexDirection="row" style={{ gap: 2 }}>
        <box style={{ flexGrow: 1 }}>{control}</box>
        {onRemove ? (
          <ActionButton
            id={removeId}
            label="Remove"
            onClick={onRemove}
            disabled={canRemove === false}
          />
        ) : undefined}
      </box>

      {children || errors ? (
        <box flexDirection="column" style={{ gap: 1, marginLeft: 2 }}>
          {children}
          {errors}
        </box>
      ) : undefined}
    </box>
  );
}
