import {
  IExpressionSlot,
  IScope,
  ExpressionEnvironment,
  IPresentableNode,
} from "../../types.ts";
import { makeObservable, observable, ObservableMap } from "mobx";

export class DuplicateExpressionNameError extends Error {
  constructor(public expressionName: string) {
    super(`Expression name collision for "${expressionName}".`);
  }
}

export class Scope implements IScope {
  private parent: IScope | undefined;

  @observable.shallow
  private readonly nodeRegistry:
    | ObservableMap<string, IPresentableNode>
    | undefined;

  @observable.shallow
  private readonly expressionRegistry = observable.map<string, IExpressionSlot>(
    {},
    { deep: false, name: "NodeScope.expressionRegistry" },
  );

  constructor(ownsNodes: boolean) {
    makeObservable(this);

    this.nodeRegistry = ownsNodes
      ? observable.map<string, IPresentableNode>(
          {},
          { deep: false, name: "NodeScope.storeRegistry" },
        )
      : undefined;
  }

  mergeEnvironment(extra: ExpressionEnvironment): ExpressionEnvironment {
    // Proxy lets expressions read scoped variables as top-level properties while falling back to the provided extras.
    return new Proxy<ExpressionEnvironment>(extra, {
      get: (extra: ExpressionEnvironment, property: string) => {
        return Object.prototype.hasOwnProperty.call(extra, property)
          ? extra[property]
          : this.lookupExpression(property)?.value; // todo: exclude self name
      },
      has: (extra: ExpressionEnvironment, property: string) => {
        return (
          Object.prototype.hasOwnProperty.call(extra, property) ||
          !!this.lookupExpression(property) // todo: exclude self name
        );
      },
    });
  }

  extend(ownsNodes: boolean): IScope {
    const extended = new Scope(ownsNodes);
    extended.parent = this;
    return extended;
  }

  registerNode(node: IPresentableNode): void {
    if (this.nodeRegistry) {
      this.nodeRegistry.set(node.linkId, node);
      return;
    }
    this.parent?.registerNode(node);
  }

  lookupNode(linkId: string): IPresentableNode | undefined {
    if (this.nodeRegistry) {
      const node = this.nodeRegistry.get(linkId);
      if (node) {
        return node;
      }
    }
    return this.parent?.lookupNode(linkId);
  }

  listExpressions(): IterableIterator<[string, IExpressionSlot]> {
    return this.expressionRegistry.entries();
  }

  lookupExpression(name: string): IExpressionSlot | undefined {
    return (
      this.expressionRegistry.get(name) ?? this.parent?.lookupExpression(name)
    );
  }

  registerExpression(slot: IExpressionSlot): void {
    if (slot.name) {
      const existing = this.expressionRegistry.get(slot.name);
      if (existing && existing !== slot)
        throw new DuplicateExpressionNameError(slot.name);

      this.expressionRegistry.set(slot.name, slot);
    }
  }

  getParentScope(): IScope | undefined {
    return this.parent;
  }
}
