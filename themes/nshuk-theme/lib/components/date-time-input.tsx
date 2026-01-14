import type { DateTimeInputProperties } from "@aidbox-forms/theme";
import type { ChangeEvent, RefObject } from "react";
import { useEffect, useRef } from "react";

import { hasErrorId } from "../utils/aria.ts";

type DateTimeParts = {
  day: string;
  month: string;
  year: string;
  time: string;
};

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

function parseTimePart(value: string): string {
  const trimmed = value.trim();
  const match = /^([0-9]{2}):([0-9]{2})/.exec(trimmed);
  if (!match) {
    return "";
  }

  const hours = match[1] ?? "";
  const minutes = match[2] ?? "";

  return `${hours}:${minutes}`;
}

function parseDateTimeParts(value: string): DateTimeParts {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { day: "", month: "", year: "", time: "" };
  }

  const [datePart, timePart] = trimmed.split("T", 2);
  const dateParts = parseDateParts(datePart ?? "");

  return {
    ...dateParts,
    time: timePart ? parseTimePart(timePart) : "",
  };
}

function clampDigits(value: string, length: number): string {
  return value.replaceAll(/\D/g, "").slice(0, length);
}

function getInputValue(reference: RefObject<HTMLInputElement | null>): string {
  return reference.current?.value ?? "";
}

function isCompleteTimeValue(value: string): boolean {
  return /^\d{2}:\d{2}$/.test(value);
}

export function DateTimeInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  ariaLabelledBy,
  ariaDescribedBy,
}: DateTimeInputProperties) {
  const dayReference = useRef<HTMLInputElement | null>(null);
  const monthReference = useRef<HTMLInputElement | null>(null);
  const yearReference = useRef<HTMLInputElement | null>(null);
  const timeReference = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const next = parseDateTimeParts(value);

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
    applyValue(timeReference, next.time);
  }, [value]);

  const describedBy =
    ariaDescribedBy && ariaDescribedBy.trim().length > 0
      ? ariaDescribedBy
      : undefined;
  const hasError = hasErrorId(describedBy);

  const dateInputClassName = hasError
    ? "nhsuk-input nhsuk-date-input__input nhsuk-input--error"
    : "nhsuk-input nhsuk-date-input__input";

  const timeInputClassName = hasError
    ? "nhsuk-input nhsuk-input--error"
    : "nhsuk-input";

  const commitIfComplete = (next: DateTimeParts) => {
    const isDateEmpty =
      next.day === "" && next.month === "" && next.year === "";
    const isTimeEmpty = next.time === "";

    if (isDateEmpty && isTimeEmpty) {
      onChange("");
      return;
    }

    if (
      next.day.length === 2 &&
      next.month.length === 2 &&
      next.year.length === 4 &&
      isCompleteTimeValue(next.time)
    ) {
      onChange(`${next.year}-${next.month}-${next.day}T${next.time}`);
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
      time: getInputValue(timeReference),
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
      time: getInputValue(timeReference),
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
      time: getInputValue(timeReference),
    });
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    commitIfComplete({
      day: getInputValue(dayReference),
      month: getInputValue(monthReference),
      year: getInputValue(yearReference),
      time: event.target.value,
    });
  };

  const initialParts = parseDateTimeParts(value);

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
            className={`${dateInputClassName} nhsuk-input--width-2`}
            id={id}
            name={`${id}[day]`}
            type="text"
            inputMode="numeric"
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
            className={`${dateInputClassName} nhsuk-input--width-2`}
            id={`${id}-month`}
            name={`${id}[month]`}
            type="text"
            inputMode="numeric"
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
            className={`${dateInputClassName} nhsuk-input--width-4`}
            id={`${id}-year`}
            name={`${id}[year]`}
            type="text"
            inputMode="numeric"
            defaultValue={initialParts.year}
            disabled={disabled}
            onChange={handleYearChange}
          />
        </div>
      </div>

      <div className="nhsuk-date-input__item">
        <div className="nhsuk-form-group">
          <label
            className="nhsuk-label nhsuk-date-input__label"
            htmlFor={`${id}-time`}
          >
            Time
          </label>
          <input
            ref={timeReference}
            id={`${id}-time`}
            className={`${timeInputClassName} nhsuk-date-input__input nhsuk-input--width-6`}
            type="time"
            name={`${id}[time]`}
            defaultValue={initialParts.time}
            disabled={disabled}
            placeholder={placeholder}
            onChange={handleTimeChange}
          />
        </div>
      </div>
    </div>
  );
}
