import { styled } from "@linaria/react";
import type { PageStatusProps } from "@aidbox-forms/theme";

export function PageStatus({ current, total }: PageStatusProps) {
  return (
    <Status role="status" aria-live="polite">
      Page {current} of {total}
    </Status>
  );
}

const Status = styled.div`
  font-size: 0.95rem;
  color: #4a5568;
`;
