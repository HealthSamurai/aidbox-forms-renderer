import { computed, makeObservable } from "mobx";
import type {
  IGrid,
  IGroupNode,
  IGroupRow,
  IQuestionNode,
} from "../../../types.ts";
import { isQuestionNode } from "../../question/question-store.ts";

export class GridStore implements IGrid {
  constructor(private readonly source: () => IGroupNode[]) {
    makeObservable(this);
  }

  @computed
  get groups(): IGroupNode[] {
    return this.source();
  }

  @computed
  get columns(): IQuestionNode[] {
    const seen = new Set<string>();
    const columns: IQuestionNode[] = [];

    this.groups.forEach((group) => {
      group.visibleNodes
        .filter((node) => isQuestionNode(node))
        .forEach((question) => {
          if (!seen.has(question.linkId)) {
            seen.add(question.linkId);
            columns.push(question);
          }
        });
    });

    return columns;
  }

  @computed
  get rows(): IGroupRow[] {
    return this.groups.map((group) => {
      const questionMap = new Map<string, IQuestionNode>(
        group.visibleNodes
          .filter((node) => isQuestionNode(node))
          .map((question) => [question.linkId, question]),
      );
      return {
        group,
        questions: this.columns.map((column) => questionMap.get(column.linkId)),
      };
    });
  }
}
