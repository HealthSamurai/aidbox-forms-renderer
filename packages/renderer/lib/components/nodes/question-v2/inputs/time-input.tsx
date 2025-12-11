import { useTheme } from "../../../../ui/theme.tsx";

export type TimeQuestionInputProps = {
  value: string;
  onChange: (value: string) => void;
  inputId?: string | undefined;
  labelId?: string | undefined;
  describedById?: string | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
};

export function TimeQuestionInput({
  value,
  onChange,
  inputId,
  labelId,
  describedById,
  placeholder,
  disabled,
}: TimeQuestionInputProps) {
  const { TimeInput: UiTimeInput } = useTheme();
  return (
    <UiTimeInput
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
