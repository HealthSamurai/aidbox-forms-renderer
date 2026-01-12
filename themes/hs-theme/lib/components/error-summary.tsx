import type { ErrorSummaryProperties } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";
import { useEffect, useRef } from "react";

export function ErrorSummary({
  id,
  title = "There is a problem",
  description,
  items,
}: ErrorSummaryProperties) {
  const focusReference = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    focusReference.current?.focus();
  }, [items.length]);

  if (items.length === 0) return;

  return (
    <Summary id={id} role="alert" tabIndex={-1} ref={focusReference}>
      <Title>{title}</Title>
      {description ? <Description>{description}</Description> : undefined}
      <List>
        {items.map((item, index) => {
          const key = `${item.href ?? ""}::${item.message}::${index}`;
          return (
            <li key={key}>
              {item.href ? (
                <a href={item.href}>{item.message}</a>
              ) : (
                item.message
              )}
            </li>
          );
        })}
      </List>
    </Summary>
  );
}

const Summary = styled.div`
  border: 1px solid #c53030;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #fff5f5;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:focus {
    outline: 2px solid #c53030;
    outline-offset: 2px;
  }

  & a {
    color: inherit;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a202c;
`;

const Description = styled.p`
  margin: 0;
  color: #4a5568;
  font-size: 0.95rem;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;
