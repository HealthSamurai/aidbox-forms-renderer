import { styled } from "@linaria/react";
import type { PageNavigationProps } from "@aidbox-forms/theme";

const NavButton = styled.button`
  cursor: pointer;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  background: #edf2f7;
  color: #1a202c;
  border-color: #cbd5e0;
`;

export function PageNavigation({
  current,
  total,
  onPrev,
  onNext,
  disabledPrev,
  disabledNext,
}: PageNavigationProps) {
  return (
    <Nav>
      <NavButton type="button" onClick={onPrev} disabled={disabledPrev}>
        Previous
      </NavButton>
      <span>
        {current} / {total}
      </span>
      <NavButton type="button" onClick={onNext} disabled={disabledNext}>
        Next
      </NavButton>
    </Nav>
  );
}

const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
