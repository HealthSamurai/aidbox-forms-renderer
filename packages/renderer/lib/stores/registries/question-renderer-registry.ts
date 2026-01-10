import type { IQuestionNode, QuestionRendererDefinition } from "../../types.ts";

export class QuestionRendererRegistry {
  private definitions: QuestionRendererDefinition[];

  constructor(initialDefinitions: QuestionRendererDefinition[] = []) {
    this.definitions = this.sortDefinitions(initialDefinitions);
  }

  register(...definitions: QuestionRendererDefinition[]): void {
    this.definitions = this.sortDefinitions([
      ...this.definitions,
      ...definitions,
    ]);
  }

  unregister(name: string): void {
    this.definitions = this.definitions.filter(
      (definition) => definition.name !== name,
    );
  }

  resolve(node: IQuestionNode): QuestionRendererDefinition | undefined {
    return this.definitions.find((definition) => definition.matcher(node));
  }

  list(): QuestionRendererDefinition[] {
    return [...this.definitions];
  }

  private sortDefinitions(
    definitions: QuestionRendererDefinition[],
  ): QuestionRendererDefinition[] {
    return definitions.toSorted((a, b) => b.priority - a.priority);
  }
}
