import { useTheme } from "../../../../../ui/theme.tsx";

export type BooleanInputProps = {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  disabled?: boolean | undefined;
};

const BOOLEAN_OPTIONS = [
  { key: "yes", label: "Yes" },
  { key: "no", label: "No" },
  { key: "unanswered", label: "Unanswered" },
];

export function BooleanInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  disabled,
}: BooleanInputProps) {
  const { RadioButtonList } = useTheme();
  const selectValue =
    value === true ? "yes" : value === false ? "no" : "unanswered";
  const fallbackInputId = inputId ?? "boolean";
  const fallbackLabelId = labelId ?? fallbackInputId;

  return (
    <RadioButtonList
      options={BOOLEAN_OPTIONS}
      selectValue={selectValue}
      onChange={(key) => {
        if (key === "yes") {
          onChange(true);
        } else if (key === "no") {
          onChange(false);
        } else {
          onChange(null);
        }
      }}
      legacyOptionLabel={undefined}
      legacyOptionKey={undefined}
      inputId={fallbackInputId}
      labelId={fallbackLabelId}
      describedById={describedById}
      readOnly={Boolean(disabled)}
    />
  );
}
