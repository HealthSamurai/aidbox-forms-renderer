import { computed, makeObservable } from "mobx";
import type {
  GridColumnState,
  GridRowState,
  IGridStore,
  IGroupNode,
  IQuestionNode,
} from "../../../types.ts";
import { isGroupNode } from "./group-store.ts";
import { isQuestionNode } from "../questions/question-store.ts";

export class GridStore implements IGridStore {
  private readonly group: IGroupNode;

  constructor(group: IGroupNode) {
    this.group = group;
    makeObservable(this);
  }

  @computed
  get rowGroups(): IGroupNode[] {
    return this.group.nodes.filter(isGroupNode);
  }

  @computed
  get visibleRows(): IGroupNode[] {
    return this.rowGroups.filter((row) => !row.hidden);
  }

  @computed
  get columns(): GridColumnState[] {
    const seen = new Set<string>();
    const columns: Array<{ linkId: string; label: string }> = [];

    this.visibleRows.forEach((row) => {
      row.nodes
        .filter(isQuestionNode)
        .filter((question) => !question.hidden)
        .forEach((question) => {
          if (!seen.has(question.linkId)) {
            seen.add(question.linkId);
            columns.push({
              linkId: question.linkId,
              label: question.text ?? question.linkId,
            });
          }
        });
    });

    return columns.map((column) => ({
      token: column.linkId,
      label: column.label,
    }));
  }

  @computed
  get rows(): GridRowState[] {
    const columns = this.columns;
    return this.visibleRows.map((row) => {
      const questions = row.nodes
        .filter(isQuestionNode)
        .filter((question) => !question.hidden);
      const questionMap = new Map<string, IQuestionNode>(
        questions.map((question) => [question.linkId, question]),
      );
      const label = row.text ?? row.linkId ?? "Row";

      return {
        token: row.token,
        label,
        cells: columns.map((column) => ({
          token: `${row.token}-${column.token}`,
          question: questionMap.get(column.token),
        })),
      };
    });
  }

  @computed
  get emptyMessage(): string | null {
    if (this.rowGroups.length === 0) {
      return "No row groups configured for this grid.";
    }

    if (this.visibleRows.length === 0) {
      return "All rows are currently hidden.";
    }

    if (this.columns.length === 0) {
      return "Grid rows have no questions to render.";
    }

    return null;
  }
}
