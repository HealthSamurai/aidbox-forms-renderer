import { action, computed, makeObservable, observable } from "mobx";
import type {
  AnswerType,
  AnswerTypeToDataType,
  AnswerToken,
  DataTypeToType,
  IAnswer,
  IPresentableNode,
  IQuantityAnswer,
  IQuestionNode,
  IScope,
  SnapshotKind,
  ValueBounds,
} from "../../types.ts";
import type {
  OperationOutcomeIssue,
  QuestionnaireResponseItemAnswer,
  QuestionnaireResponseItem,
} from "@formbox/fhir";
import type { NodePath } from "@formbox/theme";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  areValuesEqual,
  asAnswerFragment,
  DATA_TYPE_TO_SUFFIX,
  EXT,
  extractExtensionValue,
  getIssueMessage,
  shouldCreateStore,
  withLastPathIndex,
} from "../../utilities.ts";
import { AnswerValidator } from "./answer-validator.ts";
import { QuantityAnswer } from "./view-model/quantity-answer.ts";

export class AnswerStore<T extends AnswerType> implements IAnswer<T> {
  readonly token: AnswerToken;
  readonly scope: IScope;

  readonly question: IQuestionNode<T>;
  private readonly validator: AnswerValidator<T>;

  @observable
  private pathIndex = 0;

  @action
  setValueByUser(value?: DataTypeToType<AnswerTypeToDataType<T>>): void {
    this._value = value === "" ? undefined : value;
    this.explicitWeight = undefined;
    this.question.markDirty();
    this.question.markUserOverridden();
  }

  @action
  setValueBySystem(next?: DataTypeToType<AnswerTypeToDataType<T>>): void {
    this._value = next;
    this.explicitWeight = undefined;
    this.question.markDirty();
  }

  @observable.ref
  private _value: DataTypeToType<AnswerTypeToDataType<T>> | undefined =
    undefined;

  @observable.ref
  private explicitWeight: number | undefined = undefined;

  readonly nodes = observable.array<IPresentableNode>([], {
    deep: false,
    name: "AnswerStore.nodes",
  });

  constructor(
    question: IQuestionNode<T>,
    pathIndex: number,
    scope: IScope,
    token: AnswerToken,
    initial: DataTypeToType<AnswerTypeToDataType<T>> | undefined,
    responseItems: QuestionnaireResponseItem[] = [],
    responseAnswer?: QuestionnaireResponseItemAnswer,
  ) {
    makeObservable(this);

    this.token = token;
    this.pathIndex = pathIndex;
    this.scope = scope.extend(question.repeats);
    this.question = question;

    const children =
      question.template.item
        ?.filter((item) => shouldCreateStore(item, question.adapter))
        .map((item) =>
          question.form.createNodeStore(
            item,
            question,
            this,
            this.scope,
            responseItems,
          ),
        ) ?? [];

    this.nodes.replace(children);
    this._value = initial;
    this.explicitWeight = this.extractWeightFromResponseAnswer(responseAnswer);
    this.validator = new AnswerValidator(
      this as IAnswer<T>,
      this.question as IQuestionNode<T>,
    );
  }

  @computed({ keepAlive: true })
  get path(): NodePath {
    return this.question.repeats
      ? withLastPathIndex(this.question.path, this.pathIndex)
      : this.question.path;
  }

  @action
  setPathIndex(index: number): void {
    this.pathIndex = index;
  }

  @computed.struct
  get responseAnswer(): QuestionnaireResponseItemAnswer | undefined {
    return this.buildAnswerSnapshot("response");
  }

  @computed.struct
  get expressionAnswer(): QuestionnaireResponseItemAnswer | undefined {
    return this.buildAnswerSnapshot("expression");
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    return this.validator.issues.filter(
      (issue) => getIssueMessage(issue) !== undefined,
    );
  }

  @computed.struct
  get bounds(): ValueBounds<T> {
    return this.validator.bounds;
  }

  private buildAnswerSnapshot(
    kind: SnapshotKind,
  ): QuestionnaireResponseItemAnswer | undefined {
    const { value } = this;

    const childItems =
      kind === "response"
        ? this.nodes.flatMap((child) => child.responseItems)
        : this.nodes.flatMap((child) => child.expressionItems);

    if (value == undefined && childItems.length === 0) {
      return undefined;
    }

    const answer: QuestionnaireResponseItemAnswer = {};

    if (value != undefined) {
      Object.assign(
        answer,
        this.question.answerOption.constraint === "optionsOrString" &&
          typeof value === "string"
          ? asAnswerFragment("string", value)
          : asAnswerFragment(
              ANSWER_TYPE_TO_DATA_TYPE[this.question.type],
              value,
            ),
      );
    }

    if (childItems.length > 0) {
      answer.item = childItems;
    }

    this.attachItemWeight(answer, kind);

    return answer;
  }

  @computed
  private get optionWeight(): number | undefined {
    const value = this.value;
    if (value == undefined) {
      return undefined;
    }

    return this.question.answerOption.inherentOptions.find((option) => {
      if (option.value == undefined || option.weight == undefined) {
        return false;
      }

      return areValuesEqual(this.question.dataType, option.value, value);
    })?.weight;
  }

  @computed
  private get resolvedWeight(): number | undefined {
    return this.optionWeight ?? this.explicitWeight;
  }

  private attachItemWeight(
    answer: QuestionnaireResponseItemAnswer,
    kind: SnapshotKind,
  ): void {
    const coding = answer.valueCoding;
    if (kind === "response" && coding?.extension != undefined) {
      const extension = coding.extension.filter(
        (entry) =>
          entry.url !== EXT.ITEM_WEIGHT && entry.url !== EXT.ORDINAL_VALUE,
      );

      answer.valueCoding = {
        ...coding,
        extension: extension.length > 0 ? extension : undefined,
      };
    }

    const weight =
      kind === "expression" && this.question.expressionRegistry.answer
        ? this.explicitWeight
        : this.resolvedWeight;
    if (weight == undefined) {
      return;
    }

    const extension = {
      url: EXT.ITEM_WEIGHT,
      valueDecimal: weight,
    };

    answer.extension = [
      ...(answer.extension ?? []).filter(
        (entry) =>
          entry.url !== EXT.ITEM_WEIGHT && entry.url !== EXT.ORDINAL_VALUE,
      ),
      extension,
    ];

    if (kind !== "expression" || coding == undefined) {
      return;
    }

    answer.valueCoding = {
      ...coding,
      extension: [
        ...(coding.extension ?? []).filter(
          (entry) =>
            entry.url !== EXT.ITEM_WEIGHT && entry.url !== EXT.ORDINAL_VALUE,
        ),
        extension,
      ],
    };
  }

  private extractWeightFromResponseAnswer(
    answer: QuestionnaireResponseItemAnswer | undefined,
  ): number | undefined {
    if (!answer) {
      return undefined;
    }

    const fromAnswerExtension =
      extractExtensionValue("decimal", answer, EXT.ITEM_WEIGHT) ??
      extractExtensionValue("decimal", answer, EXT.ORDINAL_VALUE);
    if (fromAnswerExtension != undefined) {
      return fromAnswerExtension;
    }

    const fromCoding =
      extractExtensionValue("decimal", answer.valueCoding, EXT.ITEM_WEIGHT) ??
      extractExtensionValue("decimal", answer.valueCoding, EXT.ORDINAL_VALUE);
    if (fromCoding != undefined) {
      return fromCoding;
    }

    const suffix = DATA_TYPE_TO_SUFFIX[this.question.dataType];
    const valueElement = (answer as Record<string, unknown>)[
      `_value${suffix}`
    ] as
      | {
          extension?: QuestionnaireResponseItemAnswer["extension"];
        }
      | undefined;

    return (
      extractExtensionValue("decimal", valueElement, EXT.ITEM_WEIGHT) ??
      extractExtensionValue("decimal", valueElement, EXT.ORDINAL_VALUE)
    );
  }

  @action
  dispose(): void {
    const children = [...this.nodes];
    this.nodes.clear();
    children.forEach((child) => child.dispose());
  }

  get value(): DataTypeToType<AnswerTypeToDataType<T>> | undefined {
    return this._value;
  }

  @computed({ keepAlive: true })
  get quantity(): IQuantityAnswer {
    return new QuantityAnswer(this as unknown as IAnswer<"quantity">);
  }
}
