import { computed, makeObservable, observable } from "mobx";
import type {
  AnswerType,
  AnswerValueType,
  IAnswerInstance,
  IScope,
  ICoreNode,
  IQuestionNode,
  SnapshotKind,
} from "./types.ts";
import type {
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";
import { shouldCreateStore } from "../utils.ts";

export class AnswerInstance<TType extends AnswerType>
  implements IAnswerInstance<AnswerValueType<TType>>
{
  readonly key: string;
  readonly scope: IScope;

  private readonly question: IQuestionNode<TType>;

  @observable.ref
  value: AnswerValueType<TType> | null = null;

  @observable.shallow
  readonly nodes = observable.array<ICoreNode>([], {
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
      question.template.item
        ?.filter(shouldCreateStore)
        .map((item) =>
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
  }

  @computed.struct
  get responseAnswer(): QuestionnaireResponseItemAnswer | null {
    return this.buildAnswerSnapshot("response");
  }

  @computed.struct
  get expressionAnswer(): QuestionnaireResponseItemAnswer | null {
    return this.buildAnswerSnapshot("expression");
  }

  private buildAnswerSnapshot(
    kind: SnapshotKind,
  ): QuestionnaireResponseItemAnswer | null {
    const fragment = this.buildValueFragment();
    const hasValue = Object.keys(fragment).length > 0;
    const childItems =
      kind === "response"
        ? this.nodes.flatMap((child) => child.responseItems)
        : this.nodes.flatMap((child) => child.expressionItems);

    if (!hasValue && childItems.length === 0) {
      return null;
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
