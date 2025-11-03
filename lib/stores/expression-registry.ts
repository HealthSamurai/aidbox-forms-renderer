import { EvaluationCoordinator } from "./evaluation-coordinator.ts";
import {
  AnswerType,
  ExpressionSlotKind,
  IExpressionEnvironmentProvider,
  IExpressionSlot,
  IScope,
  TargetConstraintDefinition,
} from "./types.ts";
import type { Element, Expression, OperationOutcomeIssue } from "fhir/r5";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  EXT,
  extractExtensionsValues,
  extractExtensionValue,
  extractExtensionValueElement,
  findExtensions,
  makeIssue,
} from "../utils.ts";
import { ExpressionSlot } from "./expression-slot.ts";
import { ConstraintSlot } from "./constraint-slot.ts";
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

  @observable.shallow
  readonly constraints = observable.array<ConstraintSlot>([], {
    deep: false,
    name: "ExpressionRegistry.constraints",
  });

  readonly enableWhen: IExpressionSlot | undefined;
  readonly initial: IExpressionSlot | undefined;
  readonly calculated: IExpressionSlot | undefined;
  readonly minValue: IExpressionSlot | undefined;
  readonly maxValue: IExpressionSlot | undefined;

  constructor(
    private coordinator: EvaluationCoordinator,
    private scope: IScope,
    private environmentProvider: IExpressionEnvironmentProvider,
    element: Element,
    type?: AnswerType | undefined,
  ) {
    makeObservable(this);

    if (element.extension) {
      extractExtensionsValues(element, EXT.SDC_VARIABLE, "Expression").forEach(
        (expression) => {
          this.createSlot(expression, "variable");
        },
      );

      this.enableWhen = this.createSlot(
        extractExtensionValue(element, EXT.SDC_ENABLE_WHEN_EXPR, "Expression"),
        "enable-when",
      );

      this.initial = this.createSlot(
        extractExtensionValue(element, EXT.SDC_INITIAL_EXPR, "Expression"),
        "initial",
      );

      this.calculated = this.createSlot(
        extractExtensionValue(element, EXT.SDC_CALCULATED_EXPR, "Expression"),
        "calculated",
      );

      if (type) {
        this.minValue = this.createSlot(
          extractExtensionValue(
            extractExtensionValueElement(
              element,
              EXT.MIN_VALUE,
              ANSWER_TYPE_TO_DATA_TYPE[type],
            ),
            EXT.CQF_EXPRESSION,
            "Expression",
          ),
          "min-value",
        );

        this.maxValue = this.createSlot(
          extractExtensionValue(
            extractExtensionValueElement(
              element,
              EXT.MAX_VALUE,
              ANSWER_TYPE_TO_DATA_TYPE[type],
            ),
            EXT.CQF_EXPRESSION,
            "Expression",
          ),
          "max-value",
        );
      }

      const definitions = findExtensions(element, EXT.TARGET_CONSTRAINT).map(
        (extension): TargetConstraintDefinition => ({
          key: extractExtensionValue(extension, "key", "id"),
          severity: extractExtensionValue(extension, "severity", "code") as
            | "error"
            | "warning",
          human: extractExtensionValue(extension, "human", "string"),
          expression: extractExtensionValue(
            extension,
            "expression",
            "Expression",
          ),
          location: extractExtensionValue(extension, "location", "string"),
          requirements: extractExtensionValue(
            extension,
            "requirements",
            "markdown",
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
