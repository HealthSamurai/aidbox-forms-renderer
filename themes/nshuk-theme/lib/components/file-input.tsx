import { styled } from "@linaria/react";
import type { FileInputProperties } from "@aidbox-forms/theme";
import { type ChangeEvent, useRef } from "react";

export function FileInput({
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  accept,
  value,
  onChange,
}: FileInputProperties) {
  const displayLabel = value?.title ?? value?.url ?? "Attachment selected";
  const hasValue = value != undefined;
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

  return (
    <Container>
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
      {hasValue ? (
        <Details
          role="group"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          <div className="nhsuk-body">{displayLabel}</div>
          {displaySizeLabel ? (
            <div className="nhsuk-hint">{displaySizeLabel}</div>
          ) : undefined}
          <Actions>
            {disabled ? undefined : (
              <button
                className="nhsuk-button nhsuk-button--secondary"
                type="button"
                onClick={handlePickFile}
              >
                Change file
              </button>
            )}
            <button
              className="nhsuk-button nhsuk-button--secondary"
              type="button"
              onClick={() => onChange?.()}
              disabled={disabled}
            >
              Clear attachment
            </button>
          </Actions>
        </Details>
      ) : (
        <button
          className="nhsuk-button nhsuk-button--secondary"
          type="button"
          onClick={handlePickFile}
          disabled={disabled}
        >
          Choose file
        </button>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
