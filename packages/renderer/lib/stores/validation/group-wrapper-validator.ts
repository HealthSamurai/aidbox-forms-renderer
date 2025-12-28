import { computed, makeObservable } from "mobx";
import type { OperationOutcomeIssue } from "fhir/r5";

import { formatString, groupHasResponses, makeIssue } from "../../utils.ts";
import type { INodeValidator, IGroupWrapper } from "../../types.ts";
import { strings } from "../../strings.ts";

export class GroupWrapperValidator implements INodeValidator {
  private readonly wrapper: IGroupWrapper;

  constructor(wrapper: IGroupWrapper) {
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
          formatString(strings.validation.groupWrapper.minOccurs, {
            minOccurs: wrapper.minOccurs,
          }),
        ),
      );
    }

    if (wrapper.maxOccurs != null && occurs > wrapper.maxOccurs) {
      issues.push(
        makeIssue(
          "structure",
          formatString(strings.validation.groupWrapper.maxOccurs, {
            maxOccurs: wrapper.maxOccurs,
          }),
        ),
      );
    }

    return issues;
  }
}
