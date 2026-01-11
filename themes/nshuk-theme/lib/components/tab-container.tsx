import { styled } from "@linaria/react";
import type { TabContainerProperties } from "@aidbox-forms/theme";
import classNames from "classnames";

export function TabContainer({
  header,
  items,
  value,
  onChange,
  errors,
  linkId,
}: TabContainerProperties) {
  if (items.length === 0) {
    return (
      <div className="nhsuk-form-group">
        <div className="nhsuk-hint">"No tab content available.</div>
      </div>
    );
  }

  const clampedIndex = Math.min(
    Math.max(value, 0),
    Math.max(items.length - 1, 0),
  );

  return (
    <TabsShell className="nhsuk-tabs" data-linkid={linkId}>
      {Boolean(header) && <h2 className="nhsuk-tabs__title">{header}</h2>}
      <ul className="nhsuk-tabs__list" role="tablist">
        {items.map((item, index) => {
          const selected = index === clampedIndex;
          return (
            <li
              key={item.token}
              className={classNames("nhsuk-tabs__list-item", {
                "nhsuk-tabs__list-item--selected": selected,
              })}
            >
              <button
                type="button"
                className="nhsuk-tabs__tab"
                role="tab"
                id={item.buttonId}
                aria-selected={selected}
                aria-controls={item.panelId}
                onClick={() => onChange(index)}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
      {items.map((item, index) => {
        const selected = index === clampedIndex;
        return (
          <TabPanel
            key={item.token}
            className="nhsuk-tabs__panel"
            role="tabpanel"
            id={item.panelId}
            aria-labelledby={item.buttonId}
            hidden={!selected}
          >
            {item.content}
          </TabPanel>
        );
      })}
      {errors}
    </TabsShell>
  );
}

const TabsShell = styled.div`
  border: 0;
  padding: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
`;

const TabPanel = styled.div`
  border: 0;
  padding: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
`;
