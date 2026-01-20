import type { HeaderProperties } from "@formbox/theme";

export function Header({ linkId, children }: HeaderProperties) {
  return (
    <div className="nhsuk-card nhsuk-u-margin-bottom-0" data-linkId={linkId}>
      <div className="nhsuk-card__content">
        {/*<h2 className="nhsuk-card__heading"></h2>*/}
        {children}
      </div>
    </div>
  );
}
