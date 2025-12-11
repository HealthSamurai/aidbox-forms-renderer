import { computed, makeObservable } from "mobx";
import type { OperationOutcomeIssue } from "fhir/r5";

import { makeIssue } from "../../utils.ts";
import type { IGroupNode, INodeValidator } from "../../types.ts";

export class GroupValidator implements INodeValidator {
  private readonly group: IGroupNode;

  constructor(group: IGroupNode) {
    this.group = group;

    makeObservable(this);
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    if (this.group.readOnly || !this.group.isEnabled) {
      return [];
    }

    const shouldValidate =
      this.group.form.isSubmitAttempted || this.group.isDirty;
    if (!shouldValidate || this.group.minOccurs === 0) {
      return [];
    }

    const hasResponses = this.group.nodes.some(
      (child) => child.responseItems.length > 0,
    );

    if (hasResponses) {
      return [];
    }

    return [
      makeIssue("required", "At least one answer is required in this group."),
    ];
  }
}
