import type { RepeatingGroupListProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

export function RepeatingGroupList({
  linkId,
  legend,
  items,
  toolbar,
}: RepeatingGroupListProps) {
  return (
    <Container data-linkid={linkId}>
      {legend ? <Legend>{legend}</Legend> : null}
      <Items>{items}</Items>
      {toolbar ? <Toolbar>{toolbar}</Toolbar> : null}
    </Container>
  );
}

const Container = styled.fieldset`
  border: 1px solid #cbd5f5;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const Legend = styled.legend`
  padding: 0 0.25rem;
  font-weight: 600;
`;

const Items = styled.div`
  interpolate-size: allow-keywords;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 1rem;
`;
