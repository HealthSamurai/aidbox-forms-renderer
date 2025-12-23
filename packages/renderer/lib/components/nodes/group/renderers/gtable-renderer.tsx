import { observer } from "mobx-react-lite";
import type {
  IGroupNode,
  IQuestionNode,
  IGroupWrapper,
  GroupWrapperControlProps,
} from "../../../../types.ts";
import { isQuestionNode } from "../../../../stores/nodes/questions/question-store.ts";
import { Node } from "../../../form/node.tsx";
import { GroupWrapperScaffold } from "../group-wrapper-scaffold.tsx";
import { QuestionnaireItem } from "fhir/r5";
import { useTheme } from "../../../../ui/theme.tsx";
import type { GridTableProps } from "@aidbox-forms/theme";

export const GTableRenderer = function GTableRenderer({
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
  const { Button, GridTable, EmptyState } = useTheme();
  const columns = buildColumnSpecs(wrapper.template, wrapper.visibleNodes);

  const rows = wrapper.visibleNodes.map((node, index) => {
    const cells = columns.map((column) => {
      const question = node.nodes.find(
        (child): child is IQuestionNode =>
          isQuestionNode(child) && child.linkId === column.linkId,
      );

      const content = question ? <Node node={question} /> : "—";

      return { key: `${node.key}-${column.linkId}`, content };
    });

    if (wrapper.canRemove) {
      cells.push({
        key: `${node.key}-actions`,
        content: (
          <Button
            type="button"
            variant="danger"
            onClick={() => wrapper.removeNode(node)}
            disabled={!wrapper.canRemove}
          >
            Remove
          </Button>
        ),
      });
    }

    return {
      key: node.key,
      label: getNodeLabel(node.template, index),
      cells,
    };
  });

  const gridColumns: GridTableProps["columns"] = [
    { key: "node", label: "Node" },
    ...columns.map((column) => ({ key: column.linkId, label: column.label })),
  ];

  if (wrapper.canRemove) {
    gridColumns.push({ key: "actions", label: "Actions" });
  }

  if (rows.length === 0) {
    return (
      <GridTable
        columns={gridColumns}
        rows={[{ key: "empty", label: "Node", cells: [] }]}
        empty={<EmptyState>No nodes yet.</EmptyState>}
      />
    );
  }

  return (
    <GridTable
      columns={gridColumns}
      rows={rows.map((row) => ({
        key: row.key,
        label: row.label,
        cells: row.cells,
      }))}
    />
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

function getNodeLabel(template: QuestionnaireItem, index: number): string {
  const base = template.text ?? "Entry";
  return `${base} #${index + 1}`;
}
