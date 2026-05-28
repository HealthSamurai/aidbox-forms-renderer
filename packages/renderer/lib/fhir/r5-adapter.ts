import type { IFhirAdapter } from "../types.ts";
import {
  type FhirVersion,
  type QuestionnaireResponseItem,
  R5AttachmentAdapter,
  R5QuestionnaireItemAdapter,
  R5QuestionnaireResponseAdapter,
} from "@formbox/fhir";
import type { Model } from "fhirpath";
import r5Model from "fhirpath/fhir-context/r5/index.js";

export class R5Adapter implements IFhirAdapter {
  readonly version: FhirVersion = "r5";
  readonly attachment = new R5AttachmentAdapter();
  readonly questionnaireItem = new R5QuestionnaireItemAdapter();
  readonly questionnaireResponse = new R5QuestionnaireResponseAdapter();

  getFhirpathModel(): Model {
    return r5Model as Model;
  }

  getDefaultTerminologyServer(): string {
    return "https://tx.fhir.org/r5";
  }

  withQuestionnaireResponseItemMeta(
    item: QuestionnaireResponseItem,
  ): QuestionnaireResponseItem {
    if (!Object.hasOwn(item, "__path__")) {
      Object.defineProperty(item, "__path__", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: {
          model: this.getFhirpathModel(),
          fhirNodeDataType: "QuestionnaireResponse.item",
          propName: "item",
          path: "QuestionnaireResponse.item",
          parentResNode: undefined,
          index: undefined,
        },
      });
    }

    return item;
  }
}
