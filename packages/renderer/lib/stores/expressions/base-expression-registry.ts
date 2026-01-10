import {
  ExpressionSlotKind,
  IEvaluationCoordinator,
  IExpressionEnvironmentProvider,
  IExpressionRegistry,
  IExpressionSlot,
  IScope,
  TargetConstraintDefinition,
} from "../../types.ts";
import type { Element, Expression, OperationOutcomeIssue } from "fhir/r5";
import {
  EXT,
  extractExtensionsValues,
  extractExtensionValue,
  findExtensions,
  makeIssue,
} from "../../utils.ts";
import { ExpressionSlot } from "./expression-slot.ts";
import { ConstraintSlot } from "./constraint-slot.ts";
import { DuplicateExpressionNameError } from "./scope.ts";
import { computed, makeObservable, observable } from "mobx";

export class BaseExpressionRegistry implements IExpressionRegistry {
  private readonly slots = observable.array<IExpressionSlot>([], {
    deep: false,
    name: "BaseExpressionRegistry.slots",
  });

  private readonly constraints = observable.array<ConstraintSlot>([], {
    deep: false,
    name: "BaseExpressionRegistry.constraints",
  });

  readonly registrationIssues = observable.array<OperationOutcomeIssue>([], {
    deep: false,
    name: "BaseExpressionRegistry.registrationIssues",
  });

  constructor(
    private coordinator: IEvaluationCoordinator,
    private scope: IScope,
    private environmentProvider: IExpressionEnvironmentProvider,
    element: Element,
  ) {
    makeObservable(this);

    extractExtensionsValues("Expression", element, EXT.SDC_VARIABLE).forEach(
      (expression) => {
        this.createSlot(expression, "variable");
      },
    );

    const definitions = findExtensions(element, EXT.TARGET_CONSTRAINT).map(
      (extension): TargetConstraintDefinition => ({
        key: extractExtensionValue("id", extension, "key"),
        severity: extractExtensionValue("code", extension, "severity") as
          | "error"
          | "warning",
        human: extractExtensionValue("string", extension, "human"),
        expression: extractExtensionValue(
          "Expression",
          extension,
          "expression",
        ),
        location: extractExtensionValue("string", extension, "location"),
        requirements: extractExtensionValue(
          "markdown",
          extension,
          "requirements",
        ),
      }),
    );

    definitions.forEach((definition) => {
      const slot = this.createSlot(definition.expression, "constraint");
      if (slot) {
        this.constraints.push(new ConstraintSlot(definition, slot));
      } else {
        this.registrationIssues.push(
          makeIssue(
            "invalid",
            `Constraint ${definition.key ? `"${definition.key}"` : "with no key"} is missing an expression.`,
          ),
        );
      }
    });
  }

  protected createSlot(
    expression: Expression | undefined,
    kind: ExpressionSlotKind,
  ): IExpressionSlot | undefined {
    if (!expression) return undefined;

    const slot: IExpressionSlot = new ExpressionSlot(
      this.coordinator,
      this.environmentProvider,
      kind,
      expression,
    );

    this.slots.push(slot);

    try {
      this.scope.registerExpression(slot);
    } catch (e) {
      if (e instanceof DuplicateExpressionNameError)
        this.registrationIssues.push(makeIssue("invalid", e.message));
      else throw e;
    }

    return slot;
  }

  @computed
  get slotsIssues(): OperationOutcomeIssue[] {
    return this.slots
      .map((slot) => slot.error)
      .filter((issue): issue is OperationOutcomeIssue => issue !== undefined);
  }

  @computed
  get constraintsIssues(): OperationOutcomeIssue[] {
    return this.constraints
      .map((constraint) => constraint.issue)
      .filter((issue): issue is OperationOutcomeIssue => issue !== undefined);
  }
}
