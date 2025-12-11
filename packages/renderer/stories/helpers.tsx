import type { IForm } from "../lib/types.ts";
import { useEffect } from "react";
import { addons } from "storybook/preview-api";
import { autorun } from "mobx";
import type { Questionnaire } from "fhir/r5";

export function useQuestionnaireResponseBroadcaster(
  form: IForm,
  storyId: string,
) {
  useEffect(() => {
    if (!storyId) return;
    const channel = addons.getChannel();

    const handleRequest = ({ storyId: requestId }: { storyId?: string }) => {
      if (requestId === storyId) {
        channel.emit(`aidbox/questionnaire-response/update`, {
          storyId: storyId,
          response: form.response,
        });
      }
    };

    channel.on("aidbox/questionnaire-response/request", handleRequest);

    const dispose = autorun(() => {
      channel.emit(`aidbox/questionnaire-response/update`, {
        storyId: storyId,
        response: form.response,
      });
    });

    return () => {
      dispose();
      channel.off(`aidbox/questionnaire-response/request`, handleRequest);
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

    channel.emit(`aidbox/questionnaire/update`, { storyId, questionnaire });

    const handleRequest = ({ storyId: requestId }: { storyId?: string }) => {
      if (requestId === storyId) {
        channel.emit(`aidbox/questionnaire/update`, { storyId, questionnaire });
      }
    };

    channel.on(`aidbox/questionnaire/request`, handleRequest);
    return () => {
      channel.off(`aidbox/questionnaire/request`, handleRequest);
    };
  }, [questionnaire, storyId]);
}
