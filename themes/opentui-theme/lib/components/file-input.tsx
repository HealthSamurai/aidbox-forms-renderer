import type { FileInputProperties } from "@aidbox-forms/theme";
import { InlineText } from "./utilities.tsx";

export function FileInput({ value }: FileInputProperties) {
  if (!value) {
    return (
      <InlineText dim>
        No file selected (attachments unsupported in TUI)
      </InlineText>
    );
  }

  return (
    <box flexDirection="column" style={{ gap: 0 }}>
      <InlineText>
        Attachment: {value.title ?? value.url ?? "(untitled)"}
      </InlineText>
      {value.contentType ? (
        <InlineText dim>{value.contentType}</InlineText>
      ) : undefined}
      {typeof value.size === "number" ? (
        <InlineText dim>{value.size} bytes</InlineText>
      ) : undefined}
      {value.url ? <InlineText dim>{value.url}</InlineText> : undefined}
      <InlineText dim>Attachment upload is TBD for TUI.</InlineText>
    </box>
  );
}
