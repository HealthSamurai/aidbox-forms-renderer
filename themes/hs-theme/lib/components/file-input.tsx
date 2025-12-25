import type { FileInputProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";
import { useRef, type ChangeEvent } from "react";

export function FileInput({
  inputId,
  labelId,
  describedById,
  disabled,
  filename,
  sizeLabel,
  onFileSelect,
  onClear,
}: FileInputProps) {
  const hasAttachment = Boolean(filename);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickFile = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      onFileSelect?.(file);
    } finally {
      event.currentTarget.value = "";
    }
  };

  return (
    <Wrapper>
      <HiddenInput
        ref={fileInputRef}
        id={inputId}
        type="file"
        onChange={handleFileChange}
        aria-labelledby={labelId}
        aria-describedby={describedById}
        disabled={disabled}
      />
      {hasAttachment ? (
        <Summary
          role="group"
          aria-labelledby={labelId}
          aria-describedby={describedById}
        >
          <Label>
            {filename}
            {sizeLabel ? ` (${sizeLabel})` : ""}
          </Label>
          {!disabled ? (
            <Action type="button" onClick={handlePickFile}>
              Change file
            </Action>
          ) : null}
          <Action type="button" onClick={onClear} disabled={disabled}>
            Clear attachment
          </Action>
        </Summary>
      ) : (
        <Action type="button" onClick={handlePickFile} disabled={disabled}>
          Choose file
        </Action>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Summary = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Label = styled.span`
  font-weight: 600;
`;

const Action = styled.button`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  padding: 0.35rem 0.75rem;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
