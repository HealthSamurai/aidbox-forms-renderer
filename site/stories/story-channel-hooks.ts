import { useEffect } from "react";
import { addons } from "storybook/preview-api";
import { autorun } from "mobx";
import type { Questionnaire } from "fhir/r5";
import type { IForm } from "@formbox/renderer/types.ts";

export function useQuestionnaireResponseBroadcaster(
  form: IForm,
  storyId: string,
) {
  useEffect(() => {
    if (!storyId) return;
    const channel = addons.getChannel();

    const handleRequest = ({ storyId: requestId }: { storyId?: string }) => {
      if (requestId === storyId) {
        channel.emit(`formbox/questionnaire-response/update`, {
          storyId: storyId,
          response: form.response,
        });
      }
    };

    channel.on("formbox/questionnaire-response/request", handleRequest);

    const dispose = autorun(() => {
      channel.emit(`formbox/questionnaire-response/update`, {
        storyId: storyId,
        response: form.response,
      });
    });

    return () => {
      dispose();
      channel.off(`formbox/questionnaire-response/request`, handleRequest);
    };
  }, [form, storyId]);
}

export function useQuestionnaireBroadcaster(
  questionnaire: Questionnaire,
  storyId: string,
) {
  useEffect(() => {
    if (!storyId) return;
    const channel = addons.getChannel();

    channel.emit(`formbox/questionnaire/update`, { storyId, questionnaire });

    const handleRequest = ({ storyId: requestId }: { storyId?: string }) => {
      if (requestId === storyId) {
        channel.emit(`formbox/questionnaire/update`, {
          storyId,
          questionnaire,
        });
      }
    };

    channel.on(`formbox/questionnaire/request`, handleRequest);
    return () => {
      channel.off(`formbox/questionnaire/request`, handleRequest);
    };
  }, [questionnaire, storyId]);
}
