import { autorun } from "mobx";
import { useEffect, useMemo } from "react";
import { addons } from "storybook/preview-api";
import { Node } from "../lib/components/form/node.tsx";
import { FormStore } from "../lib/stores/form/form-store.ts";
import { isQuestionNode } from "../lib/stores/nodes/questions/question-store.ts";
import type {
  AnswerType,
  AnswerTypeToDataType,
  DataTypeToType,
  IPresentableNode,
  IQuestionNode,
  QuestionItemControl,
} from "../lib/types.ts";
import {
  ANSWER_TYPE_TO_DATA_TYPE,
  asAnswerFragment,
  EXT,
  ITEM_CONTROL_SYSTEM,
} from "../lib/utils.ts";
import type {
  Extension,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
} from "fhir/r5";
import {
  QUESTIONNAIRE_RESPONSE_EVENT_ID,
  type QuestionnaireResponseEventPayload,
} from "../.storybook/addon-ids.ts";

import "../lib/components/form/form.css";

export type AnswerConstraintOption =
  | "optionsOnly"
  | "optionsOrType"
  | "optionsOrString";

export type PlaygroundArgsBase = {
  itemControl: QuestionItemControl | "none";
  repeats: boolean;
  hasAnswerOptions: boolean;
  answerConstraint: AnswerConstraintOption;
};

export const ITEM_CONTROL_OPTIONS: ReadonlyArray<
  PlaygroundArgsBase["itemControl"]
> = [
  "none",
  "autocomplete",
  "drop-down",
  "check-box",
  "lookup",
  "radio-button",
  "slider",
  "spinner",
  "text-box",
] as const;

export const ANSWER_CONSTRAINT_OPTIONS: ReadonlyArray<AnswerConstraintOption> =
  ["optionsOnly", "optionsOrType", "optionsOrString"] as const;

export const playgroundArgTypes = {
  itemControl: {
    name: "Item control",
    options: ITEM_CONTROL_OPTIONS,
    control: {
      type: "select",
      labels: {
        none: "None",
        autocomplete: "Autocomplete",
        "drop-down": "Drop-down",
        "check-box": "Check box",
        lookup: "Lookup",
        "radio-button": "Radio button",
        slider: "Slider",
        spinner: "Spinner",
        "text-box": "Text box",
      },
    },
    description: "Questionnaire itemControl extension (or none).",
  },
  repeats: {
    name: "Repeating question",
    control: { type: "boolean" },
    description: "Whether the question repeats.",
  },
  hasAnswerOptions: {
    name: "Has answer options",
    control: { type: "boolean" },
    description:
      "Include answerOption entries. Turn off to mimic 'without answer-options'.",
  },
  answerConstraint: {
    name: "Answer constraint",
    options: ANSWER_CONSTRAINT_OPTIONS,
    control: {
      type: "select",
      labels: {
        optionsOnly: "Options only",
        optionsOrType: "Options or type",
        optionsOrString: "Options or string",
      },
    },
    description:
      "Answer constraint profile; enabled only when options are present.",
    if: { arg: "hasAnswerOptions", truthy: true },
  },
} as const;

export type StoryArgs = {
  questionnaireSource: string;
};

export const baseParameters: NonNullable<{
  layout?: string;
  controls?: { exclude?: string[] };
}> = {
  layout: "padded",
  controls: { exclude: ["node"] },
};

export const baseArgTypes = {
  questionnaireSource: {
    control: { disable: true },
    table: { disable: true },
  },
} as const;

function makeItemControlExtension(control: QuestionItemControl): Extension {
  return {
    url: EXT.ITEM_CONTROL,
    valueCodeableConcept: {
      coding: [
        {
          system: ITEM_CONTROL_SYSTEM,
          code: control,
        },
      ],
    },
  };
}

export function buildQuestionItem<T extends AnswerType>(options: {
  linkId: string;
  text: string;
  type: T;
  control?: QuestionItemControl | undefined;
  answerConstraint?: QuestionnaireItem["answerConstraint"];
  answerOption?: QuestionnaireItemAnswerOption[] | undefined;
  repeats?: boolean | undefined;
  extensions?: Extension[] | undefined;
  item?: QuestionnaireItem[] | undefined;
}): QuestionnaireItem {
  const extensions = [...(options.extensions ?? [])];
  if (options.control) {
    extensions.push(makeItemControlExtension(options.control));
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
    answerOption:
      options.answerOption && options.answerOption.length > 0
        ? options.answerOption
        : undefined,
    answerConstraint: options.answerConstraint,
    extension: extensions.length > 0 ? extensions : undefined,
    item: options.item,
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

export function makeUnitOption(code: string, display?: string): Extension {
  return {
    url: EXT.QUESTIONNAIRE_UNIT_OPTION,
    valueCoding: {
      system: "http://unitsofmeasure.org",
      code,
      display: display ?? code,
    },
  };
}

export function createQuestionNode<T extends AnswerType>(
  template: Parameters<typeof buildQuestionItem<T>>[0],
): IQuestionNode<T> {
  const store = new FormStore({
    resourceType: "Questionnaire",
    status: "active",
    item: [buildQuestionItem(template)],
  });
  const node = store.nodes[0];

  if (!node || !isQuestionNode(node)) {
    throw new Error("Questionnaire did not produce a Question node.");
  }

  return node as IQuestionNode<T>;
}

function ResponseBroadcaster({ node }: { node: IPresentableNode }) {
  useEffect(() => {
    const channel = addons.getChannel();
    const dispose = autorun(() => {
      const payload: QuestionnaireResponseEventPayload = {
        response: node.form.response ?? null,
      };

      channel.emit(QUESTIONNAIRE_RESPONSE_EVENT_ID, payload);
    });

    return () => {
      dispose();
    };
  }, [node.form]);

  return null;
}

export function NodeShell({
  scenario,
  questionnaireSource,
  defaultSource,
}: {
  scenario: { name: string; title: string; build: () => IQuestionNode };
  questionnaireSource: string;
  defaultSource: string;
}) {
  const parsedSource = questionnaireSource || defaultSource;

  const { node, error } = useMemo(() => {
    try {
      const questionnaire = JSON.parse(parsedSource) as Questionnaire;
      if (questionnaire.resourceType !== "Questionnaire") {
        throw new Error("JSON is not a Questionnaire resource");
      }
      const store = new FormStore(questionnaire);
      const parsedNode = store.nodes[0];
      if (!parsedNode || !isQuestionNode(parsedNode)) {
        throw new Error(
          "Questionnaire must contain at least one question item.",
        );
      }
      return { node: parsedNode, error: null };
    } catch (err) {
      return {
        node: scenario.build(),
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }, [parsedSource, scenario]);

  return (
    <>
      <ResponseBroadcaster node={node as IPresentableNode} />
      <div className="af-form" style={{ maxWidth: 760 }}>
        <Node node={node as IPresentableNode} />
        {error ? (
          <p style={{ marginTop: "0.75rem", color: "#b91c1c" }}>
            Fell back to default questionnaire: {error}
          </p>
        ) : null}
      </div>
    </>
  );
}

function resolveConstraint(
  hasAnswerOptions: boolean,
  answerConstraint: AnswerConstraintOption,
): QuestionnaireItem["answerConstraint"] | undefined {
  if (!hasAnswerOptions) return undefined;
  return answerConstraint;
}

export function buildPlaygroundQuestionnaire<T extends AnswerType>({
  answerType,
  label,
  itemControl,
  repeats,
  hasAnswerOptions,
  answerConstraint,
  answerValues,
}: {
  answerType: T;
  label: string;
  itemControl: PlaygroundArgsBase["itemControl"];
  repeats: boolean;
  hasAnswerOptions: boolean;
  answerConstraint: AnswerConstraintOption;
  answerValues: Array<DataTypeToType<AnswerTypeToDataType<T>>>;
}): Questionnaire {
  const constraint = resolveConstraint(hasAnswerOptions, answerConstraint);
  const answerOption = hasAnswerOptions
    ? makeAnswerOptions(answerType, answerValues)
    : undefined;

  const question = buildQuestionItem({
    linkId: `${answerType}-playground`,
    text: label,
    type: answerType,
    repeats,
    control: itemControl === "none" ? undefined : itemControl,
    answerConstraint: constraint,
    answerOption,
  });

  return {
    resourceType: "Questionnaire",
    status: "active",
    item: [question],
  };
}

export function PlaygroundRenderer({
  questionnaire,
}: {
  questionnaire: Questionnaire;
}) {
  const store = useMemo(() => new FormStore(questionnaire), [questionnaire]);
  const node = store.nodes[0];

  if (!node) {
    return <p>Questionnaire did not produce a node.</p>;
  }

  return (
    <>
      <ResponseBroadcaster node={node as IPresentableNode} />
      <div className="af-form" style={{ maxWidth: 760 }}>
        <Node node={node as IPresentableNode} />
      </div>
    </>
  );
}
