import { styled } from "@linaria/react";
import type { FileInputProps } from "@aidbox-forms/theme";
import { type ChangeEvent, useRef } from "react";

export function FileInput({
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
  accept,
  value,
  onChange,
}: FileInputProps) {
  const displayLabel = value?.title ?? value?.url ?? "Attachment selected";
  const displaySizeLabel =
    value?.size != null ? `${Math.round(value.size / 1024)} KB` : undefined;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickFile = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      onChange?.(file);
    } finally {
      event.currentTarget.value = "";
    }
  };

  return (
    <Container>
      <HiddenInput
        ref={fileInputRef}
        id={id}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className="nhsuk-file-upload"
        disabled={disabled}
        type="file"
        onChange={handleFileChange}
        accept={accept}
      />
      {value != null ? (
        <Details
          role="group"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          <LabelText className="nhsuk-body">{displayLabel}</LabelText>
          {displaySizeLabel ? (
            <HintText className="nhsuk-hint">{displaySizeLabel}</HintText>
          ) : null}
          <Actions>
            {!disabled ? (
              <button
                className="nhsuk-button nhsuk-button--secondary"
                type="button"
                onClick={handlePickFile}
              >
                Change file
              </button>
            ) : null}
            <button
              className="nhsuk-button nhsuk-button--secondary"
              type="button"
              onClick={() => onChange?.(null)}
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

const LabelText = styled.div``;

const HintText = styled.div``;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
