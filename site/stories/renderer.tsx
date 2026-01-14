import { useEffect, useMemo } from "react";
import { styled } from "@linaria/react";
import type { Questionnaire } from "fhir/r5";
import type { IPresentableNode } from "@aidbox-forms/renderer/types.ts";
import { FormStore } from "@aidbox-forms/renderer/store/form/form-store.ts";
import { Form } from "@aidbox-forms/renderer/component/form/form.tsx";
import { Node } from "@aidbox-forms/renderer/component/node/node.tsx";
import {
  useQuestionnaireBroadcaster,
  useQuestionnaireResponseBroadcaster,
} from "./story-channel-hooks.ts";

type RendererMode = "node" | "form";

export function Renderer({
  questionnaire,
  storyId,
  mode,
}: {
  questionnaire: Questionnaire;
  storyId: string;
  mode: RendererMode;
}) {
  const store = useMemo(() => new FormStore(questionnaire), [questionnaire]);

  useEffect(() => () => store.dispose(), [store]);

  useQuestionnaireResponseBroadcaster(store, storyId);
  useQuestionnaireBroadcaster(questionnaire, storyId);

  if (mode === "form") {
    return (
      <StoryFrame>
        <Form store={store} onSubmit={() => store.validateAll()} />
      </StoryFrame>
    );
  }

  if (store.nodes.length !== 1) {
    throw new Error(
      `Expected a single root node, but got ${store.nodes.length}.`,
    );
  }

  const node = store.nodes[0];
  return (
    <StoryFrame>
      <Node node={node as IPresentableNode} />
    </StoryFrame>
  );
}

const StoryFrame = styled.div`
  width: 100%;
  padding: 24px;
`;
