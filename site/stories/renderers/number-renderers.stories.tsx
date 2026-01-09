import type { Meta, StoryObj } from "@storybook/react-vite";
import type {
  AnswerTypeToDataType,
  DataTypeToType,
} from "@aidbox-forms/renderer/types.ts";
import type { Extension, QuestionnaireItem } from "fhir/r5";
import {
  buildDisplayItem,
  buildQuestionItem,
  buildQuestionnaire,
  makeInitialValues,
} from "../helpers.tsx";
import { Renderer } from "../renderer.tsx";
import { EXT } from "@aidbox-forms/renderer/utils.ts";

type NumericType = "integer" | "decimal";

type NumberSliderArgs = {
  answerType: NumericType;
  repeats: boolean;
  readOnly: boolean;
  boundsMode: "none" | "min" | "max" | "minMax";
  minValue: number;
  maxValue: number;
  useStep: boolean;
  step: number;
  unitLabel: string;
  lowerLabel: string;
  upperLabel: string;
  initialValue: number | undefined;
};

type NumberSpinnerArgs = {
  answerType: NumericType;
  repeats: boolean;
  readOnly: boolean;
  boundsMode: "none" | "min" | "max" | "minMax";
  minValue: number;
  maxValue: number;
  unitLabel: string;
  placeholder: string;
  initialValue: number | undefined;
};

const numberTypes: NumericType[] = ["integer", "decimal"];

function buildNumberBoundExtension(
  type: NumericType,
  url: string,
  value: number,
): Extension {
  return type === "integer"
    ? { url, valueInteger: Math.round(value) }
    : { url, valueDecimal: value };
}

function buildNumberExtensions(args: {
  answerType: NumericType;
  boundsMode: "none" | "min" | "max" | "minMax";
  minValue: number;
  maxValue: number;
  unitLabel: string;
  placeholder?: string | undefined;
}): Extension[] {
  const extensions: Extension[] = [];

  if (args.boundsMode === "min" || args.boundsMode === "minMax") {
    extensions.push(
      buildNumberBoundExtension(args.answerType, EXT.MIN_VALUE, args.minValue),
    );
  }

  if (args.boundsMode === "max" || args.boundsMode === "minMax") {
    extensions.push(
      buildNumberBoundExtension(args.answerType, EXT.MAX_VALUE, args.maxValue),
    );
  }

  if (args.unitLabel.trim().length > 0) {
    extensions.push({
      url: EXT.QUESTIONNAIRE_UNIT,
      valueCoding: { display: args.unitLabel },
    });
  }

  if (args.placeholder && args.placeholder.trim().length > 0) {
    extensions.push({
      url: EXT.ENTRY_FORMAT,
      valueString: args.placeholder,
    });
  }

  return extensions;
}

function buildSliderStepExtension(type: NumericType, step: number): Extension {
  return type === "integer"
    ? { url: EXT.SLIDER_STEP_VALUE, valueInteger: Math.round(step) }
    : { url: EXT.SLIDER_STEP_VALUE, valueDecimal: step };
}

function buildInitialValues<T extends NumericType>(
  type: T,
  repeats: boolean,
  value: number | undefined,
): QuestionnaireItem["initial"] {
  if (value === undefined) {
    return [];
  }

  const base: Array<DataTypeToType<AnswerTypeToDataType<T>>> = [
    value as DataTypeToType<AnswerTypeToDataType<T>>,
  ];

  if (repeats) {
    const delta = type === "integer" ? 1 : 0.5;
    base.push((value + delta) as DataTypeToType<AnswerTypeToDataType<T>>);
  }

  return makeInitialValues(type, base);
}

function buildNumberSliderItem(args: NumberSliderArgs): QuestionnaireItem {
  const extensions = buildNumberExtensions({
    answerType: args.answerType,
    boundsMode: args.boundsMode,
    minValue: args.minValue,
    maxValue: args.maxValue,
    unitLabel: args.unitLabel,
  });

  if (args.useStep) {
    extensions.push(buildSliderStepExtension(args.answerType, args.step));
  }

  const items: QuestionnaireItem[] = [];
  if (args.lowerLabel.trim().length > 0) {
    items.push(
      buildDisplayItem({
        linkId: "lower-label",
        text: args.lowerLabel,
        control: "lower",
      }),
    );
  }
  if (args.upperLabel.trim().length > 0) {
    items.push(
      buildDisplayItem({
        linkId: "upper-label",
        text: args.upperLabel,
        control: "upper",
      }),
    );
  }

  return buildQuestionItem({
    linkId: "number-slider",
    text: `Number slider (${args.answerType})`,
    type: args.answerType,
    control: "slider",
    repeats: args.repeats,
    readOnly: args.readOnly,
    extensions,
    initial: buildInitialValues(
      args.answerType,
      args.repeats,
      args.initialValue,
    ),
    item: items,
  });
}

function buildNumberSpinnerItem(args: NumberSpinnerArgs): QuestionnaireItem {
  const extensions = buildNumberExtensions({
    answerType: args.answerType,
    boundsMode: args.boundsMode,
    minValue: args.minValue,
    maxValue: args.maxValue,
    unitLabel: args.unitLabel,
    placeholder: args.placeholder,
  });

  return buildQuestionItem({
    linkId: "number-spinner",
    text: `Number spinner (${args.answerType})`,
    type: args.answerType,
    control: "spinner",
    repeats: args.repeats,
    readOnly: args.readOnly,
    extensions,
    initial: buildInitialValues(
      args.answerType,
      args.repeats,
      args.initialValue,
    ),
  });
}

const baseArgTypes = {
  answerType: {
    name: "Answer type",
    options: numberTypes,
    control: { type: "select" },
  },
  repeats: {
    name: "Repeats",
    control: { type: "boolean" },
  },
  readOnly: {
    name: "Read-only",
    control: { type: "boolean" },
  },
  boundsMode: {
    name: "Bounds mode",
    options: ["none", "min", "max", "minMax"],
    control: { type: "select" },
  },
  minValue: {
    name: "Min value",
    control: { type: "number" },
  },
  maxValue: {
    name: "Max value",
    control: { type: "number" },
  },
  unitLabel: {
    name: "Unit label",
    control: { type: "text" },
  },
  initialValue: {
    name: "Initial value",
    control: { type: "number" },
  },
} as const;

const meta: Meta<NumberSliderArgs & Partial<NumberSpinnerArgs>> = {
  title: "Renderers/Numeric",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Numeric renderer playgrounds for slider and spinner behaviors.",
      },
    },
  },
  argTypes: baseArgTypes,
  args: {
    answerType: "decimal",
    repeats: false,
    readOnly: false,
    boundsMode: "minMax",
    minValue: 0,
    maxValue: 100,
    unitLabel: "mg",
    initialValue: 25,
  },
};

export default meta;

export const NumberSliderRenderer: StoryObj<NumberSliderArgs> = {
  name: "Number slider",
  args: {
    useStep: true,
    step: 5,
    lowerLabel: "Low",
    upperLabel: "High",
  },
  argTypes: {
    ...baseArgTypes,
    useStep: {
      name: "Use step extension",
      control: { type: "boolean" },
    },
    step: {
      name: "Step",
      control: { type: "number" },
      if: { arg: "useStep", truthy: true },
    },
    lowerLabel: {
      name: "Lower label",
      control: { type: "text" },
    },
    upperLabel: {
      name: "Upper label",
      control: { type: "text" },
    },
  },
  render: (args, context) => {
    const item = buildNumberSliderItem(args);
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
};

export const NumberSpinnerRenderer: StoryObj<NumberSpinnerArgs> = {
  name: "Number spinner",
  args: {
    placeholder: "Enter value",
  },
  argTypes: {
    ...baseArgTypes,
    placeholder: {
      name: "Placeholder",
      control: { type: "text" },
    },
  },
  render: (args, context) => {
    const item = buildNumberSpinnerItem(args);
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
};
