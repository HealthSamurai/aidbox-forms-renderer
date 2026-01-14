import { useKeyboard } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { useId } from "react";
import type { FormPagination, FormProperties } from "@aidbox-forms/theme";
import { ActionButton } from "./action-button.tsx";
import { InlineText } from "./utilities.tsx";

function isCtrlShortcut(
  key: { name: string; ctrl: boolean; meta: boolean; option: boolean },
  name: string,
): boolean {
  return key.ctrl && !key.meta && !key.option && key.name === name;
}

function PaginationControls({ pagination }: { pagination: FormPagination }) {
  const previousId = useId();
  const nextId = useId();

  return (
    <box flexDirection="row" style={{ gap: 2 }}>
      <ActionButton
        id={previousId}
        label="Prev"
        onClick={pagination.onPrev}
        disabled={pagination.disabledPrev}
      />
      <InlineText dim>
        Page {pagination.current} / {pagination.total}
      </InlineText>
      <ActionButton
        id={nextId}
        label="Next"
        onClick={pagination.onNext}
        disabled={pagination.disabledNext}
      />
    </box>
  );
}

export function Form({
  onSubmit,
  onCancel,
  children,
  pagination,
  title,
  description,
  errors,
  before,
  after,
}: FormProperties) {
  const submitId = useId();
  const cancelId = useId();

  useKeyboard((key) => {
    if (key.eventType !== "press") return;

    if (isCtrlShortcut(key, "s")) {
      if (onSubmit) {
        key.preventDefault();
        key.stopPropagation();
        onSubmit();
      }
      return;
    }

    if (isCtrlShortcut(key, "r")) {
      if (onCancel) {
        key.preventDefault();
        key.stopPropagation();
        onCancel();
      }
      return;
    }

    if (pagination && isCtrlShortcut(key, "p") && !pagination.disabledPrev) {
      key.preventDefault();
      key.stopPropagation();
      pagination.onPrev();
      return;
    }

    if (pagination && isCtrlShortcut(key, "n") && !pagination.disabledNext) {
      key.preventDefault();
      key.stopPropagation();
      pagination.onNext();
    }
  });

  return (
    <box flexDirection="column" style={{ gap: 1, padding: 1 }}>
      {title ? (
        <text attributes={TextAttributes.BOLD}>{title}</text>
      ) : undefined}
      {description ? <InlineText dim>{description}</InlineText> : undefined}

      {errors}
      {before}
      {children}
      {after}

      <box flexDirection="column" style={{ gap: 1, marginTop: 1 }}>
        {pagination ? (
          <PaginationControls pagination={pagination} />
        ) : undefined}

        <box flexDirection="row" style={{ gap: 2 }}>
          {onSubmit ? (
            <ActionButton id={submitId} label="Submit" onClick={onSubmit} />
          ) : undefined}
          {onCancel ? (
            <ActionButton id={cancelId} label="Reset" onClick={onCancel} />
          ) : undefined}
        </box>

        <text attributes={TextAttributes.DIM}>
          Tab/Shift+Tab navigate • Ctrl+S submit • Ctrl+R reset
          {pagination ? " • Ctrl+P/Ctrl+N page" : ""}
        </text>
      </box>
    </box>
  );
}
