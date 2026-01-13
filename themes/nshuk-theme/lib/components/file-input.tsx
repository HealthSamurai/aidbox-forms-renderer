import type { FileInputProperties } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";
import { type ChangeEvent, type KeyboardEvent, useRef } from "react";

import { hasErrorId } from "../utils/aria.ts";

export function FileInput({
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  accept,
  value,
  onChange,
}: FileInputProperties) {
  const hasValue = value != undefined;
  const displayLabel =
    value?.title ?? value?.url ?? (hasValue ? "Attachment selected" : "");
  const displaySizeLabel =
    value?.size == undefined ? "" : `${Math.round(value.size / 1024)} KB`;
  const summaryValue = hasValue
    ? `${displayLabel}${displaySizeLabel ? ` (${displaySizeLabel})` : ""}`
    : "";

  const inputClassName = hasErrorId(ariaDescribedBy)
    ? "nhsuk-input nhsuk-input--error"
    : "nhsuk-input";

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

  const handleSummaryKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePickFile();
    }
  };

  return (
    <div className="nhsuk-input-wrapper nhsuk-u-width-full">
      <SummaryInput
        className={inputClassName}
        type="text"
        value={summaryValue}
        placeholder="No file chosen"
        readOnly
        disabled={disabled}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onClick={handlePickFile}
        onKeyDown={handleSummaryKeyDown}
      />
      <HiddenInput
        ref={fileInputReference}
        id={id}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className="nhsuk-file-upload"
        disabled={disabled}
        type="file"
        onChange={handleFileChange}
        accept={accept}
      />
      <button
        className="nhsuk-button nhsuk-button--secondary nhsuk-button--small"
        type="button"
        onClick={handlePickFile}
        disabled={disabled}
      >
        {hasValue ? "Change file" : "Choose file"}
      </button>
      {hasValue && (
        <button
          className="nhsuk-button nhsuk-button--secondary nhsuk-button--small"
          type="button"
          onClick={() => onChange?.()}
          disabled={disabled}
          aria-label="Clear attachment"
        >
          Clear
        </button>
      )}
    </div>
  );
}

const HiddenInput = styled.input`
  display: none;
`;

const SummaryInput = styled.input`
  flex: 1;
  min-width: calc(var(--nhsuk-spacing-9) * 3);
  width: 100%;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;
