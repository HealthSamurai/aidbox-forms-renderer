import type { MultiSelectFieldProps } from "@aidbox-forms/theme";
import { useState } from "react";

export function MultiSelectField({
  mode,
  options,
  selectValue = "",
  onSelectOption,
  searchValue = "",
  onSearchValueChange,
  labelId,
  describedById,
  readOnly = false,
  isLoading = false,
  showOptions = true,
  chips,
  actions,
  dialog,
  selectPlaceholder,
  searchPlaceholder,
}: MultiSelectFieldProps) {
  const [lookupOpen, setLookupOpen] = useState(false);

  const handleSelectChange = (key: string) => {
    if (!key) return;
    onSelectOption(key);
  };

  const renderOptionList = () => {
    if (!showOptions) return null;

    if (mode === "select") {
      return (
        <select
          id={labelId ? `${labelId}-multi-select` : undefined}
          className="nhsuk-select"
          value={selectValue}
          onChange={(event) => handleSelectChange(event.target.value)}
          disabled={readOnly || isLoading}
          aria-labelledby={labelId}
          aria-describedby={describedById}
        >
          <option value="">{selectPlaceholder ?? "Select an option"}</option>
          {options.map((entry) => (
            <option key={entry.key} value={entry.key} disabled={entry.disabled}>
              {entry.label}
            </option>
          ))}
        </select>
      );
    }

    const list = (
      <ul className="nhsuk-list nhsuk-list--border" aria-label="Options">
        {options.map((entry) => (
          <li key={entry.key}>
            <button
              type="button"
              className="nhsuk-link"
              onClick={() => handleSelectChange(entry.key)}
              disabled={readOnly || isLoading || entry.disabled}
            >
              {entry.label}
            </button>
          </li>
        ))}
      </ul>
    );

    const search = (
      <div className="nhsuk-form-group">
        <input
          id={labelId ? `${labelId}-${mode}-search` : undefined}
          className="nhsuk-input"
          type="search"
          value={searchValue}
          onChange={(event) => onSearchValueChange?.(event.target.value)}
          aria-labelledby={labelId}
          aria-describedby={describedById}
          disabled={readOnly || isLoading}
          placeholder={
            searchPlaceholder ??
            (mode === "lookup" ? "Search directory" : "Type to search")
          }
        />
      </div>
    );

    if (mode === "lookup") {
      return (
        <>
          <button
            type="button"
            className="nhsuk-button nhsuk-button--secondary"
            onClick={() => setLookupOpen(true)}
            disabled={readOnly}
          >
            Open lookup
          </button>
          {lookupOpen ? (
            <div
              role="dialog"
              aria-modal="true"
              className="nhsuk-u-padding-4 nhsuk-u-margin-top-3 nhsuk-u-bg-white"
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                borderRadius: "4px",
              }}
            >
              <h3 className="nhsuk-heading-s nhsuk-u-margin-bottom-3">
                Lookup options
              </h3>
              {search}
              {list}
              <button
                type="button"
                className="nhsuk-button nhsuk-button--secondary"
                onClick={() => setLookupOpen(false)}
              >
                Close
              </button>
            </div>
          ) : null}
        </>
      );
    }

    return (
      <>
        {search}
        {list}
      </>
    );
  };

  return (
    <div className="nhsuk-form-group" aria-busy={isLoading || undefined}>
      {dialog && dialog.open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="nhsuk-u-padding-4 nhsuk-u-margin-bottom-3 nhsuk-u-bg-white"
          style={{
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
          }}
        >
          <h3 className="nhsuk-heading-s nhsuk-u-margin-bottom-3">
            {dialog.title}
          </h3>
          <div className="nhsuk-u-margin-bottom-3">{dialog.content}</div>
          {dialog.actions}
        </div>
      ) : null}
      {chips.length > 0 ? (
        <div className="nhsuk-u-margin-bottom-3">
          {chips.map((chip) => (
            <div
              key={chip.key}
              className="nhsuk-u-margin-bottom-2"
              style={{
                border: "1px solid #d8dde0",
                borderRadius: "9999px",
                padding: "0.25rem 0.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginRight: "0.5rem",
              }}
            >
              {chip.content}
              {chip.onRemove ? (
                <button
                  type="button"
                  className="nhsuk-link"
                  onClick={chip.onRemove}
                  aria-label={chip.removeLabel ?? "Remove"}
                  disabled={readOnly || chip.removeDisabled}
                >
                  Remove
                </button>
              ) : null}
              {chip.errors}
            </div>
          ))}
        </div>
      ) : null}
      {isLoading ? (
        <div className="nhsuk-hint" role="status" aria-live="polite">
          Loading options…
        </div>
      ) : null}
      <div className="nhsuk-u-margin-bottom-3">{renderOptionList()}</div>
      {actions}
    </div>
  );
}
