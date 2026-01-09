import { useEffect, useMemo } from "react";
import { styled } from "@linaria/react";
import type { Questionnaire } from "fhir/r5";
import type { IPresentableNode } from "@aidbox-forms/renderer/types.ts";
import { FormStore } from "@aidbox-forms/renderer/stores/form/form-store.ts";
import { Node } from "@aidbox-forms/renderer/components/form/node.tsx";
import {
  useQuestionnaireBroadcaster,
  useQuestionnaireResponseBroadcaster,
} from "./story-channel-hooks.ts";

export function Renderer({
  questionnaire,
  storyId,
}: {
  questionnaire: Questionnaire;
  storyId: string;
}) {
  const store = useMemo(() => new FormStore(questionnaire), [questionnaire]);

  useEffect(() => () => store.dispose(), [store]);

  useQuestionnaireResponseBroadcaster(store, storyId);
  useQuestionnaireBroadcaster(questionnaire, storyId);

  const node = store.nodes[0];
  if (!node) {
    return <p>Questionnaire did not produce a node.</p>;
  }

  return (
    <FormContainer>
      <Node node={node as IPresentableNode} />
    </FormContainer>
  );
}

const FormContainer = styled.div`
  max-width: 760px;
`;
