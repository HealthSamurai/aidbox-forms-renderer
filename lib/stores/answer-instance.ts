import { computed, makeObservable, observable } from "mobx";
import type {
  AnswerType,
  AnswerValueType,
  IAnswerInstance,
  IScope,
  INodeStore,
  IQuestionStore,
} from "./types.ts";
import type {
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";

export class AnswerInstance<TType extends AnswerType>
  implements IAnswerInstance<AnswerValueType<TType>>
{
  readonly key: string;
  readonly scope: IScope;

  private readonly question: IQuestionStore<TType>;

  @observable.ref
  value: AnswerValueType<TType> | null = null;

  @observable.shallow
  readonly children = observable.array<INodeStore>([], {
    deep: false,
    name: "AnswerInstance.children",
  });

  constructor(
    question: IQuestionStore<TType>,
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
      question.template.item?.map((item) =>
        question.form.createNodeStore(
          item,
          question,
          this.scope,
          this.key,
          responseItems.filter(({ linkId }) => linkId === item.linkId),
        ),
      ) ?? [];

    this.children.replace(children);
    this.value = initial;
  }

  @computed
  get responseAnswer(): QuestionnaireResponseItemAnswer | null {
    const fragment = this.buildValueFragment();
    const childItems = this.children.flatMap((child) => child.responseItems);
    const hasValue = Object.keys(fragment).length > 0;

    if (!hasValue && childItems.length === 0) {
      return null;
    }

    const answer: QuestionnaireResponseItemAnswer = { ...fragment };
    if (childItems.length > 0) {
      answer.item = childItems;
    }
    return answer;
  }

  @computed
  get expressionAnswer(): QuestionnaireResponseItemAnswer | undefined {
    const fragment = this.buildValueFragment();
    const hasValue = Object.keys(fragment).length > 0;
    const childItems = this.children.flatMap((child) => child.expressionItems);

    if (!hasValue && childItems.length === 0) {
      return undefined;
    }

    const answer: QuestionnaireResponseItemAnswer = { ...fragment };
    if (childItems.length > 0) {
      answer.item = childItems;
    }
    return answer;
  }

  private buildValueFragment(): Partial<QuestionnaireResponseItemAnswer> {
    const { value } = this;
    if (value == null) {
      return {};
    }

    switch (this.question.type) {
      case "boolean":
        return {
          valueBoolean:
            value as QuestionnaireResponseItemAnswer["valueBoolean"],
        };
      case "decimal":
        return {
          valueDecimal:
            value as QuestionnaireResponseItemAnswer["valueDecimal"],
        };
      case "integer":
        return {
          valueInteger:
            value as QuestionnaireResponseItemAnswer["valueInteger"],
        };
      case "date":
        return {
          valueDate: value as QuestionnaireResponseItemAnswer["valueDate"],
        };
      case "dateTime":
        return {
          valueDateTime:
            value as QuestionnaireResponseItemAnswer["valueDateTime"],
        };
      case "time":
        return {
          valueTime: value as QuestionnaireResponseItemAnswer["valueTime"],
        };
      case "string":
      case "text":
        return {
          valueString: value as QuestionnaireResponseItemAnswer["valueString"],
        };
      case "url":
        return {
          valueUri: value as QuestionnaireResponseItemAnswer["valueUri"],
        };
      case "coding":
        return {
          valueCoding: value as QuestionnaireResponseItemAnswer["valueCoding"],
        };
      case "attachment":
        return {
          valueAttachment:
            value as QuestionnaireResponseItemAnswer["valueAttachment"],
        };
      case "reference":
        return {
          valueReference:
            value as QuestionnaireResponseItemAnswer["valueReference"],
        };
      case "quantity":
        return {
          valueQuantity:
            value as QuestionnaireResponseItemAnswer["valueQuantity"],
        };
    }
  }
}
