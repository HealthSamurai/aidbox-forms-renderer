import * as React from "react";
import { addons, types, useStorybookState } from "storybook/manager-api";
import { SyntaxHighlighter } from "storybook/internal/components";
import type { QuestionnaireResponse } from "fhir/r5";

export function QuestionnaireResponsePanel() {
  const { storyId } = useStorybookState();
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const channel = addons.getChannel();

    const handleUpdate = (payload: {
      storyId: string;
      response: QuestionnaireResponse | undefined;
    }) => {
      if (payload.storyId && storyId && payload.storyId !== storyId) {
        return;
      }

      if (payload.response) {
        const encoded = JSON.stringify(payload.response, undefined, 2);
        setValue(encoded);
      } else {
        setValue("");
      }
    };

    channel.on("formbox/questionnaire-response/update", handleUpdate);
    channel.emit("formbox/questionnaire-response/request", { storyId });

    return () => {
      channel.off("formbox/questionnaire-response/update", handleUpdate);
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
        padding: "12px",
      }}
    >
      {value}
    </SyntaxHighlighter>
  );
}

addons.register("formbox/questionnaire-response", () => {
  addons.add(`formbox/questionnaire-response/panel`, {
    title: "Questionnaire Response",
    type: types.PANEL,
    render: ({ active }) =>
      active ? (
        <QuestionnaireResponsePanel
          key={`formbox/questionnaire-response/panel`}
        />
      ) : undefined,
  });
});
