import { styled } from "@linaria/react";
import type { PageNavigationProps } from "@aidbox-forms/theme";
import { Button } from "./button.tsx";

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
      <Button
        type="button"
        variant="secondary"
        onClick={onPrev}
        disabled={disabledPrev}
      >
        Previous
      </Button>
      <span>
        {current} / {total}
      </span>
      <Button
        type="button"
        variant="secondary"
        onClick={onNext}
        disabled={disabledNext}
      >
        Next
      </Button>
    </Nav>
  );
}

const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
