import { styled } from "@linaria/react";
import type { OpenChoiceFieldProps } from "@aidbox-forms/theme";

export function OpenChoiceField({ select, input }: OpenChoiceFieldProps) {
  return (
    <Shell>
      <SelectSlot>{select}</SelectSlot>
      <InputSlot>{input}</InputSlot>
    </Shell>
  );
}

const Shell = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-start;
`;

const SelectSlot = styled.div`
  flex: 1 1 12rem;
  min-width: 12rem;
`;

const InputSlot = styled.div`
  flex: 2 1 16rem;
  min-width: 14rem;
`;
