import { Expression, OperationOutcomeIssue } from "fhir/r5";
import { action, computed, makeObservable, observable } from "mobx";
import {
  ExpressionSlotKind,
  IEvaluationCoordinator,
  IExpressionEnvironmentProvider,
  IExpressionSlot,
} from "./types.ts";
import { makeIssue } from "../utils.ts";
import fhirpath, { Model } from "fhirpath";
import r5 from "fhirpath/fhir-context/r5";

export class UnsupportedExpressionLanguageError extends Error {
  constructor(language: string | undefined) {
    super(`Unsupported expression language: ${language ?? "<missing>"}`);
  }
}

export class ExpressionSlot implements IExpressionSlot {
  readonly kind: ExpressionSlotKind;

  private readonly coordinator: IEvaluationCoordinator;
  private readonly expression: Expression;
  private readonly environmentProvider: IExpressionEnvironmentProvider;

  @observable.ref
  private _cycle: string[] | undefined;

  @observable.ref
  private _error: OperationOutcomeIssue | undefined;

  constructor(
    coordinator: IEvaluationCoordinator,
    environmentProvider: IExpressionEnvironmentProvider,
    kind: ExpressionSlotKind,
    expression: Expression,
  ) {
    makeObservable(this);

    this.coordinator = coordinator;
    this.expression = expression;
    this.kind = kind;
    this.environmentProvider = environmentProvider;
  }

  @computed
  get name() {
    return this.expression.name;
  }

  @computed
  get error() {
    if (!this._cycle && this._error === undefined) {
      void this.value;
    }

    if (this._cycle) {
      const message = `Failed to evaluate ${this.toString()} expression due to a dependency cycle`;
      return makeIssue("business-rule", message);
    } else {
      return this._error;
    }
  }

  @action
  private setError(error: OperationOutcomeIssue | undefined) {
    this._error = error;
  }

  @computed
  get value(): unknown {
    const expression = this.expression.expression?.trim();
    if (!expression) {
      this.setError(undefined);
      return undefined;
    }

    // Hand off to the coordinator so nested slot reads are tracked for cycles.
    return this.coordinator.trackEvaluation(this, () => {
      try {
        if (this.expression.language !== "text/fhirpath") {
          throw new UnsupportedExpressionLanguageError(
            this.expression.language,
          );
        }

        const result = fhirpath.evaluate(
          this.environmentProvider.expressionEnvironment.context,
          expression,
          this.environmentProvider.expressionEnvironment,
          r5 as Model,
        );

        this.setError(undefined);
        return result;
      } catch (error) {
        const message = `Failed to evaluate ${this.toString()} expression ${this.summarizeError(error)}`;
        console.warn("Unrecognized expression evaluation error:", error);

        this.setError(makeIssue("invalid", message));
        return undefined;
      }
    });
  }

  @action
  setCycleDetected(cycle: string[]) {
    // Store the chain so we can reflect the cycle after the coordinator unwinds.
    this._cycle = cycle;
  }

  @action
  clearCycleDetected() {
    this._cycle = undefined;
  }

  private summarizeError(error: unknown): string | undefined {
    const message = (
      error instanceof Error ? error.message : String(error)
    ).toLowerCase();

    if (message.includes("circular dependency")) {
      return "due to a dependency cycle";
    }
    if (message.includes("unsupported expression language")) {
      return "due to an unsupported expression language";
    }
    if (message.includes("undefined environment variable")) {
      return "because it references unavailable data";
    }
    if (message.includes("mismatched input")) {
      return "because the expression has a syntax error";
    }
    if (message.includes("not implemented")) {
      return "because it calls an unsupported function";
    }
    if (this._cycle) {
      return "due to a dependency cycle";
    }

    return "because it returned an error";
  }

  toString(): string {
    return `${this.kind}${this.expression.name ? ` "${this.expression.name}"` : ""}`;
  }
}
