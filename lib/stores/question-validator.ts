import { computed, makeObservable } from "mobx";
import type { OperationOutcomeIssue } from "fhir/r5";

import { answerHasContent, makeIssue } from "../utils.ts";
import type { INodeValidator, IQuestionNode } from "./types.ts";

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
    const populatedAnswers = this.question.answers.filter(answerHasContent);

    if (
      this.question.minOccurs > 0 &&
      populatedAnswers.length < this.question.minOccurs
    ) {
      issues.push(
        makeIssue(
          "required",
          this.question.minOccurs === 1
            ? "Answer is required."
            : `At least ${this.question.minOccurs} answers are required.`,
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
          `No more than ${this.question.maxOccurs} answers are permitted.`,
        ),
      );
    }

    return issues;
  }
}
