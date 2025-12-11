import { useTheme } from "../../../../ui/theme.tsx";

export type DateInputProps = {
  value: string;
  onChange: (value: string) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function DateQuestionInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  placeholder,
  disabled,
}: DateInputProps) {
  const { DateInput: UiDateInput } = useTheme();
  return (
    <UiDateInput
      id={inputId}
      ariaLabelledBy={labelId}
      ariaDescribedBy={describedById}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
