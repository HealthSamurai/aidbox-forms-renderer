import { styled } from "@linaria/react";
import type { NodeHelpProperties } from "@aidbox-forms/theme";

export function NodeHelp({ id, children, ariaLabel }: NodeHelpProperties) {
  return (
    <Wrapper>
      <HelpButton type="button" aria-describedby={id} aria-label={ariaLabel}>
        ?
      </HelpButton>
      <Tooltip role="tooltip" aria-hidden="true">
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

const HelpButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 100%;
  border: 1px solid #cbd5e0;
  color: #687387;
  font-size: 0.75rem;
  line-height: 1;
  cursor: help;
  background: #fff;
  position: relative;

  &:hover {
    background: #e2e8f0;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid #3182ce;
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
  max-width: 32rem;
  background: #1a202c;
  color: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25;
  box-shadow:
    0 10px 15px -3px rgba(15, 23, 42, 0.3),
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
