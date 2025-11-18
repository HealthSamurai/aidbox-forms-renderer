import { computed, makeObservable } from "mobx";
import type { OperationOutcomeIssue } from "fhir/r5";

import { groupHasResponses, makeIssue } from "../../utils.ts";
import type { INodeValidator, IRepeatingGroupWrapper } from "../../types.ts";

export class RepeatingGroupWrapperValidator implements INodeValidator {
  private readonly wrapper: IRepeatingGroupWrapper;

  constructor(wrapper: IRepeatingGroupWrapper) {
    this.wrapper = wrapper;

    makeObservable(this);
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    const wrapper = this.wrapper;

    if (wrapper.readOnly || !wrapper.isEnabled) {
      return [];
    }

    const shouldValidate =
      wrapper.form.isSubmitAttempted ||
      wrapper.nodes.some((node) => node.isDirty);
    if (!shouldValidate) {
      return [];
    }

    const occurs = wrapper.nodes.filter(groupHasResponses).length;
    const issues: OperationOutcomeIssue[] = [];

    if (wrapper.minOccurs > 0 && occurs < wrapper.minOccurs) {
      issues.push(
        makeIssue(
          "required",
          `At least ${wrapper.minOccurs} occurrence(s) required.`,
        ),
      );
    }

    if (wrapper.maxOccurs != null && occurs > wrapper.maxOccurs) {
      issues.push(
        makeIssue(
          "structure",
          `No more than ${wrapper.maxOccurs} occurrence(s) permitted.`,
        ),
      );
    }

    return issues;
  }
}
