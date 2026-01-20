import * as React from "react";
import { addons, types, useStorybookState } from "storybook/manager-api";
import { SyntaxHighlighter } from "storybook/internal/components";
import type { Questionnaire } from "fhir/r5";

export function QuestionnairePanel() {
  const { storyId } = useStorybookState();
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const channel = addons.getChannel();

    const handleUpdate = (payload: {
      storyId: string;
      questionnaire: Questionnaire;
    }) => {
      if (payload.storyId && storyId && payload.storyId !== storyId) {
        return;
      }

      const encoded = JSON.stringify(payload.questionnaire, undefined, 2);
      setValue(encoded);
    };

    channel.on(`formbox/questionnaire/update`, handleUpdate);
    channel.emit(`formbox/questionnaire/request`, { storyId });

    return () => {
      channel.off(`formbox/questionnaire/update`, handleUpdate);
    };
  }, [storyId]);

  return (
    <SyntaxHighlighter
      language="json"
      showLineNumbers
      wrapLongLines
      customStyle={{
        flex: 1,
        margin: 0,
        fontSize: "13px",
        maxHeight: "100%",
        boxSizing: "border-box",
        padding: "13px",
      }}
    >
      {value}
    </SyntaxHighlighter>
  );
}

addons.register("formbox/questionnaire", () => {
  addons.add(`formbox/questionnaire/panel`, {
    title: "Questionnaire",
    type: types.PANEL,
    render: ({ active }) =>
      active ? (
        <QuestionnairePanel key={`formbox/questionnaire/panel`} />
      ) : undefined,
  });
});
