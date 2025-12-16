import { styled } from "@linaria/react";
import type { PageNavigationProps } from "@aidbox-forms/theme";
import { Button } from "./button.tsx";

export function PageNavigation({
  current,
  total,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}: PageNavigationProps) {
  return (
    <Nav>
      <Button
        type="button"
        variant="secondary"
        onClick={onPrev}
        disabled={disablePrev}
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
        disabled={disableNext}
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
