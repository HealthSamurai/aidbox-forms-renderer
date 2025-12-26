import { useTheme } from "../../../../../ui/theme.tsx";

export type BooleanInputProps = {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  id?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean | undefined;
};

const BOOLEAN_OPTIONS = [
  { token: "yes", label: "Yes" },
  { token: "no", label: "No" },
  { token: "unanswered", label: "Unanswered" },
];

export function BooleanInput({
  value,
  onChange,
  id,
  ariaLabelledBy,
  ariaDescribedBy,
  disabled,
}: BooleanInputProps) {
  const { RadioButtonList } = useTheme();
  const selectedToken =
    value === true ? "yes" : value === false ? "no" : "unanswered";
  const fallbackInputId = id ?? "boolean";
  const fallbackAriaLabelledBy = ariaLabelledBy ?? fallbackInputId;

  return (
    <RadioButtonList
      options={BOOLEAN_OPTIONS}
      token={selectedToken}
      onChange={(token) => {
        if (token === "yes") {
          onChange(true);
        } else if (token === "no") {
          onChange(false);
        } else {
          onChange(null);
        }
      }}
      legacyOption={null}
      id={fallbackInputId}
      ariaLabelledBy={fallbackAriaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      disabled={Boolean(disabled)}
    />
  );
}
