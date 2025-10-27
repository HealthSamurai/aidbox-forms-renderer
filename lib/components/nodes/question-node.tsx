import "./question-node.css";
import { observer } from "mobx-react-lite";
import { ItemHeader } from "../common/item-header.tsx";
import { ItemErrors } from "../common/item-errors.tsx";
import { IQuestionStore } from "../../stores/types.ts";

import { StringNode } from "../questions/nodes/string-node.tsx";
import { TextNode } from "../questions/nodes/text-node.tsx";
import { IntegerNode } from "../questions/nodes/integer-node.tsx";
import { DecimalNode } from "../questions/nodes/decimal-node.tsx";
import { DateLikeNode } from "../questions/nodes/date-like-node.tsx";
import { QuantityNode } from "../questions/nodes/quantity-node.tsx";
import { BooleanNode } from "../questions/nodes/boolean-node.tsx";
import { UrlNode } from "../questions/nodes/url-node.tsx";
import { CodingNode } from "../questions/nodes/coding-node.tsx";
import { AttachmentNode } from "../questions/nodes/attachment-node.tsx";
import { ReferenceNode } from "../questions/nodes/reference-node.tsx";

export const QuestionNode = observer(function QuestionNode({
  item,
}: {
  item: IQuestionStore;
}) {
  switch (item.type) {
    case "string":
      return <StringNode item={item as IQuestionStore<"string">} />;
    case "text":
      return <TextNode item={item as IQuestionStore<"text">} />;
    case "integer":
      return <IntegerNode item={item as IQuestionStore<"integer">} />;
    case "decimal":
      return <DecimalNode item={item as IQuestionStore<"decimal">} />;
    case "date":
    case "dateTime":
    case "time":
      return (
        <DateLikeNode
          item={item as IQuestionStore<"date" | "dateTime" | "time">}
        />
      );
    case "quantity":
      return <QuantityNode item={item as IQuestionStore<"quantity">} />;
    case "boolean":
      return <BooleanNode item={item as IQuestionStore<"boolean">} />;
    case "url":
      return <UrlNode item={item as IQuestionStore<"url">} />;
    case "coding":
      return <CodingNode item={item as IQuestionStore<"coding">} />;
    case "attachment":
      return <AttachmentNode item={item as IQuestionStore<"attachment">} />;
    case "reference":
      return <ReferenceNode item={item as IQuestionStore<"reference">} />;
    default:
      return (
        <div className="af-item af-unsupported" data-linkid={item.linkId}>
          <ItemHeader item={item} />
          <div>
            Unsupported type: <code>{item.type}</code>
          </div>
          <ItemErrors item={item} />
        </div>
      );
  }
});
