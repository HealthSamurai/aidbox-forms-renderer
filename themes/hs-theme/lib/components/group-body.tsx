import type { GroupBodyProps } from "@aidbox-forms/theme";
import { styled } from "@linaria/react";

const backgrounds: Record<string, string | undefined> = {
  header: "#f7fafc",
  footer: "#fff5f5",
  page: "#ffffff",
};

export function GroupBody({
  linkId,
  legend,
  children,
  dataControl,
}: GroupBodyProps) {
  const background = backgrounds[dataControl ?? ""] ?? "#ffffff";
  return (
    <Container
      data-linkid={linkId}
      data-item-control={dataControl ?? undefined}
      data-control={dataControl ?? undefined}
      $variant={dataControl ?? ""}
      style={{ background }}
    >
      {legend ? <Legend>{legend}</Legend> : null}
      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled.fieldset<{ $variant: string }>`
  border: ${(props) => (props.$variant === "page" ? "2px" : "1px")} solid
    #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: ${(props) =>
    props.$variant === "page" ? "0 2px 6px rgba(0, 0, 0, 0.05)" : "none"};
`;

const Legend = styled.legend`
  font-weight: 600;
  padding: 0 0.25rem;
  margin-bottom: 0.5rem;
`;

const Content = styled.div`
  display: grid;
  gap: 1rem;
`;
