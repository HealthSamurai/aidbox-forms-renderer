import { styled } from "@linaria/react";

export type LoadingSpinnerProperties = {
  label?: string | undefined;
  showLabel?: boolean | undefined;
  size?: "sm" | "md" | undefined;
};

export function LoadingSpinner({
  label = "Loading options...",
  showLabel = false,
  size = "sm",
}: LoadingSpinnerProperties) {
  return (
    <Wrapper role="status" aria-live="polite">
      <Icon aria-hidden="true" data-size={size} />
      {showLabel ? (
        <Text>{label}</Text>
      ) : (
        <span className="nhsuk-u-visually-hidden">{label}</span>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: calc(var(--nhsuk-spacing-1) + var(--nhsuk-border-width-form-element));
`;

const Icon = styled.span`
  width: calc(var(--nhsuk-spacing-1) + var(--nhsuk-spacing-2));
  height: calc(var(--nhsuk-spacing-1) + var(--nhsuk-spacing-2));
  border-radius: 999px;
  border: var(--nhsuk-border-width-form-element) solid
    var(--nhsuk-border-colour);
  border-top-color: var(--nhsuk-brand-colour);
  animation: spin var(--nhsuk-spinner-duration) linear infinite;

  &[data-size="md"] {
    width: calc(
      var(--nhsuk-spacing-1) + var(--nhsuk-spacing-2) +
        var(--nhsuk-border-width-form-element)
    );
    height: calc(
      var(--nhsuk-spacing-1) + var(--nhsuk-spacing-2) +
        var(--nhsuk-border-width-form-element)
    );
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Text = styled.span`
  font-size: var(--nhsuk-font-size-s);
  color: var(--nhsuk-secondary-text-colour);
`;
