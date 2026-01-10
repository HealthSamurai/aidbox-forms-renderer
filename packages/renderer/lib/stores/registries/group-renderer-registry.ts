import type {
  GroupRendererDefinition,
  IGroupNode,
  IGroupList,
} from "../../types.ts";

export class GroupRendererRegistry {
  private readonly definitions: GroupRendererDefinition[];

  constructor(initialDefinitions: GroupRendererDefinition[]) {
    this.definitions = [...initialDefinitions].sort(
      (a, b) => b.priority - a.priority,
    );
  }

  resolve(node: IGroupNode | IGroupList): GroupRendererDefinition | undefined {
    return this.definitions.find((definition) => definition.matcher(node));
  }
}
