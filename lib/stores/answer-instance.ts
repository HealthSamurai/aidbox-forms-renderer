import { nanoid } from "nanoid";
import { action, computed, makeObservable, observable } from "mobx";
import type {
  AnswerableQuestionType,
  AnswerValueFor,
  IAnswerInstance,
  INodeScope,
  INodeStore,
  IQuestionStore,
} from "./types.ts";
import type {
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r5";

export class AnswerInstance<TType extends AnswerableQuestionType>
  implements IAnswerInstance<AnswerValueFor<TType>>
{
  readonly key = nanoid();
  readonly path: string;
  readonly parentScope: INodeScope | undefined;

  private readonly question: IQuestionStore<TType>;

  @observable.shallow
  readonly registry: Map<string, INodeStore> | undefined;

  @observable.ref
  value: AnswerValueFor<TType> | null = null;

  @observable.shallow
  readonly children = observable.array<INodeStore>([], { deep: false });

  constructor(
    question: IQuestionStore<TType>,
    index: number,
    initial: AnswerValueFor<TType> | null = null,
    responseItems: QuestionnaireResponseItem[] = [],
  ) {
    makeObservable(this);

    this.path = question.repeats ? `${question.path}/${index}` : question.path;
    this.parentScope = question;
    this.question = question;

    if (question.repeats) {
      this.registry = observable.map<string, INodeStore>({}, { deep: false });
    }

    const children =
      question.template.item?.map((item) =>
        question.form.createNodeStore(
          item,
          question,
          this,
          this.path,
          responseItems.filter(({ linkId }) => linkId === item.linkId),
        ),
      ) ?? [];

    this.children.replace(children);
    this.value = initial;
  }

  @action
  registerStore(node: INodeStore) {
    if (this.registry) {
      this.registry.set(node.linkId, node);
    } else {
      this.parentScope?.registerStore(node);
    }
  }

  lookupStore(linkId: string) {
    return this.registry?.get(linkId) ?? this.parentScope?.lookupStore(linkId);
  }

  @computed
  get responseAnswer(): QuestionnaireResponseItemAnswer | null {
    const valueFragment = this.buildValueFragment();
    const childItems = this.children.flatMap((child) => child.responseItems);

    const hasValue = Object.keys(valueFragment).length > 0;
    const hasChildren = childItems.length > 0;

    if (!hasValue && !hasChildren) {
      return null;
    }

    const result: QuestionnaireResponseItemAnswer = { ...valueFragment };

    if (hasChildren) {
      result.item = childItems;
    }

    return result;
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
