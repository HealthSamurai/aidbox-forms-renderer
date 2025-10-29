import { QuestionnaireResponseItem } from "fhir/r5";
import { IDisplayStore } from "./types.ts";

import { AbstractNodeStore } from "./abstract-node-store.ts";
import { computed } from "mobx";

export class DisplayStore extends AbstractNodeStore implements IDisplayStore {
  override get type() {
    return super.type as "display";
  }

  @computed
  override get responseItems(): QuestionnaireResponseItem[] {
    if (!this.isEnabled) {
      return [];
    }

    const item: QuestionnaireResponseItem = {
      linkId: this.linkId,
      text: this.text,
    };

    return [item];
  }

  @computed
  override get expressionItems(): QuestionnaireResponseItem[] {
    const item: QuestionnaireResponseItem = {
      linkId: this.linkId,
      text: this.text,
    };

    return [item];
  }
}
