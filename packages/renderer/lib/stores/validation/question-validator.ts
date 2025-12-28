import { computed, makeObservable } from "mobx";
import type { OperationOutcomeIssue } from "fhir/r5";

import { answerHasContent, formatString, makeIssue } from "../../utils.ts";
import type { INodeValidator, IQuestionNode } from "../../types.ts";
import { strings } from "../../strings.ts";

export class QuestionValidator implements INodeValidator {
  private readonly question: IQuestionNode;

  constructor(question: IQuestionNode) {
    this.question = question;

    makeObservable(this);
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    if (this.question.readOnly || !this.question.isEnabled) {
      return [];
    }

    const shouldValidate =
      this.question.form.isSubmitAttempted || this.question.isDirty;
    if (!shouldValidate) {
      return [];
    }

    const issues: OperationOutcomeIssue[] = [];
    const answers = this.question.repeats
      ? this.question.answers
      : this.question.answers.slice(0, 1);
    const populatedAnswers = answers.filter(answerHasContent);

    if (
      this.question.minOccurs > 0 &&
      populatedAnswers.length < this.question.minOccurs
    ) {
      issues.push(
        makeIssue(
          "required",
          this.question.minOccurs === 1
            ? strings.validation.question.minOccursSingle
            : formatString(strings.validation.question.minOccursMultiple, {
                minOccurs: this.question.minOccurs,
              }),
        ),
      );
    }

    if (
      this.question.maxOccurs != null &&
      populatedAnswers.length > this.question.maxOccurs
    ) {
      issues.push(
        makeIssue(
          "structure",
          formatString(strings.validation.question.maxOccurs, {
            maxOccurs: this.question.maxOccurs,
          }),
        ),
      );
    }

    return issues;
  }
}
