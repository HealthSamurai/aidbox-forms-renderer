import { useEffect, useMemo } from "react";
import { addons } from "storybook/preview-api";
import { autorun } from "mobx";
import type {
  Extension,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
} from "fhir/r5";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IForm,
  IPresentableNode,
  ItemControl,
  QuestionItemControl,
} from "@aidbox-forms/renderer/types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  asAnswerFragment,
  EXT,
  ITEM_CONTROL_SYSTEM,
} from "@aidbox-forms/renderer/utils.ts";
import { FormStore } from "@aidbox-forms/renderer/stores/form/form-store.ts";
import { Node } from "@aidbox-forms/renderer/components/form/node.tsx";
import type { Theme } from "@aidbox-forms/theme";
import { theme as hsTheme } from "@aidbox-forms/hs-theme";
import { theme as nshukTheme } from "@aidbox-forms/nshuk-theme";

export type ThemeId = "hs" | "nshuk";

export function resolveTheme(theme: ThemeId | undefined): Theme {
  if (theme === "nshuk") {
    return nshukTheme;
  }
  return hsTheme;
}

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

export type QuestionItemConfig<T extends AnswerType> = {
  linkId: string;
  text: string;
  type: T;
  control?: QuestionItemControl | undefined;
  answerConstraint?: QuestionnaireItem["answerConstraint"] | undefined;
  answerOption?: QuestionnaireItemAnswerOption[] | undefined;
  repeats?: boolean | undefined;
  readOnly?: boolean | undefined;
  initial?: QuestionnaireItem["initial"] | undefined;
  extensions?: Extension[] | undefined;
  item?: QuestionnaireItem[] | undefined;
};

export function buildQuestionItem<T extends AnswerType>(
  options: QuestionItemConfig<T>,
): QuestionnaireItem {
  const extensions = [...(options.extensions ?? [])];

  if (options.control) {
    extensions.push({
      url: EXT.ITEM_CONTROL,
      valueCodeableConcept: {
        coding: [
          {
            system: ITEM_CONTROL_SYSTEM,
            code: options.control,
          },
        ],
      },
    });
  }

  if (options.repeats) {
    extensions.push({
      url: EXT.MIN_OCCURS,
      valueInteger: 1,
    });
  }

  return {
    linkId: options.linkId,
    text: options.text,
    type: options.type,
    repeats: options.repeats,
    readOnly: options.readOnly,
    answerOption:
      options.answerOption && options.answerOption.length > 0
        ? options.answerOption
        : undefined,
    answerConstraint: options.answerConstraint,
    initial:
      options.initial && options.initial.length > 0
        ? options.initial
        : undefined,
    extension: extensions.length > 0 ? extensions : undefined,
    item: options.item && options.item.length > 0 ? options.item : undefined,
  };
}

export function buildDisplayItem(options: {
  linkId: string;
  text: string;
  control: ItemControl;
}): QuestionnaireItem {
  return {
    linkId: options.linkId,
    text: options.text,
    type: "display",
    extension: [
      {
        url: EXT.ITEM_CONTROL,
        valueCodeableConcept: {
          coding: [
            {
              system: ITEM_CONTROL_SYSTEM,
              code: options.control,
            },
          ],
        },
      },
    ],
  };
}

export function makeAnswerOptions<T extends AnswerType>(
  type: T,
  values: Array<DataTypeToType<AnswerTypeToDataType<T>>>,
): QuestionnaireItemAnswerOption[] {
  const dataType = ANSWER_TYPE_TO_DATA_TYPE[type];
  return values.map(
    (value) =>
      asAnswerFragment(dataType, value) as QuestionnaireItemAnswerOption,
  );
}

export function makeInitialValues<T extends AnswerType>(
  type: T,
  values: Array<DataTypeToType<AnswerTypeToDataType<T>>>,
): QuestionnaireItem["initial"] {
  const dataType = ANSWER_TYPE_TO_DATA_TYPE[type];
  return values.map((value) => asAnswerFragment(dataType, value));
}

export function buildQuestionnaire(item: QuestionnaireItem): Questionnaire {
  return {
    resourceType: "Questionnaire",
    status: "active",
    item: [item],
  };
}

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
    <div className="af-form" style={{ maxWidth: 760 }}>
      <Node node={node as IPresentableNode} />
    </div>
  );
}
