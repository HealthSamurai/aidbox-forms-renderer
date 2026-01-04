import type { Attachment } from "fhir/r5";
import type { Attachment as ThemeAttachment } from "@aidbox-forms/theme";
import { useCallback, useMemo } from "react";
import { prepareAttachmentFromFile } from "../../../../../utils.ts";
import { useTheme } from "../../../../../ui/theme.tsx";

export type AttachmentInputProps = {
  value: Attachment | null;
  onChange: (value: Attachment | null) => void;
  id?: string | undefined;
  ariaLabelledBy?: string | undefined;
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
}: AttachmentInputProps) {
  const { FileInput: ThemedFileInput } = useTheme();

  const handleFileChange = useCallback(
    async (file: File | null) => {
      if (file) {
        onChange(await prepareAttachmentFromFile(file));
      } else {
        onChange(null);
      }
    },
    [onChange],
  );

  const inputIdentifier = `${id ?? "attachment"}_/_file`;

  const themeValue = useMemo<ThemeAttachment | null>(() => {
    return (
      value && {
        ...value,
        size: Number(value.size),
      }
    );
  }, [value]);

  return (
    <ThemedFileInput
      id={inputIdentifier}
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
