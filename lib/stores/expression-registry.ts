import { EvaluationCoordinator } from "./evaluation-coordinator.ts";
import {
  AnswerType,
  ExpressionSlotKind,
  IExpressionEnvironmentProvider,
  IExpressionSlot,
  IScope,
} from "./types.ts";
import type { Expression, Extension, OperationOutcomeIssue } from "fhir/r5";
import {
  extractCalculatedExpression,
  extractEnableWhenExpression,
  extractInitialExpression,
  extractMaxValueExpression,
  extractMinValueExpression,
  extractVariableExpressions,
  makeIssue,
} from "../utils.ts";
import { ExpressionSlot } from "./expression-slot.ts";
import { DuplicateExpressionNameError } from "./scope.ts";
import { computed, makeObservable, observable } from "mobx";

export class ExpressionRegistry {
  @observable.shallow
  private readonly slots = observable.array<IExpressionSlot>([], {
    deep: false,
    name: "ExpressionRegistry.slots",
  });

  @observable.shallow
  private readonly registrationIssues = observable.array<OperationOutcomeIssue>(
    [],
    {
      deep: false,
      name: "ExpressionRegistry.registrationIssues",
    },
  );

  readonly enableWhen: IExpressionSlot | undefined;
  readonly initial: IExpressionSlot | undefined;
  readonly calculated: IExpressionSlot | undefined;
  readonly minValue: IExpressionSlot | undefined;
  readonly maxValue: IExpressionSlot | undefined;

  constructor(
    private coordinator: EvaluationCoordinator,
    private scope: IScope,
    private environmentProvider: IExpressionEnvironmentProvider,
    extensions: Extension[] | undefined,
    type?: AnswerType | undefined,
  ) {
    makeObservable(this);

    extractVariableExpressions(extensions).forEach((expression) => {
      this.createSlot(expression, "variable");
    });

    this.enableWhen = this.createSlot(
      extractEnableWhenExpression(extensions),
      "enable-when",
    );

    this.initial = this.createSlot(
      extractInitialExpression(extensions),
      "initial",
    );

    this.calculated = this.createSlot(
      extractCalculatedExpression(extensions),
      "calculated",
    );

    if (type) {
      this.minValue = this.createSlot(
        extractMinValueExpression(extensions, type),
        "min-value",
      );

      this.maxValue = this.createSlot(
        extractMaxValueExpression(extensions, type),
        "max-value",
      );
    }
  }

  private createSlot(
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
  get issues(): OperationOutcomeIssue[] {
    return this.registrationIssues.concat(
      this.slots
        .map((slot) => slot.error)
        .filter((issue): issue is OperationOutcomeIssue => issue !== undefined),
    );
  }
}
