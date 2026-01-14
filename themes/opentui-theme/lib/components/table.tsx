import type { TableProperties } from "@aidbox-forms/theme";
import { ActionButton } from "./action-button.tsx";
import { InlineText } from "./utilities.tsx";

export function Table({ columns, rows }: TableProperties) {
  const hasColumnMeta = columns.some(
    (column) => column.isLoading || column.errors,
  );

  return (
    <box flexDirection="column" style={{ gap: 1, border: true, padding: 1 }}>
      {hasColumnMeta ? (
        <box flexDirection="column" style={{ gap: 0 }}>
          {columns.map((column) => (
            <box key={column.token} flexDirection="column" style={{ gap: 0 }}>
              <box flexDirection="row" style={{ gap: 1 }}>
                <InlineText dim>Column:</InlineText>
                <box>{column.content}</box>
                {column.isLoading ? (
                  <InlineText dim>Loading…</InlineText>
                ) : undefined}
              </box>
              {column.errors}
            </box>
          ))}
        </box>
      ) : undefined}

      <box flexDirection="column" style={{ gap: 1 }}>
        {rows.map((row) => {
          const removeId = `${row.token}-remove`;
          return (
            <box
              key={row.token}
              flexDirection="column"
              style={{ gap: 1, border: true, padding: 1 }}
            >
              <box flexDirection="row" style={{ gap: 2 }}>
                <box style={{ flexGrow: 1 }}>{row.content}</box>
                {row.onRemove ? (
                  <ActionButton
                    id={removeId}
                    label={row.removeLabel ?? "Remove"}
                    onClick={row.onRemove}
                    disabled={row.canRemove === false}
                  />
                ) : undefined}
              </box>

              {row.errors}
              {row.isLoading ? (
                <InlineText dim>Loading…</InlineText>
              ) : undefined}

              <box flexDirection="column" style={{ gap: 1, marginLeft: 1 }}>
                {row.cells.map((cell, index) => (
                  <box key={cell.token} flexDirection="row" style={{ gap: 2 }}>
                    <box style={{ minWidth: 18, flexGrow: 0 }}>
                      {columns[index]?.content}
                    </box>
                    <box style={{ flexGrow: 1 }}>{cell.content}</box>
                  </box>
                ))}
              </box>
            </box>
          );
        })}
      </box>
    </box>
  );
}
