import type { AttachmentInputProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";
import classNames from "classnames";

export function AttachmentInput({
  inputId,
  labelId,
  describedById,
  disabled,
  filename,
  sizeLabel,
  onPickFile,
  onClear,
}: AttachmentInputProps) {
  const hasAttachment = Boolean(filename);

  return (
    <Wrapper>
      <HiddenInput
        id={inputId}
        aria-labelledby={labelId}
        aria-describedby={describedById}
        className={classNames({
          "af-attachment-input": true,
          "af-attachment-input--hidden": hasAttachment,
        })}
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
            <Action type="button" onClick={onPickFile}>
              Change file
            </Action>
          ) : null}
          <Action type="button" onClick={onClear} disabled={disabled}>
            Clear attachment
          </Action>
        </Summary>
      ) : (
        <Action type="button" onClick={onPickFile} disabled={disabled}>
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
