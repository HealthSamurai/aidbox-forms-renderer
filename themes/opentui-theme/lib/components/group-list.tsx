import { useId } from "react";
import type { GroupListProperties } from "@aidbox-forms/theme";
import { ActionButton } from "./action-button.tsx";

export function GroupList({
  linkId,
  header,
  children,
  onAdd,
  canAdd,
  addLabel,
}: GroupListProperties) {
  const addId = useId();

  return (
    <box id={linkId} flexDirection="column" style={{ gap: 1 }}>
      {header}
      {children}
      {onAdd ? (
        <ActionButton
          id={addId}
          label={addLabel ?? "Add"}
          onClick={onAdd}
          disabled={canAdd === false}
        />
      ) : undefined}
    </box>
  );
}
