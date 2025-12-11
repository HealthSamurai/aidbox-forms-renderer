import "./gtable-control.css";
import { Fragment } from "react";
import { observer } from "mobx-react-lite";
import type {
  IGroupNode,
  IQuestionNode,
  IGroupWrapper,
  GroupWrapperControlProps,
} from "../../../../types.ts";
import { isQuestionNode } from "../../../../stores/nodes/questions/question-store.ts";
import { Node } from "../../../form/node.tsx";
import { NodeErrors } from "../../../form/node-errors.tsx";
import { NodesList } from "../../../form/node-list.tsx";
import { Button } from "../../../controls/button.tsx";
import { GroupWrapperScaffold } from "../group-wrapper-scaffold.tsx";
import { QuestionnaireItem } from "fhir/r5";

export const GTableControl = function GTableControl({
  wrapper,
}: GroupWrapperControlProps) {
  return (
    <GroupWrapperScaffold wrapper={wrapper}>
      <RepeatingGroupMatrix wrapper={wrapper} />
    </GroupWrapperScaffold>
  );
};

const RepeatingGroupMatrix = observer(function RepeatingGroupMatrix({
  wrapper,
}: {
  wrapper: IGroupWrapper;
}) {
  const columns = buildColumnSpecs(wrapper.template, wrapper.visibleNodes);
  const actionColumn = wrapper.canRemove ? 1 : 0;
  return (
    <div className="af-repeating-gtable">
      <table className="af-repeating-gtable__table">
        <thead>
          <tr>
            <th scope="col">Node</th>
            {columns.map((column) => (
              <th key={column.linkId} scope="col">
                {column.label}
              </th>
            ))}
            {wrapper.canRemove ? (
              <th scope="col" className="sr-only">
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {wrapper.visibleNodes.length === 0 ? (
            <tr>
              <td
                className="af-empty"
                colSpan={columns.length + 1 + actionColumn}
              >
                No nodes yet.
              </td>
            </tr>
          ) : (
            wrapper.visibleNodes.map((node, index) => {
              const detailsNeeded = hasGroupDetails(node);
              return (
                <Fragment key={node.key}>
                  <tr>
                    <th scope="row">{getNodeLabel(node.template, index)}</th>
                    {columns.map((column) => (
                      <td key={`${node.key}-${column.linkId}`}>
                        <RepeatingGroupMatrixCell
                          node={node}
                          linkId={column.linkId}
                        />
                      </td>
                    ))}
                    {wrapper.canRemove ? (
                      <td className="af-repeating-gtable__actions">
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => wrapper.removeNode(node)}
                          disabled={!wrapper.canRemove}
                        >
                          Remove
                        </Button>
                      </td>
                    ) : null}
                  </tr>
                  {detailsNeeded ? (
                    <tr className="af-repeating-gtable__details-row">
                      <td colSpan={columns.length + 1 + actionColumn}>
                        <NodeDetails node={node} />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
});

type ColumnSpec = {
  linkId: string;
  label: string;
};

function buildColumnSpecs(
  template: QuestionnaireItem,
  nodes: IGroupNode[],
): ColumnSpec[] {
  const seen = new Set<string>();
  const columns: ColumnSpec[] = [];
  (template.item ?? []).forEach((item) => {
    if (!item || item.type === "group" || item.type === "display") {
      return;
    }
    if (!item.linkId || seen.has(item.linkId)) {
      return;
    }
    columns.push({ linkId: item.linkId, label: item.text ?? item.linkId });
    seen.add(item.linkId);
  });

  nodes.forEach((node) => {
    node.nodes.forEach((node) => {
      if (!isQuestionNode(node)) {
        return;
      }
      if (seen.has(node.linkId)) {
        return;
      }
      columns.push({ linkId: node.linkId, label: node.text ?? node.linkId });
      seen.add(node.linkId);
    });
  });

  return columns;
}

const RepeatingGroupMatrixCell = observer(function RepeatingGroupMatrixCell({
  node,
  linkId,
}: {
  node: IGroupNode;
  linkId: string;
}) {
  const question = node.nodes.find(
    (child): child is IQuestionNode =>
      isQuestionNode(child) && child.linkId === linkId,
  );

  if (!question) {
    return (
      <div className="af-repeating-gtable__cell af-repeating-gtable__cell--empty">
        —
      </div>
    );
  }

  return (
    <div className="af-repeating-gtable__cell">
      <Node node={question} />
    </div>
  );
});

function getNodeLabel(template: QuestionnaireItem, index: number): string {
  const base = template.text ?? "Entry";
  return `${base} #${index + 1}`;
}

const NodeDetails = observer(function NodeDetails({
  node,
}: {
  node: IGroupNode;
}) {
  const ancillaryNodes = node.nodes.filter((node) => !isQuestionNode(node));
  if (!node.hasErrors && ancillaryNodes.length === 0) {
    return null;
  }

  return (
    <div className="af-repeating-gtable__details">
      <NodeErrors node={node} />
      {ancillaryNodes.length > 0 ? <NodesList nodes={ancillaryNodes} /> : null}
    </div>
  );
});

function hasGroupDetails(node: IGroupNode): boolean {
  if (node.hasErrors) {
    return true;
  }
  return node.nodes.some((child) => !isQuestionNode(child));
}
