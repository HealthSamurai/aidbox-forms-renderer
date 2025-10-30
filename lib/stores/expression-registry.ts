import { EvaluationCoordinator } from "./evaluation-coordinator.ts";
import {
  ExpressionSlotKind,
  IExpressionEnvironmentProvider,
  IExpressionSlot,
  IScope,
} from "./types.ts";
import { Expression, Extension, OperationOutcomeIssue } from "fhir/r5";
import { EXT, makeIssue } from "../utils.ts";
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
  ) {
    makeObservable(this);

    for (const extension of extensions || []) {
      if (extension.valueExpression) {
        switch (extension.url) {
          case EXT.SDC_VARIABLE:
            this.createSlot(extension.valueExpression, "variable");
            break;

          case EXT.SDC_ENABLE_WHEN_EXPR:
            this.enableWhen = this.ensureSingleSlot(
              this.enableWhen,
              extension,
              "enable-when",
            );
            break;

          case EXT.SDC_INITIAL_EXPR:
            this.initial = this.ensureSingleSlot(
              this.initial,
              extension,
              "initial",
            );
            break;

          case EXT.SDC_CALCULATED_EXPR:
            this.calculated = this.ensureSingleSlot(
              this.calculated,
              extension,
              "calculated",
            );
            break;

          case EXT.SDC_MIN_VALUE_EXPR:
            this.minValue = this.ensureSingleSlot(
              this.minValue,
              extension,
              "min-value",
            );
            break;

          case EXT.SDC_MAX_VALUE_EXPR:
            this.maxValue = this.ensureSingleSlot(
              this.maxValue,
              extension,
              "max-value",
            );
            break;
        }
      }
    }
  }

  private ensureSingleSlot(
    current: IExpressionSlot | undefined,
    extension: Extension,
    kind: ExpressionSlotKind,
  ): IExpressionSlot | undefined {
    if (current) {
      this.registrationIssues.push(
        makeIssue(
          "invalid",
          `Only one ${this.describeKind(kind)} extension is supported per item.`,
        ),
      );
      return current;
    }

    return this.createSlot(extension.valueExpression!, kind);
  }

  private describeKind(kind: ExpressionSlotKind) {
    switch (kind) {
      case "enable-when":
        return "enable-when";
      case "initial":
        return "initial";
      case "calculated":
        return "calculated";
      case "min-value":
        return "min-value";
      case "max-value":
        return "max-value";
      case "variable":
        return "variable";
    }
  }

  private createSlot(
    expression: Expression,
    kind: ExpressionSlotKind,
  ): IExpressionSlot {
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
