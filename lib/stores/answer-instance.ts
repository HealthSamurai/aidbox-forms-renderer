import { computed, makeObservable, observable } from "mobx";
import type {
  AnswerType,
  AnswerValueType,
  IAnswerInstance,
  IScope,
  IPresentableNode,
  IQuestionNode,
  SnapshotKind,
} from "./types.ts";
import type {
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";
import { asAnswerFragment, shouldCreateStore } from "../utils.ts";
import type { OperationOutcomeIssue } from "fhir/r5";
import { AnswerValidator } from "./answer-validator.ts";

export class AnswerInstance<TType extends AnswerType>
  implements IAnswerInstance<AnswerValueType<TType>>
{
  readonly key: string;
  readonly scope: IScope;

  readonly question: IQuestionNode<TType>;
  private readonly validator: AnswerValidator<TType>;

  @observable.ref
  value: AnswerValueType<TType> | null = null;

  @observable.shallow
  readonly nodes = observable.array<IPresentableNode>([], {
    deep: false,
    name: "AnswerInstance.nodes",
  });

  constructor(
    question: IQuestionNode<TType>,
    scope: IScope,
    index: number,
    initial: AnswerValueType<TType> | null = null,
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
      this as IAnswerInstance<AnswerValueType<TType>>,
      this.question as IQuestionNode<TType>,
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
      value == null ? {} : asAnswerFragment(this.question.type, value);

    if (childItems.length > 0) {
      answer.item = childItems;
    }

    return answer;
  }

  dispose(): void {
    const children = this.nodes.slice();
    this.nodes.clear();
    children.forEach((child) => child.dispose());
  }
}
