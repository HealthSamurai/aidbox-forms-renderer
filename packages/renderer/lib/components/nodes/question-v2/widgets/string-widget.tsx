import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import type { IQuestionNode } from "../../../../types.ts";
import { WidgetScaffold } from "../widget-scaffold.tsx";
import { AnswerList } from "../answers/answer-list.tsx";
import { StringInput } from "../inputs/string-input.tsx";
import { TextInput } from "../inputs/text-input.tsx";
import { UrlInput } from "../inputs/url-input.tsx";
import type { AnswerRowRenderer } from "../answers/answer-row.tsx";

export const StringWidget = observer(function StringWidget({
  node,
}: {
  node: IQuestionNode<"string" | "text" | "url">;
}) {
  const renderRow = useMemo((): AnswerRowRenderer<
    "string" | "text" | "url"
  > => {
    if (node.type === "text") {
      return (rowProps) => (
        <TextInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      );
    }

    if (node.type === "url") {
      return (rowProps) => (
        <UrlInput
          inputId={rowProps.inputId}
          labelId={rowProps.labelId}
          describedById={rowProps.describedById}
          placeholder={node.placeholder}
          value={rowProps.value ?? ""}
          onChange={rowProps.setValue}
          disabled={node.readOnly}
        />
      );
    }

    return (rowProps) => (
      <StringInput
        inputId={rowProps.inputId}
        labelId={rowProps.labelId}
        describedById={rowProps.describedById}
        placeholder={node.placeholder}
        value={rowProps.value ?? ""}
        onChange={rowProps.setValue}
        disabled={node.readOnly}
        list={rowProps.list}
        inputMode={node.keyboardType}
      />
    );
  }, [node]);

  return (
    <WidgetScaffold
      node={node}
      body={<AnswerList node={node} renderRow={renderRow} />}
    />
  );
});
