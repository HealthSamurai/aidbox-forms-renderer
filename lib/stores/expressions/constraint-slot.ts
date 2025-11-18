import { computed, makeObservable } from "mobx";
import type { OperationOutcomeIssue } from "fhir/r5";

import type {
  IExpressionSlot,
  TargetConstraintDefinition,
} from "../../types.ts";
import { booleanify } from "../../utils.ts";

export class ConstraintSlot {
  readonly definition: TargetConstraintDefinition;
  private readonly slot: IExpressionSlot | undefined;

  constructor(definition: TargetConstraintDefinition, slot: IExpressionSlot) {
    this.definition = definition;
    this.slot = slot;

    makeObservable(this);
  }

  @computed.struct
  public get issue(): OperationOutcomeIssue | undefined {
    if (!this.slot) {
      return undefined;
    }

    const value = this.slot.value;

    if (value === undefined || value === null) {
      return undefined;
    }

    if (booleanify(value)) {
      return undefined;
    }

    const severity = this.definition.severity ?? "error";
    const message =
      this.definition.human && this.definition.human.length > 0
        ? this.definition.human
        : this.definition.key
          ? `Constraint "${this.definition.key}" was not satisfied.`
          : "Constraint was not satisfied.";

    const issue: OperationOutcomeIssue = {
      severity: severity === "warning" ? "warning" : "error",
      code: severity === "warning" ? "business-rule" : "invalid",
      diagnostics: message,
    };

    if (this.definition.location) {
      issue.expression = [this.definition.location];
    }

    return issue;
  }
}
