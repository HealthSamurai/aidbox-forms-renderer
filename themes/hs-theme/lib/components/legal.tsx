import { styled } from "@linaria/react";
import type { LegalProperties } from "@formbox/theme";

export function Legal({ id, children, ariaLabel }: LegalProperties) {
  return (
    <Wrapper>
      <LegalButton type="button" aria-describedby={id} aria-label={ariaLabel}>
        §
      </LegalButton>
      <Tooltip role="dialog" aria-hidden="true">
        {children}
      </Tooltip>
      <SrOnly id={id}>{children}</SrOnly>
    </Wrapper>
  );
}

const Wrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const LegalButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.375rem;
  border: 1px solid #c05621;
  background: #fffaf0;
  color: #c05621;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: #fbd38d;
  }

  &:focus-visible {
    outline: 2px solid #dd6b20;
    outline-offset: 2px;
  }

  &:focus-visible + div,
  &:hover + div {
    opacity: 1;
    pointer-events: auto;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -110%);
  background: #744210;
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  max-width: 36rem;
  font-size: 0.85rem;
  line-height: 1.4;
  box-shadow:
    0 10px 15px -3px rgba(15, 23, 42, 0.25),
    0 4px 6px -4px rgba(15, 23, 42, 0.2);
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
  z-index: 10;
`;

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
