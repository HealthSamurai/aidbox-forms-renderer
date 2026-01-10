import type { FileInputProperties } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";
import {
  type ChangeEvent,
  type MouseEvent,
  type KeyboardEvent,
  useRef,
} from "react";

export function FileInput({
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  accept,
  value,
  onChange,
}: FileInputProperties) {
  const isEmpty = value == undefined;
  const hasValue = value != undefined;
  const displayLabel =
    value?.title ??
    value?.url ??
    (isEmpty ? "Choose file" : "Attachment selected");
  const displaySizeLabel =
    value?.size == undefined ? "" : `${Math.round(value.size / 1024)} KB`;
  const fileInputReference = useRef<HTMLInputElement | null>(null);

  const handlePickFile = () => {
    if (disabled) return;
    fileInputReference.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file === undefined) return;
    try {
      onChange?.(file);
    } finally {
      event.currentTarget.value = "";
    }
  };

  const handleSummaryClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    handlePickFile();
  };

  const handleSummaryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePickFile();
    }
  };

  return (
    <Summary
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled ? "true" : undefined}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      onClick={handleSummaryClick}
      onKeyDown={handleSummaryKeyDown}
    >
      <HiddenInput
        ref={fileInputReference}
        id={id}
        type="file"
        onChange={handleFileChange}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        accept={accept}
      />
      <Label data-empty={isEmpty ? "true" : undefined}>
        {displayLabel}
        {displaySizeLabel ? ` (${displaySizeLabel})` : ""}
      </Label>
      {hasValue && (
        <ClearButton
          type="button"
          onClick={() => onChange?.()}
          disabled={disabled}
          aria-label="Clear attachment"
        >
          ×
        </ClearButton>
      )}
    </Summary>
  );
}

const HiddenInput = styled.input`
  display: none;
`;

const Summary = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  padding-right: 2.25rem;
  min-width: 0;

  &:focus-within {
    border-color: #3182ce;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.35);
  }

  &:focus,
  &:focus-visible {
    border-color: #3182ce;
    box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.35);
    outline: none;
  }

  &[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Label = styled.span`
  display: block;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &[data-empty="true"] {
    color: #a0aec0;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  color: #4a5568;
  font-size: 1.25rem;
  cursor: pointer;
  flex-shrink: 0;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
