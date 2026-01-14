import { Children, useId } from "react";
import type { AnswerListProperties } from "@aidbox-forms/theme";
import { ActionButton } from "./action-button.tsx";

export function AnswerList({
  children,
  onAdd,
  canAdd,
  addLabel,
}: AnswerListProperties) {
  const items = Children.toArray(children);
  const addId = useId();

  return (
    <box flexDirection="column" style={{ gap: 1 }}>
      {items.length > 0 ? <box flexDirection="column">{items}</box> : undefined}
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
