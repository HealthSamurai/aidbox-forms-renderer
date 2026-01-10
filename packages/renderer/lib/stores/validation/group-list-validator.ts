import { computed, makeObservable } from "mobx";
import type { OperationOutcomeIssue } from "fhir/r5";

import { formatString, groupHasResponses, makeIssue } from "../../utils.ts";
import type { INodeValidator, IGroupList } from "../../types.ts";
import { strings } from "../../strings.ts";

export class GroupListValidator implements INodeValidator {
  private readonly list: IGroupList;

  constructor(list: IGroupList) {
    this.list = list;

    makeObservable(this);
  }

  @computed
  get issues(): OperationOutcomeIssue[] {
    const list = this.list;

    if (list.readOnly || !list.isEnabled) {
      return [];
    }

    const shouldValidate =
      list.form.isSubmitAttempted || list.nodes.some((node) => node.isDirty);
    if (!shouldValidate) {
      return [];
    }

    const occurs = list.nodes.filter(groupHasResponses).length;
    const issues: OperationOutcomeIssue[] = [];

    if (list.minOccurs > 0 && occurs < list.minOccurs) {
      issues.push(
        makeIssue(
          "required",
          formatString(strings.validation.groupList.minOccurs, {
            minOccurs: list.minOccurs,
          }),
        ),
      );
    }

    if (list.maxOccurs != null && occurs > list.maxOccurs) {
      issues.push(
        makeIssue(
          "structure",
          formatString(strings.validation.groupList.maxOccurs, {
            maxOccurs: list.maxOccurs,
          }),
        ),
      );
    }

    return issues;
  }
}
