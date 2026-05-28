import { useCallback, useMemo } from "react";
import type { Attachment as ThemeAttachment, NodePath } from "@formbox/theme";

import type { Attachment } from "@formbox/fhir";
import {
  parseNumber,
  prepareAttachmentFromFile,
} from "../../../../utilities.ts";
import { useTheme } from "../../../../ui/theme.tsx";
import type { IFhirAdapter } from "../../../../types.ts";

export type AttachmentInputProperties = {
  value: Attachment | undefined;
  adapter: IFhirAdapter;
  onChange: (value?: Attachment) => void;
  id: string;
  path?: NodePath | undefined;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  accept?: string | undefined;
};

export function AttachmentInput({
  value,
  adapter,
  onChange,
  id,
  path,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  accept,
}: AttachmentInputProperties) {
  const { FileInput: ThemedFileInput } = useTheme();

  const handleFileChange = useCallback(
    async (file: File | undefined) => {
      if (file) {
        onChange(await prepareAttachmentFromFile(file, adapter));
      } else {
        onChange();
      }
    },
    [adapter, onChange],
  );

  const themeValue = useMemo<ThemeAttachment | undefined>(() => {
    return (
      value && {
        ...value,
        size: parseNumber(adapter.attachment.getSize(value)),
      }
    );
  }, [adapter, value]);

  return (
    <ThemedFileInput
      id={id}
      path={path}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      disabled={disabled}
      accept={accept}
      value={themeValue}
      onChange={(file) => {
        void handleFileChange(file);
      }}
    />
  );
}
