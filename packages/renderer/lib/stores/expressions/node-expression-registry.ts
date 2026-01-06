import {
  AnswerOptionToggleDefinition,
  AnswerType,
  IEvaluationCoordinator,
  IExpressionEnvironmentProvider,
  IExpressionSlot,
  INodeExpressionRegistry,
  IScope,
} from "../../types.ts";
import type { QuestionnaireItem, QuestionnaireItemAnswerOption } from "fhir/r5";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  asAnswerFragment,
  EXT,
  extractExtensionsValues,
  extractExtensionValue,
  extractExtensionValueElement,
  findExtensions,
  makeIssue,
} from "../../utils.ts";
import { BaseExpressionRegistry } from "./base-expression-registry.ts";
import { observable } from "mobx";

export class NodeExpressionRegistry
  extends BaseExpressionRegistry
  implements INodeExpressionRegistry
{
  readonly enableWhen: IExpressionSlot | undefined;
  readonly initial: IExpressionSlot | undefined;
  readonly calculated: IExpressionSlot | undefined;
  readonly answer: IExpressionSlot | undefined;
  readonly minValue: IExpressionSlot | undefined;
  readonly maxValue: IExpressionSlot | undefined;
  readonly maxQuantity: IExpressionSlot | undefined;
  readonly minQuantity: IExpressionSlot | undefined;
  readonly minOccurs: IExpressionSlot | undefined;
  readonly maxOccurs: IExpressionSlot | undefined;
  readonly required: IExpressionSlot | undefined;

  readonly text: IExpressionSlot | undefined;
  readonly readOnly: IExpressionSlot | undefined;
  readonly repeats: IExpressionSlot | undefined;

  readonly answerOptionToggles = observable.array<AnswerOptionToggleDefinition>(
    [],
    {
      deep: false,
      name: "NodeExpressionRegistry.answerOptionToggles",
    },
  );

  constructor(
    coordinator: IEvaluationCoordinator,
    scope: IScope,
    environmentProvider: IExpressionEnvironmentProvider,
    element: QuestionnaireItem,
    type: AnswerType,
  ) {
    super(coordinator, scope, environmentProvider, element);

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

    this.answer = this.createSlot(
      extractExtensionValue(element, EXT.SDC_ANSWER_EXPR, "Expression"),
      "answer",
    );

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

    if (type === "quantity") {
      this.minQuantity = this.createSlot(
        extractExtensionValue(
          extractExtensionValue(element, EXT.SDC_MIN_QUANTITY, "Quantity"),
          EXT.CQF_EXPRESSION,
          "Expression",
        ),
        "min-quantity",
      );

      this.maxQuantity = this.createSlot(
        extractExtensionValue(
          extractExtensionValue(element, EXT.SDC_MAX_QUANTITY, "Quantity"),
          EXT.CQF_EXPRESSION,
          "Expression",
        ),
        "max-quantity",
      );
    }

    this.minOccurs = this.createSlot(
      extractExtensionValue(
        extractExtensionValueElement(element, EXT.MIN_OCCURS, "integer"),
        EXT.CQF_EXPRESSION,
        "Expression",
      ),
      "min-occurs",
    );

    this.maxOccurs = this.createSlot(
      extractExtensionValue(
        extractExtensionValueElement(element, EXT.MAX_OCCURS, "integer"),
        EXT.CQF_EXPRESSION,
        "Expression",
      ),
      "max-occurs",
    );

    this.required = this.createSlot(
      extractExtensionValue(
        element._required,
        EXT.CQF_EXPRESSION,
        "Expression",
      ),
      "required",
    );

    this.text = this.createSlot(
      extractExtensionValue(element._text, EXT.CQF_EXPRESSION, "Expression"),
      "text",
    );

    this.readOnly = this.createSlot(
      extractExtensionValue(
        element._readOnly,
        EXT.CQF_EXPRESSION,
        "Expression",
      ),
      "read-only",
    );
    this.repeats = this.createSlot(
      extractExtensionValue(element._repeats, EXT.CQF_EXPRESSION, "Expression"),
      "repeats",
    );

    findExtensions(element, EXT.SDC_ANSWER_OPTIONS_TOGGLE).forEach(
      (extension, extensionIndex) => {
        const options = extractExtensionsValues(
          extension,
          "option",
          ANSWER_TYPE_TO_DATA_TYPE[type],
        ).map((value) =>
          asAnswerFragment(ANSWER_TYPE_TO_DATA_TYPE[type], value),
        ) as QuestionnaireItemAnswerOption[];

        const expressionSlot =
          options.length > 0
            ? this.createSlot(
                extractExtensionValue(extension, "expression", "Expression"),
                "answer-option-toggle",
              )
            : undefined;

        if (expressionSlot) {
          this.answerOptionToggles.push({
            slot: expressionSlot,
            options,
          });
        } else {
          this.registrationIssues.push(
            makeIssue(
              "invalid",
              `Answer option toggle #${extensionIndex + 1} on item "${element.linkId ?? "<missing>"}" is missing an expression or an option.`,
            ),
          );
        }
      },
    );
  }
}
