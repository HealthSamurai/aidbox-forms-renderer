import type { SelectionMatrixProps } from "@aidbox-forms/theme";
import type { ReactElement } from "react";
import { styled } from "@linaria/react";

export function SelectionMatrix({
  orientation,
  columns,
  rows,
  detailsGrid,
  empty,
}: SelectionMatrixProps): ReactElement | null {
  if (rows.length === 0 || columns.length === 0) {
    return empty ? <>{empty}</> : <Empty>Nothing to display.</Empty>;
  }

  const showQuestionHeader = orientation === "vertical";

  return (
    <Wrapper>
      <Table>
        <thead>
          <tr>
            {showQuestionHeader ? (
              <Header scope="col" className="af-choice-matrix__question-header">
                Question
              </Header>
            ) : null}
            {columns.map((column) => (
              <Header key={column.key} id={column.headerId} scope="col">
                {column.label}
              </Header>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const cells = row.cells;
            return (
              <Row key={row.key} data-loading={row.loading || undefined}>
                {showQuestionHeader ? (
                  <RowHeader scope="row">{row.header}</RowHeader>
                ) : null}
                {cells.map((cell) => (
                  <Cell
                    key={cell.key}
                    data-selected={cell.selected || undefined}
                    data-disabled={cell.disabled || undefined}
                  >
                    {cell.content}
                  </Cell>
                ))}
              </Row>
            );
          })}
        </tbody>
      </Table>
      {orientation === "vertical"
        ? rows.map((row) =>
            row.details ? (
              <DetailsRow key={`${row.key}-details`}>{row.details}</DetailsRow>
            ) : null,
          )
        : null}
      {orientation === "horizontal" && detailsGrid ? (
        <DetailsGrid>{detailsGrid}</DetailsGrid>
      ) : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  overflow-x: auto;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Header = styled.th`
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  text-align: center;
  min-width: 160px;

  &.af-choice-matrix__question-header {
    text-align: left;
    min-width: 200px;
  }
`;

const Row = styled.tr`
  &[data-loading="true"] {
    opacity: 0.7;
  }
`;

const RowHeader = styled.th`
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  text-align: left;
  font-weight: 600;
`;

const Cell = styled.td`
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  text-align: center;
  min-height: 2.5rem;

  &[data-selected="true"] {
    background: #eef2ff;
    border-color: #4f46e5;
  }

  &[data-disabled="true"] {
    opacity: 0.6;
  }
`;

const DetailsRow = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-top: none;
  padding: 0.75rem;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 0.25rem;
`;

const Empty = styled.p`
  font-style: italic;
  color: #94a3b8;
`;
