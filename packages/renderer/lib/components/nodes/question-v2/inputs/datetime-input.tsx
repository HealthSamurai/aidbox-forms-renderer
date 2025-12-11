import { useTheme } from "../../../../ui/theme.tsx";

export type DateTimeQuestionInputProps = {
  value: string;
  onChange: (value: string) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function DateTimeQuestionInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  placeholder,
  disabled,
}: DateTimeQuestionInputProps) {
  const { DateTimeInput: UiDateTimeInput } = useTheme();
  return (
    <UiDateTimeInput
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
