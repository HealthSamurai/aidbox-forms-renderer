import type { QuestionnaireItem } from "fhir/r5";
import {GroupItem} from "./group-item";
import {DisplayItem} from "./display-item";
import {AttachmentItem} from "./attachment-item";
import {BooleanItem} from "./boolean-item";
import {CodingItem} from "./coding-item";
import {NumberItem} from "./number-item";
import {QuantityItem} from "./quantity-item";
import {ReferenceItem} from "./reference-item";
import {StringItem} from "./string-item";
import {TemporalItem} from "./temporal-item";
import {TextItem} from "./text-item";

interface ItemProps {
  item: QuestionnaireItem;
}

export function Item({ item }: ItemProps) {
  switch (item.type) {
    case "group":
      return <GroupItem item={item} />;
    case "display":
      return <DisplayItem item={item} />;
    case "boolean":
      return <BooleanItem item={item} />;
    case "integer":
    case "decimal":
      return <NumberItem item={item} />;
    case "date":
    case "dateTime":
    case "time":
      return <TemporalItem item={item} />;
    case "text":
      return <TextItem item={item} />;
    case "string":
    case "question":
    case "url":
      return <StringItem item={item} />;
    case "coding":
      return <CodingItem item={item} />;
    case "attachment":
      return <AttachmentItem item={item} />;
    case "reference":
      return <ReferenceItem item={item} />;
    case "quantity":
      return <QuantityItem item={item} />;
  }
}

export {
  GroupItem,
  DisplayItem,
  AttachmentItem,
  BooleanItem,
  CodingItem,
  NumberItem,
  QuantityItem,
  ReferenceItem,
  StringItem,
  TemporalItem,
  TextItem,
};
