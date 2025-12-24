import type { TabContainerProps } from "@aidbox-forms/theme";
import classNames from "classnames";

export function TabContainer({
  legend,
  items,
  activeIndex,
  onSelect,
  errors,
  empty,
  linkId,
}: TabContainerProps) {
  if (items.length === 0) {
    return (
      <div className="nhsuk-form-group">
        <div className="nhsuk-hint">{empty ?? "No tab content available."}</div>
      </div>
    );
  }

  const clampedIndex = Math.min(
    Math.max(activeIndex, 0),
    Math.max(items.length - 1, 0),
  );

  return (
    <div className="nhsuk-tabs" data-linkid={linkId}>
      {legend ? <h2 className="nhsuk-tabs__title">{legend}</h2> : null}
      <ul className="nhsuk-tabs__list" role="tablist">
        {items.map((item, idx) => {
          const selected = idx === clampedIndex;
          return (
            <li
              key={item.key}
              className={classNames("nhsuk-tabs__list-item", {
                "nhsuk-tabs__list-item--selected": selected,
              })}
            >
              <button
                type="button"
                className="nhsuk-tabs__tab"
                role="tab"
                id={item.tabButtonId}
                aria-selected={selected}
                aria-controls={item.tabPanelId}
                onClick={() => onSelect(idx)}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
      {items.map((item, idx) => {
        const selected = idx === clampedIndex;
        return (
          <div
            key={item.key}
            className="nhsuk-tabs__panel"
            role="tabpanel"
            id={item.tabPanelId}
            aria-labelledby={item.tabButtonId}
            hidden={!selected}
          >
            {item.content}
          </div>
        );
      })}
      {errors}
    </div>
  );
}
