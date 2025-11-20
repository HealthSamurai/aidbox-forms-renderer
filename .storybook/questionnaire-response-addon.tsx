import * as React from "react";
import { addons, types, useStorybookState } from "storybook/manager-api";
import { STORY_CHANGED } from "storybook/internal/core-events";
import { Form } from "storybook/internal/components";
import {
  QUESTIONNAIRE_RESPONSE_ADDON_ID,
  QUESTIONNAIRE_RESPONSE_EVENT_ID,
  QUESTIONNAIRE_RESPONSE_PANEL_ID,
  type QuestionnaireResponseEventPayload,
} from "./addon-ids.ts";

type TextareaStyle = NonNullable<
  React.ComponentProps<typeof Form.Textarea>["style"]
>;

function QuestionnaireResponsePanel() {
  const { storyId, viewMode } = useStorybookState();
  const [responseText, setResponseText] = React.useState("");

  React.useEffect(() => {
    const channel = addons.getChannel();

    const handleUpdate = (payload: QuestionnaireResponseEventPayload) => {
      if (payload.storyId && storyId && payload.storyId !== storyId) {
        return;
      }

      if (!payload.response) {
        setResponseText("");
        return;
      }

      setResponseText(JSON.stringify(payload.response, null, 2));
    };

    const handleStoryChange = () => setResponseText("");

    channel.on(QUESTIONNAIRE_RESPONSE_EVENT_ID, handleUpdate);
    channel.on(STORY_CHANGED, handleStoryChange);

    return () => {
      channel.off(QUESTIONNAIRE_RESPONSE_EVENT_ID, handleUpdate);
      channel.off(STORY_CHANGED, handleStoryChange);
    };
  }, [storyId]);

  const placeholder =
    viewMode === "docs"
      ? "QuestionnaireResponse is captured in the Canvas view."
      : "Interact with the form to see its QuestionnaireResponse.";

  return (
    <div
      style={{
        padding: 12,
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Form.Textarea
        readOnly
        aria-label="QuestionnaireResponse JSON"
        value={responseText}
        placeholder={placeholder}
        spellCheck={false}
        style={{ flex: 1, maxHeight: "100%" } as unknown as TextareaStyle}
      />
    </div>
  );
}

addons.register(QUESTIONNAIRE_RESPONSE_ADDON_ID, () => {
  addons.add(QUESTIONNAIRE_RESPONSE_PANEL_ID, {
    title: "Questionnaire Response",
    type: types.PANEL,
    render: ({ active }) =>
      active ? (
        <QuestionnaireResponsePanel key={QUESTIONNAIRE_RESPONSE_PANEL_ID} />
      ) : null,
  });
});

export {};
