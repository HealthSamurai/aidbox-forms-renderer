import { styled } from "@linaria/react";
import type { SelectOrInputFieldProps } from "@aidbox-forms/theme";

export function SelectOrInputField({
  input,
  inputFooter,
}: SelectOrInputFieldProps) {
  return (
    <Shell>
      {input ? (
        <InputSlot>
          {input}
          {inputFooter ? <InputFooter>{inputFooter}</InputFooter> : null}
        </InputSlot>
      ) : null}
    </Shell>
  );
}

const Shell = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-start;
`;

const InputSlot = styled.div`
  flex: 2 1 16rem;
  min-width: 14rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputFooter = styled.div`
  display: flex;
  justify-content: flex-start;
`;
