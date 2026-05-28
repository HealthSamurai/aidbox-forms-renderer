import type { IFhirAdapter } from "../types.ts";
import {
  type FhirVersion,
  type QuestionnaireResponseItem,
  R4AttachmentAdapter,
  R4QuestionnaireItemAdapter,
  R4QuestionnaireResponseAdapter,
} from "@formbox/fhir";
import type { Model } from "fhirpath";
import r4Model from "fhirpath/fhir-context/r4/index.js";

export class R4Adapter implements IFhirAdapter {
  readonly version: FhirVersion = "r4";
  readonly attachment = new R4AttachmentAdapter();
  readonly questionnaireItem = new R4QuestionnaireItemAdapter();
  readonly questionnaireResponse = new R4QuestionnaireResponseAdapter();

  getFhirpathModel(): Model {
    return r4Model as Model;
  }

  getDefaultTerminologyServer(): string {
    return "https://tx.fhir.org/r4";
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
