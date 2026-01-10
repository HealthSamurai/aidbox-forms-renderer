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
      extractExtensionValue("Expression", element, EXT.SDC_ENABLE_WHEN_EXPR),
      "enable-when",
    );

    this.initial = this.createSlot(
      extractExtensionValue("Expression", element, EXT.SDC_INITIAL_EXPR),
      "initial",
    );

    this.calculated = this.createSlot(
      extractExtensionValue("Expression", element, EXT.SDC_CALCULATED_EXPR),
      "calculated",
    );

    this.answer = this.createSlot(
      extractExtensionValue("Expression", element, EXT.SDC_ANSWER_EXPR),
      "answer",
    );

    this.minValue = this.createSlot(
      extractExtensionValue(
        "Expression",
        extractExtensionValueElement(
          ANSWER_TYPE_TO_DATA_TYPE[type],
          element,
          EXT.MIN_VALUE,
        ),
        EXT.CQF_EXPRESSION,
      ),
      "min-value",
    );

    this.maxValue = this.createSlot(
      extractExtensionValue(
        "Expression",
        extractExtensionValueElement(
          ANSWER_TYPE_TO_DATA_TYPE[type],
          element,
          EXT.MAX_VALUE,
        ),
        EXT.CQF_EXPRESSION,
      ),
      "max-value",
    );

    if (type === "quantity") {
      this.minQuantity = this.createSlot(
        extractExtensionValue(
          "Expression",
          extractExtensionValue("Quantity", element, EXT.SDC_MIN_QUANTITY),
          EXT.CQF_EXPRESSION,
        ),
        "min-quantity",
      );

      this.maxQuantity = this.createSlot(
        extractExtensionValue(
          "Expression",
          extractExtensionValue("Quantity", element, EXT.SDC_MAX_QUANTITY),
          EXT.CQF_EXPRESSION,
        ),
        "max-quantity",
      );
    }

    this.minOccurs = this.createSlot(
      extractExtensionValue(
        "Expression",
        extractExtensionValueElement("integer", element, EXT.MIN_OCCURS),
        EXT.CQF_EXPRESSION,
      ),
      "min-occurs",
    );

    this.maxOccurs = this.createSlot(
      extractExtensionValue(
        "Expression",
        extractExtensionValueElement("integer", element, EXT.MAX_OCCURS),
        EXT.CQF_EXPRESSION,
      ),
      "max-occurs",
    );

    this.required = this.createSlot(
      extractExtensionValue(
        "Expression",
        element._required,
        EXT.CQF_EXPRESSION,
      ),
      "required",
    );

    this.text = this.createSlot(
      extractExtensionValue("Expression", element._text, EXT.CQF_EXPRESSION),
      "text",
    );

    this.readOnly = this.createSlot(
      extractExtensionValue(
        "Expression",
        element._readOnly,
        EXT.CQF_EXPRESSION,
      ),
      "read-only",
    );
    this.repeats = this.createSlot(
      extractExtensionValue("Expression", element._repeats, EXT.CQF_EXPRESSION),
      "repeats",
    );

    findExtensions(element, EXT.SDC_ANSWER_OPTIONS_TOGGLE).forEach(
      (extension, extensionIndex) => {
        const options = extractExtensionsValues(
          ANSWER_TYPE_TO_DATA_TYPE[type],
          extension,
          "option",
        ).map((value) =>
          asAnswerFragment(ANSWER_TYPE_TO_DATA_TYPE[type], value),
        ) as QuestionnaireItemAnswerOption[];

        const expressionSlot =
          options.length > 0
            ? this.createSlot(
                extractExtensionValue("Expression", extension, "expression"),
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
