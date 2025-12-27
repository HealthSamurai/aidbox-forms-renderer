import { observer } from "mobx-react-lite";
import type { GroupControlProps } from "../../../../types.ts";
import { GroupScaffold } from "../group-scaffold.tsx";
import { TableQuestionDetails } from "../components/selection-table.tsx";
import { NodeHeader } from "../../../form/node-header.tsx";
import { useTheme } from "../../../../ui/theme.tsx";
import { JSX } from "react";
import { ValueDisplay } from "../../question/fhir/value-display.tsx";

export const HorizontalTableRenderer = observer(
  function HorizontalTableRenderer({ node }: GroupControlProps) {
    const { GridTable, EmptyState, RadioButtonList, CheckboxList } = useTheme();
    const store = node.tableStore;
    const optionAxis = store.optionAxis;

    let content: JSX.Element;
    if (store.questions.length === 0) {
      content = (
        <EmptyState>
          No choice questions available for horizontal table.
        </EmptyState>
      );
    } else if (optionAxis.length === 0) {
      content = (
        <EmptyState>
          No answer options available for horizontal table layout.
        </EmptyState>
      );
    } else {
      const detailBlocks = store.detailQuestions
        .map((question) => (
          <TableQuestionDetails
            key={`${question.token}-details`}
            question={question}
          />
        ))
        .filter(Boolean);

      const questionSelections = new Map(
        store.questionAxis.map((questionAxis) => [
          questionAxis.token,
          store.getQuestionSelection(questionAxis.token),
        ]),
      );

      const rows = optionAxis.map((option) => {
        const optionLabel = (
          <ValueDisplay type={option.type} value={option.value} />
        );
        return {
          token: option.token,
          label: optionLabel,
          cells: store.questionAxis.map((questionAxis) => {
            const cell = store.getCellState(questionAxis.token, option.token);
            if (!cell.hasOption) {
              return {
                token: `${questionAxis.token}-${option.token}`,
                content: "—",
              };
            }

            const label = (
              <ValueDisplay
                type={questionAxis.question.type}
                value={option.value}
              />
            );
            const questionSelection = questionSelections.get(
              questionAxis.token,
            );

            if (questionAxis.question.repeats) {
              return {
                token: `${questionAxis.token}-${option.token}`,
                content: (
                  <CheckboxList
                    options={[
                      {
                        token: option.token,
                        label,
                        disabled: cell.disabled,
                      },
                    ]}
                    tokens={questionSelection?.selectedTokens ?? new Set()}
                    onChange={(token) => {
                      if (token === option.token) {
                        store.toggleCell(questionAxis.token, option.token);
                      }
                    }}
                    id={questionAxis.id}
                    ariaLabelledBy={questionAxis.ariaLabelledBy}
                    ariaDescribedBy={questionAxis.ariaDescribedBy}
                    disabled={questionAxis.question.readOnly}
                  />
                ),
              };
            }

            return {
              token: `${questionAxis.token}-${option.token}`,
              content: (
                <RadioButtonList
                  options={[
                    {
                      token: option.token,
                      label,
                      disabled: cell.disabled,
                    },
                  ]}
                  token={questionSelection?.selectedToken ?? ""}
                  legacyOption={null}
                  onChange={(token) => {
                    if (token === option.token) {
                      store.toggleCell(questionAxis.token, option.token);
                    }
                  }}
                  id={questionAxis.id}
                  ariaLabelledBy={questionAxis.ariaLabelledBy}
                  ariaDescribedBy={questionAxis.ariaDescribedBy}
                  disabled={questionAxis.question.readOnly}
                />
              ),
            };
          }),
        };
      });

      content = (
        <>
          <GridTable
            columns={store.questionAxis.map((questionAxis) => ({
              token: questionAxis.token,
              label: <NodeHeader node={questionAxis.question} />,
            }))}
            rows={rows}
          />
          {detailBlocks.length > 0 ? detailBlocks : null}
        </>
      );
    }

    return (
      <GroupScaffold node={node} dataControl="htable">
        {content}
      </GroupScaffold>
    );
  },
);
