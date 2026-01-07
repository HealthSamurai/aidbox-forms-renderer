import { action, computed, makeObservable, observable } from "mobx";
import type {
  AnswerType,
  AnswerTypeToDataType,
  AnswerToken,
  DataTypeToType,
  IAnswerInstance,
  IPresentableNode,
  IQuantityAnswer,
  IQuestionNode,
  IScope,
  SnapshotKind,
  ValueBounds,
} from "../../../types.ts";
import type {
  OperationOutcomeIssue,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  asAnswerFragment,
  shouldCreateStore,
} from "../../../utils.ts";
import { AnswerValidator } from "../../validation/answer-validator.ts";
import { QuantityAnswer } from "./quantity-answer.ts";

export class AnswerInstance<
  T extends AnswerType,
> implements IAnswerInstance<T> {
  readonly token: AnswerToken;
  readonly scope: IScope;

  readonly question: IQuestionNode<T>;
  private readonly validator: AnswerValidator<T>;

  @action.bound
  setValueByUser(value: DataTypeToType<AnswerTypeToDataType<T>> | null): void {
    this._value = value === "" ? null : value;
    this.question.markDirty();
    this.question.markUserOverridden();
  }

  @action.bound
  setValueBySystem(next: DataTypeToType<AnswerTypeToDataType<T>> | null): void {
    this._value = next;
    this.question.markDirty();
  }

  @observable.ref
  private _value: DataTypeToType<AnswerTypeToDataType<T>> | null = null;

  readonly nodes = observable.array<IPresentableNode>([], {
    deep: false,
    name: "AnswerInstance.nodes",
  });

  constructor(
    question: IQuestionNode<T>,
    scope: IScope,
    token: AnswerToken,
    initial: DataTypeToType<AnswerTypeToDataType<T>> | null = null,
    responseItems: QuestionnaireResponseItem[] = [],
  ) {
    makeObservable(this);

    this.token = token;
    this.scope = scope.extend(question.repeats);
    this.question = question;

    const children =
      question.template.item
        ?.filter(shouldCreateStore)
        .map((item) =>
          question.form.createNodeStore(
            item,
            question,
            this.scope,
            this.token,
            responseItems,
          ),
        ) ?? [];

    this.nodes.replace(children);
    this._value = initial;
    this.validator = new AnswerValidator(
      this as IAnswerInstance<T>,
      this.question as IQuestionNode<T>,
    );
  }

  @computed.struct
  get responseAnswer(): QuestionnaireResponseItemAnswer | null {
    return this.buildAnswerSnapshot("response");
  }

  @computed.struct
  get expressionAnswer(): QuestionnaireResponseItemAnswer | null {
    return this.buildAnswerSnapshot("expression");
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    return this.validator.issues;
  }

  @computed.struct
  get bounds(): ValueBounds<T> {
    return this.validator.bounds;
  }

  private buildAnswerSnapshot(
    kind: SnapshotKind,
  ): QuestionnaireResponseItemAnswer | null {
    const { value } = this;

    const childItems =
      kind === "response"
        ? this.nodes.flatMap((child) => child.responseItems)
        : this.nodes.flatMap((child) => child.expressionItems);

    if (value == null && childItems.length === 0) {
      return null;
    }

    const answer: QuestionnaireResponseItemAnswer = {};

    if (value != null) {
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

    return answer;
  }

  @action
  dispose(): void {
    const children = this.nodes.slice();
    this.nodes.clear();
    children.forEach((child) => child.dispose());
  }

  get value(): DataTypeToType<AnswerTypeToDataType<T>> | null {
    return this._value;
  }

  @computed({ keepAlive: true })
  get quantity(): IQuantityAnswer {
    return new QuantityAnswer(this as unknown as IAnswerInstance<"quantity">);
  }
}
