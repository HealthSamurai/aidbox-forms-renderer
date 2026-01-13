import type { FormEvent } from "react";
import type { FormProperties } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function Form({
  onSubmit,
  onCancel,
  children,
  title,
  description,
  errors,
  before,
  after,
  pagination,
}: FormProperties) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };
  const handleCancel = onCancel ?? (() => {});
  const actions = (
    <>
      <ActionButton variant="primary" type="submit" disabled={!onSubmit}>
        Submit
      </ActionButton>
      <ActionButton
        variant="secondary"
        type="button"
        onClick={handleCancel}
        disabled={!onCancel}
      >
        Cancel
      </ActionButton>
    </>
  );
  const header =
    title || description ? (
      <header className="nhsuk-u-margin-bottom-4">
        {Boolean(title) && (
          <h1 className="nhsuk-heading-l nhsuk-u-margin-bottom-1">{title}</h1>
        )}
        {Boolean(description) && (
          <span className="nhsuk-caption-l">{description}</span>
        )}
      </header>
    ) : undefined;

  if (pagination) {
    const paginationItems = getPaginationItems(
      pagination.current,
      pagination.total,
    );

    const goToPage = (page: number) => {
      if (page === pagination.current) {
        return;
      }

      const steps = Math.abs(page - pagination.current);
      const move =
        page < pagination.current ? pagination.onPrev : pagination.onNext;

      for (let index = 0; index < steps; index += 1) {
        move();
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        {header && <TitleSlot>{header}</TitleSlot>}
        {Boolean(errors) && <Slot>{errors}</Slot>}
        {Boolean(before) && <Slot>{before}</Slot>}
        {children}
        <nav
          className="nhsuk-pagination nhsuk-pagination--numbered"
          role="navigation"
          aria-label="Pagination"
        >
          {pagination.disabledPrev ? undefined : (
            <a
              href="#"
              className="nhsuk-pagination__previous"
              rel="prev"
              onClick={(event) => {
                event.preventDefault();
                pagination.onPrev();
              }}
            >
              <ArrowLeftIcon />
              <span className="nhsuk-pagination__title">
                Previous<span className="nhsuk-u-visually-hidden"> page</span>
              </span>
            </a>
          )}

          <ul className="nhsuk-pagination__list">
            {paginationItems.map((item, index) => {
              if (item.type === "ellipsis") {
                return (
                  <li
                    key={`ellipsis-${index}`}
                    className="nhsuk-pagination__item nhsuk-pagination__item--ellipsis"
                  >
                    {"\u22EF"}
                  </li>
                );
              }

              const itemClassName = item.current
                ? "nhsuk-pagination__item nhsuk-pagination__item--current"
                : "nhsuk-pagination__item";

              return (
                <li key={item.page} className={itemClassName}>
                  <a
                    className="nhsuk-pagination__link"
                    href="#"
                    aria-label={`Page ${item.page}`}
                    aria-current={item.current ? "page" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(item.page);
                    }}
                  >
                    {item.page}
                  </a>
                </li>
              );
            })}
          </ul>

          {pagination.disabledNext ? undefined : (
            <a
              href="#"
              className="nhsuk-pagination__next"
              rel="next"
              onClick={(event) => {
                event.preventDefault();
                pagination.onNext();
              }}
            >
              <span className="nhsuk-pagination__title">
                Next<span className="nhsuk-u-visually-hidden"> page</span>
              </span>
              <ArrowRightIcon />
            </a>
          )}
        </nav>
        <div className="nhsuk-button-group">{actions}</div>
        {Boolean(after) && <Slot>{after}</Slot>}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {header}
      {errors}
      {before}
      {children}
      {after}
      <div className="nhsuk-button-group">{actions}</div>
    </form>
  );
}

type PaginationItem =
  | { type: "page"; page: number; current: boolean }
  | { type: "ellipsis" };

function getPaginationItems(current: number, total: number): PaginationItem[] {
  const pageSet = new Set<number>([1, total]);

  for (const offset of [-2, -1, 0, 1, 2]) {
    const page = current + offset;
    if (page >= 1 && page <= total) {
      pageSet.add(page);
    }
  }

  const pages = [...pageSet].toSorted((a, b) => a - b);
  const items: PaginationItem[] = [];

  pages.forEach((page, index) => {
    const previousPage = pages[index - 1];
    if (previousPage != undefined && page - previousPage > 1) {
      items.push({ type: "ellipsis" });
    }

    items.push({ type: "page", page, current: page === current });
  });

  return items;
}

function ArrowLeftIcon() {
  return (
    <svg
      className="nhsuk-icon nhsuk-icon--arrow-left"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      focusable="false"
      aria-hidden="true"
    >
      <path d="M10.7 6.3c.4.4.4 1 0 1.4L7.4 11H19a1 1 0 0 1 0 2H7.4l3.3 3.3c.4.4.4 1 0 1.4a1 1 0 0 1-1.4 0l-5-5A1 1 0 0 1 4 12c0-.3.1-.5.3-.7l5-5a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className="nhsuk-icon nhsuk-icon--arrow-right"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      focusable="false"
      aria-hidden="true"
    >
      <path d="m14.7 6.3 5 5c.2.2.3.4.3.7 0 .3-.1.5-.3.7l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3H5a1 1 0 0 1 0-2h11.6l-3.3-3.3a1 1 0 1 1 1.4-1.4Z" />
    </svg>
  );
}

function ActionButton({
  variant,
  type = "button",
  onClick,
  disabled,
  children,
}: {
  variant: "primary" | "secondary";
  type?: "button" | "submit" | undefined;
  onClick?: (() => void) | undefined;
  disabled?: boolean | undefined;
  children: string;
}) {
  const className =
    variant === "primary"
      ? "nhsuk-button"
      : "nhsuk-button nhsuk-button--secondary";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}

const TitleSlot = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--nhsuk-spacing-1) + var(--nhsuk-spacing-2));
`;

const Slot = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--nhsuk-spacing-3);

  &:empty {
    display: none;
  }
`;
