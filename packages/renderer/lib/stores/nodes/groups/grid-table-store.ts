import { computed, makeObservable } from "mobx";
import type {
  GridTableColumnState,
  GridTableRowState,
  IGridTableStore,
  IGroupWrapper,
  IQuestionNode,
} from "../../../types.ts";
import { isQuestionNode } from "../questions/question-store.ts";
import { buildId } from "../../../utils.ts";

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
      token: column.linkId,
      label: column.label,
    }));
  }

  @computed
  get rows(): GridTableRowState[] {
    return this.wrapper.visibleNodes.map((node) => {
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
