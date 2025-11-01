import "./question-node.css";
import { observer } from "mobx-react-lite";
import { ItemHeader } from "../common/item-header.tsx";
import { ItemErrors } from "../common/item-errors.tsx";
import { IQuestionNode } from "../../stores/types.ts";

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
import { AnswerOptionNode } from "../questions/nodes/answer-option-node.tsx";

export const QuestionNode = observer(function QuestionNode({
  item,
}: {
  item: IQuestionNode;
}) {
  if ((item.template.answerOption?.length ?? 0) > 0) {
    return <AnswerOptionNode item={item} />;
  }

  switch (item.type) {
    case "string":
      return <StringNode item={item as IQuestionNode<"string">} />;
    case "text":
      return <TextNode item={item as IQuestionNode<"text">} />;
    case "integer":
      return <IntegerNode item={item as IQuestionNode<"integer">} />;
    case "decimal":
      return <DecimalNode item={item as IQuestionNode<"decimal">} />;
    case "date":
    case "dateTime":
    case "time":
      return (
        <DateLikeNode
          item={item as IQuestionNode<"date" | "dateTime" | "time">}
        />
      );
    case "quantity":
      return <QuantityNode item={item as IQuestionNode<"quantity">} />;
    case "boolean":
      return <BooleanNode item={item as IQuestionNode<"boolean">} />;
    case "url":
      return <UrlNode item={item as IQuestionNode<"url">} />;
    case "coding":
      return <CodingNode item={item as IQuestionNode<"coding">} />;
    case "attachment":
      return <AttachmentNode item={item as IQuestionNode<"attachment">} />;
    case "reference":
      return <ReferenceNode item={item as IQuestionNode<"reference">} />;
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
