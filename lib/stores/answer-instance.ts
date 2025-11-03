import { action, computed, makeObservable, observable } from "mobx";
import type {
  AnswerType,
  DataTypeToType,
  IAnswerInstance,
  IScope,
  IPresentableNode,
  IQuestionNode,
  SnapshotKind,
  AnswerTypeToDataType,
} from "./types.ts";
import type {
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  asAnswerFragment,
  shouldCreateStore,
} from "../utils.ts";
import type { OperationOutcomeIssue } from "fhir/r5";
import { AnswerValidator } from "./answer-validator.ts";

export class AnswerInstance<T extends AnswerType>
  implements IAnswerInstance<DataTypeToType<AnswerTypeToDataType<T>>>
{
  readonly key: string;
  readonly scope: IScope;

  readonly question: IQuestionNode<T>;
  private readonly validator: AnswerValidator<T>;

  @observable.ref
  value: DataTypeToType<AnswerTypeToDataType<T>> | null = null;

  @observable.shallow
  readonly nodes = observable.array<IPresentableNode>([], {
    deep: false,
    name: "AnswerInstance.nodes",
  });

  constructor(
    question: IQuestionNode<T>,
    scope: IScope,
    index: number,
    initial: DataTypeToType<AnswerTypeToDataType<T>> | null = null,
    responseItems: QuestionnaireResponseItem[] = [],
  ) {
    makeObservable(this);

    this.key = question.repeats ? `${question.key}_/_${index}` : question.key;
    this.scope = scope.extend(question.repeats);
    this.question = question;

    const children =
      question.template.item?.filter(shouldCreateStore).map((item) =>
        question.form.createNodeStore(
          item,
          question,
          this.scope,
          this.key,
          responseItems.filter(({ linkId }) => linkId === item.linkId),
        ),
      ) ?? [];

    this.nodes.replace(children);
    this.value = initial;
    this.validator = new AnswerValidator(
      this as IAnswerInstance<DataTypeToType<AnswerTypeToDataType<T>>>,
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

    const answer: QuestionnaireResponseItemAnswer =
      value == null
        ? {}
        : asAnswerFragment(ANSWER_TYPE_TO_DATA_TYPE[this.question.type], value);

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
}
