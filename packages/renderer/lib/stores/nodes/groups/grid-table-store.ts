import { computed, makeObservable } from "mobx";
import type {
  GridTableColumnState,
  GridTableRowState,
  IGridTableStore,
  IGroupList,
  IQuestionNode,
} from "../../../types.ts";
import { isQuestionNode } from "../questions/question-store.ts";
import { buildId } from "../../../utils.ts";

export class GridTableStore implements IGridTableStore {
  private readonly list: IGroupList;

  constructor(list: IGroupList) {
    this.list = list;
    makeObservable(this);
  }

  @computed
  get columns(): GridTableColumnState[] {
    const seen = new Set<string>();
    const columns: Array<{ linkId: string; label: string }> = [];
    (this.list.template.item ?? []).forEach((item) => {
      if (!item || item.type === "group" || item.type === "display") {
        return;
      }
      if (!item.linkId || seen.has(item.linkId)) {
        return;
      }
      columns.push({ linkId: item.linkId, label: item.text ?? item.linkId });
      seen.add(item.linkId);
    });

    this.list.visibleNodes.forEach((node) => {
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
      token: column.linkId,
      label: column.label,
    }));
  }

  @computed
  get rows(): GridTableRowState[] {
    return this.list.visibleNodes.map((node) => {
      const questionMap = new Map<string, IQuestionNode>(
        node.nodes
          .filter(isQuestionNode)
          .map((question) => [question.linkId, question]),
      );

      return {
        token: node.token,
        node,
        label: null,
        cells: this.columns.map((column) => ({
          token: buildId(node.token, column.token),
          question: questionMap.get(column.token),
        })),
      };
    });
  }
}
