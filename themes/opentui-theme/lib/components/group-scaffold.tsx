import { useId } from "react";
import type { GroupScaffoldProperties } from "@aidbox-forms/theme";
import { ActionButton } from "./action-button.tsx";

export function GroupScaffold({
  header,
  children,
  errors,
  onRemove,
  canRemove,
  removeLabel,
}: GroupScaffoldProperties) {
  const removeId = useId();

  return (
    <box flexDirection="column" style={{ gap: 1, border: true, padding: 1 }}>
      <box flexDirection="row" style={{ gap: 2 }}>
        <box style={{ flexGrow: 1 }}>{header}</box>
        {onRemove ? (
          <ActionButton
            id={removeId}
            label={removeLabel ?? "Remove"}
            onClick={onRemove}
            disabled={canRemove === false}
          />
        ) : undefined}
      </box>
      {children}
      {errors}
    </box>
  );
}
