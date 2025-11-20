import * as React from "react";
import {
  addons,
  types,
  useStorybookApi,
  useStorybookState,
} from "storybook/manager-api";
import { Button, Form } from "storybook/internal/components";

const ADDON_ID = "aidbox/questionnaire";
const PANEL_ID = `${ADDON_ID}/panel`;
const ARG_KEY = "questionnaireSource";
type TextareaStyle = NonNullable<
  React.ComponentProps<typeof Form.Textarea>["style"]
>;

function QuestionnairePanel() {
  const api = useStorybookApi();
  const state = useStorybookState();
  const storyId = state.storyId;
  const storyData = storyId ? api.getData(storyId) : null;

  const storyEntry = storyData && storyData.type === "story" ? storyData : null;

  const currentArg = (storyEntry?.args?.[ARG_KEY] as string | undefined) ?? "";
  const initialArg =
    (storyEntry?.initialArgs?.[ARG_KEY] as string | undefined) ?? currentArg;

  const [value, setValue] = React.useState<string>(currentArg);

  React.useEffect(() => {
    setValue(currentArg);
  }, [currentArg]);

  const handleApply = () => {
    if (!storyEntry) return;
    api.updateStoryArgs(storyEntry, { [ARG_KEY]: value });
  };

  const handleReset = () => {
    if (!storyEntry) return;
    api.updateStoryArgs(storyEntry, { [ARG_KEY]: initialArg });
    setValue(initialArg);
  };

  const isDirty = React.useMemo(
    () => value !== currentArg,
    [value, currentArg],
  );

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
      <div style={{ display: "flex", gap: 12 }}>
        <Button
          type="button"
          onClick={handleApply}
          disabled={!isDirty}
          title="Apply edits to the current story"
        >
          Apply
        </Button>
        <Button
          type="button"
          onClick={handleReset}
          title="Reset to the story's default questionnaire"
        >
          Reset
        </Button>
      </div>
      <Form.Textarea
        aria-label="Questionnaire JSON"
        value={value}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          setValue(event.target.value)
        }
        spellCheck={false}
        style={{ flex: 1, maxHeight: "100%" } as unknown as TextareaStyle}
      />
    </div>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: "Questionnaire",
    type: types.PANEL,
    render: ({ active }) =>
      active ? <QuestionnairePanel key={PANEL_ID} /> : null,
  });
});

export {};
