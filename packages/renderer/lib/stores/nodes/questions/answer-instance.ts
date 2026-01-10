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
} from "../../../utilities.ts";
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
  setValueByUser(value?: DataTypeToType<AnswerTypeToDataType<T>>): void {
    this._value = value === "" ? undefined : value;
    this.question.markDirty();
    this.question.markUserOverridden();
  }

  @action.bound
  setValueBySystem(next?: DataTypeToType<AnswerTypeToDataType<T>>): void {
    this._value = next;
    this.question.markDirty();
  }

  @observable.ref
  private _value: DataTypeToType<AnswerTypeToDataType<T>> | undefined =
    undefined;

  readonly nodes = observable.array<IPresentableNode>([], {
    deep: false,
    name: "AnswerInstance.nodes",
  });

  constructor(
    question: IQuestionNode<T>,
    scope: IScope,
    token: AnswerToken,
    initial: DataTypeToType<AnswerTypeToDataType<T>> | undefined,
    responseItems: QuestionnaireResponseItem[] = [],
  ) {
    makeObservable(this);

    this.token = token;
    this.scope = scope.extend(question.repeats);
    this.question = question;

    const children =
      question.template.item
        ?.filter((item) => shouldCreateStore(item))
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
  get responseAnswer(): QuestionnaireResponseItemAnswer | undefined {
    return this.buildAnswerSnapshot("response");
  }

  @computed.struct
  get expressionAnswer(): QuestionnaireResponseItemAnswer | undefined {
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

    return answer;
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
    return new QuantityAnswer(this as unknown as IAnswerInstance<"quantity">);
  }
}
