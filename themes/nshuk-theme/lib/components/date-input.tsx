import type { DateInputProperties } from "@aidbox-forms/theme";
import type { ChangeEvent, RefObject } from "react";
import { useEffect, useRef } from "react";

import { hasErrorId } from "../utils/aria.ts";

type DateParts = {
  day: string;
  month: string;
  year: string;
};

function parseDateParts(value: string): DateParts {
  const trimmed = value.trim();
  const match = /^([0-9]{4})(?:-([0-9]{2})(?:-([0-9]{2}))?)?$/.exec(trimmed);
  if (!match) {
    return { day: "", month: "", year: "" };
  }
  return {
    year: match[1] ?? "",
    month: match[2] ?? "",
    day: match[3] ?? "",
  };
}

function clampDigits(value: string, length: number): string {
  return value.replaceAll(/\D/g, "").slice(0, length);
}

function getInputValue(reference: RefObject<HTMLInputElement | null>): string {
  return reference.current?.value ?? "";
}

export function DateInput({
  id,
  value,
  onChange,
  disabled,
  ariaLabelledBy,
  ariaDescribedBy,
}: DateInputProperties) {
  const dayReference = useRef<HTMLInputElement | null>(null);
  const monthReference = useRef<HTMLInputElement | null>(null);
  const yearReference = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const next = parseDateParts(value);

    const applyValue = (
      reference: RefObject<HTMLInputElement | null>,
      nextValue: string,
    ) => {
      const element = reference.current;
      if (!element) {
        return;
      }
      if (element.value !== nextValue) {
        element.value = nextValue;
      }
    };

    applyValue(dayReference, next.day);
    applyValue(monthReference, next.month);
    applyValue(yearReference, next.year);
  }, [value]);

  const describedBy =
    ariaDescribedBy && ariaDescribedBy.trim().length > 0
      ? ariaDescribedBy
      : undefined;
  const hasError = hasErrorId(describedBy);
  const inputClassName = hasError
    ? "nhsuk-input nhsuk-date-input__input nhsuk-input--error"
    : "nhsuk-input nhsuk-date-input__input";

  const commitIfComplete = (next: DateParts) => {
    if (next.day === "" && next.month === "" && next.year === "") {
      onChange("");
      return;
    }

    if (
      next.day.length === 2 &&
      next.month.length === 2 &&
      next.year.length === 4
    ) {
      onChange(`${next.year}-${next.month}-${next.day}`);
    }
  };

  const handleDayChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextDay = clampDigits(event.target.value, 2);
    if (event.target.value !== nextDay) {
      event.target.value = nextDay;
    }
    commitIfComplete({
      day: nextDay,
      month: getInputValue(monthReference),
      year: getInputValue(yearReference),
    });
  };

  const handleMonthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextMonth = clampDigits(event.target.value, 2);
    if (event.target.value !== nextMonth) {
      event.target.value = nextMonth;
    }
    commitIfComplete({
      day: getInputValue(dayReference),
      month: nextMonth,
      year: getInputValue(yearReference),
    });
  };

  const handleYearChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextYear = clampDigits(event.target.value, 4);
    if (event.target.value !== nextYear) {
      event.target.value = nextYear;
    }
    commitIfComplete({
      day: getInputValue(dayReference),
      month: getInputValue(monthReference),
      year: nextYear,
    });
  };

  const initialParts = parseDateParts(value);

  return (
    <div
      className="nhsuk-date-input"
      role="group"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={describedBy}
    >
      <div className="nhsuk-date-input__item">
        <div className="nhsuk-form-group">
          <label className="nhsuk-label nhsuk-date-input__label" htmlFor={id}>
            Day
          </label>
          <input
            ref={dayReference}
            className={`${inputClassName} nhsuk-input--width-2`}
            id={id}
            name={`${id}[day]`}
            type="text"
            inputMode="numeric"
            autoComplete="bday-day"
            defaultValue={initialParts.day}
            disabled={disabled}
            onChange={handleDayChange}
          />
        </div>
      </div>

      <div className="nhsuk-date-input__item">
        <div className="nhsuk-form-group">
          <label
            className="nhsuk-label nhsuk-date-input__label"
            htmlFor={`${id}-month`}
          >
            Month
          </label>
          <input
            ref={monthReference}
            className={`${inputClassName} nhsuk-input--width-2`}
            id={`${id}-month`}
            name={`${id}[month]`}
            type="text"
            inputMode="numeric"
            autoComplete="bday-month"
            defaultValue={initialParts.month}
            disabled={disabled}
            onChange={handleMonthChange}
          />
        </div>
      </div>

      <div className="nhsuk-date-input__item">
        <div className="nhsuk-form-group">
          <label
            className="nhsuk-label nhsuk-date-input__label"
            htmlFor={`${id}-year`}
          >
            Year
          </label>
          <input
            ref={yearReference}
            className={`${inputClassName} nhsuk-input--width-4`}
            id={`${id}-year`}
            name={`${id}[year]`}
            type="text"
            inputMode="numeric"
            autoComplete="bday-year"
            defaultValue={initialParts.year}
            disabled={disabled}
            onChange={handleYearChange}
          />
        </div>
      </div>
    </div>
  );
}
