import { styled } from "@linaria/react";
import type { MultiSelectInputProps } from "@aidbox-forms/theme";
import { optionStatusClass } from "./option-status.ts";
import { inputClass } from "./tokens.ts";

export function MultiSelectInput({
  options,
  token = "",
  onChange,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled = false,
  isLoading = false,
  showOptions = true,
  chips,
  actions,
  dialog,
  placeholder,
}: MultiSelectInputProps) {
  const handleSelectChange = (token: string) => {
    if (!token) return;
    onChange(token);
  };

  const renderOptions = () => {
    if (!showOptions) return null;

    return (
      <FieldRow>
        <select
          id={ariaLabelledBy ? `${ariaLabelledBy}-multi-select` : undefined}
          className={inputClass}
          value={token}
          onChange={(event) => handleSelectChange(event.target.value)}
          disabled={disabled || isLoading}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-busy={isLoading || undefined}
        >
          <option value="">{placeholder ?? "Select an option"}</option>
          {options.map((entry) => (
            <option
              key={entry.token}
              value={entry.token}
              disabled={entry.disabled}
            >
              {entry.label}
            </option>
          ))}
        </select>
      </FieldRow>
    );
  };

  return (
    <Stack>
      {dialog && dialog.open ? (
        <Overlay role="dialog" aria-modal="true">
          <Dialog>
            <DialogTitle>{dialog.title}</DialogTitle>
            <div>{dialog.content}</div>
            {dialog.actions}
          </Dialog>
        </Overlay>
      ) : null}
      <ChipList>
        {chips.map((chip) => (
          <ChipColumn key={chip.token}>
            <Chip>
              <ChipContent>{chip.content}</ChipContent>
              {chip.onRemove ? (
                <ChipButton
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={chip.removeLabel ?? "Remove"}
                  disabled={disabled || chip.removeDisabled}
                >
                  Remove
                </ChipButton>
              ) : null}
            </Chip>
            {chip.errors}
          </ChipColumn>
        ))}
      </ChipList>
      {isLoading ? (
        <div className={optionStatusClass} role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
      <ActionsRow>
        {renderOptions()}
        {actions}
      </ActionsRow>
    </Stack>
  );
}

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: flex-start;
`;

const ChipColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 9999px;
  background: #f7fafc;
`;

const ChipContent = styled.div`
  display: inline-flex;
  align-items: center;
`;

const ChipButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #4a5568;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background: #fff;
  color: #1a202c;
  padding: 1rem;
  border-radius: 0.5rem;
  min-width: min(90vw, 420px);
  max-height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DialogTitle = styled.div`
  font-weight: 600;
`;
