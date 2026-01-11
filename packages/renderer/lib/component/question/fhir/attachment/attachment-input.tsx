import type { Attachment } from "fhir/r5";
import type { Attachment as ThemeAttachment } from "@aidbox-forms/theme";
import { useCallback, useMemo } from "react";
import { prepareAttachmentFromFile } from "../../../../utilities.ts";
import { useTheme } from "../../../../ui/theme.tsx";

export type AttachmentInputProperties = {
  value: Attachment | undefined;
  onChange: (value?: Attachment) => void;
  id: string;
  ariaLabelledBy: string;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
  accept?: string | undefined;
};

export function AttachmentInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  accept,
}: AttachmentInputProperties) {
  const { FileInput: ThemedFileInput } = useTheme();

  const handleFileChange = useCallback(
    async (file: File | undefined) => {
      if (file) {
        onChange(await prepareAttachmentFromFile(file));
      } else {
        onChange();
      }
    },
    [onChange],
  );

  const themeValue = useMemo<ThemeAttachment | undefined>(() => {
    return (
      value && {
        ...value,
        size: Number(value.size),
      }
    );
  }, [value]);

  return (
    <ThemedFileInput
      id={id}
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
