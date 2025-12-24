import { computed, makeObservable } from "mobx";
import type {
  IGridTableStore,
  IGroupNode,
  IGroupWrapper,
  IQuestionNode,
} from "../../../types.ts";
import { isQuestionNode } from "../questions/question-store.ts";

export type GridTableColumnState = {
  key: string;
  label: string;
};

export type GridTableCellState = {
  key: string;
  question?: IQuestionNode | undefined;
  action?: "remove" | undefined;
};

export type GridTableRowState = {
  key: string;
  label: string;
  node: IGroupNode;
  cells: GridTableCellState[];
};

export class GridTableStore implements IGridTableStore {
  private readonly wrapper: IGroupWrapper;

  constructor(wrapper: IGroupWrapper) {
    this.wrapper = wrapper;
    makeObservable(this);
  }

  @computed
  get columns(): GridTableColumnState[] {
    const seen = new Set<string>();
    const columns: Array<{ linkId: string; label: string }> = [];
    (this.wrapper.template.item ?? []).forEach((item) => {
      if (!item || item.type === "group" || item.type === "display") {
        return;
      }
      if (!item.linkId || seen.has(item.linkId)) {
        return;
      }
      columns.push({ linkId: item.linkId, label: item.text ?? item.linkId });
      seen.add(item.linkId);
    });

    this.wrapper.visibleNodes.forEach((node) => {
      node.nodes.forEach((child) => {
        if (!isQuestionNode(child)) {
          return;
        }
        if (seen.has(child.linkId)) {
          return;
        }
        columns.push({
          linkId: child.linkId,
          label: child.text ?? child.linkId,
        });
        seen.add(child.linkId);
      });
    });

    return columns.map((column) => ({
      key: column.linkId,
      label: column.label,
    }));
  }

  @computed
  get gridColumns(): GridTableColumnState[] {
    const columns = [{ key: "node", label: "Node" }, ...this.columns];
    if (this.wrapper.canRemove) {
      columns.push({ key: "actions", label: "Actions" });
    }
    return columns;
  }

  @computed
  get rows(): GridTableRowState[] {
    const columns = this.columns;
    return this.wrapper.visibleNodes.map((node, index) => {
      const questionMap = new Map<string, IQuestionNode>(
        node.nodes
          .filter(isQuestionNode)
          .map((question) => [question.linkId, question]),
      );
      const cells: GridTableCellState[] = columns.map((column) => ({
        key: `${node.key}-${column.key}`,
        question: questionMap.get(column.key),
      }));

      if (this.wrapper.canRemove) {
        cells.push({
          key: `${node.key}-actions`,
          action: "remove",
        });
      }

      return {
        key: node.key,
        node,
        label: `${this.wrapper.template.text ?? "Entry"} #${index + 1}`,
        cells,
      };
    });
  }
}
