import { hsUiPlaceholder } from "@aidbox-forms/hs-ui";

type HsUiDemoProps = {
  label?: string;
};

export function HsUiDemo({ label = "HS UI placeholder" }: HsUiDemoProps) {
  return (
    <div data-hs-ui={hsUiPlaceholder}>
      {label}: {hsUiPlaceholder}
    </div>
  );
}
