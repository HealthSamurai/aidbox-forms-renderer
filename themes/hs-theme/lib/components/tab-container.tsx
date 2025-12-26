import { styled } from "@linaria/react";
import type { TabContainerProps } from "@aidbox-forms/theme";
import { EmptyState } from "./empty-state.tsx";

export function TabContainer({
  header,
  items,
  value,
  onChange,
  errors,
  empty,
  linkId,
}: TabContainerProps) {
  if (items.length === 0) {
    return <EmptyState>{empty ?? "No tab content available."}</EmptyState>;
  }

  const clampedIndex = Math.min(
    Math.max(value, 0),
    Math.max(items.length - 1, 0),
  );
  const active = items[clampedIndex];

  return (
    <Shell data-linkid={linkId}>
      {header ? <Header>{header}</Header> : null}
      <TabList role="tablist">
        {items.map((item, idx) => {
          const selected = idx === clampedIndex;
          return (
            <TabButton
              key={item.token}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={item.panelId}
              id={item.buttonId}
              onClick={() => onChange(idx)}
              data-selected={selected ? "true" : "false"}
            >
              {item.label}
            </TabButton>
          );
        })}
      </TabList>
      <Panel
        role="tabpanel"
        id={active.panelId}
        aria-labelledby={active.buttonId}
      >
        {active.content}
      </Panel>
      {errors ? <ErrorsSlot>{errors}</ErrorsSlot> : null}
    </Shell>
  );
}

const Shell = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Header = styled.div`
  font-weight: 700;
`;

const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TabButton = styled.button`
  border: 1px solid #cbd5e0;
  background: #fff;
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  transition: background 0.1s ease;

  &[data-selected="true"] {
    background: #2b6cb0;
    border-color: #2b6cb0;
    color: white;
  }

  &:focus-visible {
    outline: 2px solid #2b6cb0;
    outline-offset: 2px;
  }
`;

const Panel = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 1rem;
`;

const ErrorsSlot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
