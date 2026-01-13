import type { TabContainerProperties } from "@aidbox-forms/theme";

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
        <div className="nhsuk-hint">No tab content available.</div>
      </div>
    );
  }

  const clampedIndex = Math.min(
    Math.max(value, 0),
    Math.max(items.length - 1, 0),
  );

  return (
    <div data-linkid={linkId}>
      {header}
      {errors}
      <div className="nhsuk-tabs">
        <h2 className="nhsuk-tabs__title">Contents</h2>
        <ul className="nhsuk-tabs__list">
          {items.map((item, index) => {
            const selected = index === clampedIndex;
            const listItemClassName = selected
              ? "nhsuk-tabs__list-item nhsuk-tabs__list-item--selected"
              : "nhsuk-tabs__list-item";

            return (
              <li key={item.token} className={listItemClassName}>
                <a
                  id={item.buttonId}
                  className="nhsuk-tabs__tab"
                  href={`#${item.panelId}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onChange(index);
                  }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        {items.map((item, index) => {
          const selected = index === clampedIndex;
          const panelClassName = selected
            ? "nhsuk-tabs__panel"
            : "nhsuk-tabs__panel nhsuk-tabs__panel--hidden";

          return (
            <div
              key={item.token}
              className={panelClassName}
              id={item.panelId}
              aria-labelledby={item.buttonId}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
