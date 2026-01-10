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
import { EXT } from "@aidbox-forms/renderer/utilities.ts";

type NumericType = "integer" | "decimal";

type NumberSliderArguments = {
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

type NumberSpinnerArguments = {
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

function buildNumberExtensions(arguments_: {
  answerType: NumericType;
  boundsMode: "none" | "min" | "max" | "minMax";
  minValue: number;
  maxValue: number;
  unitLabel: string;
  placeholder?: string | undefined;
}): Extension[] {
  const extensions: Extension[] = [];

  if (arguments_.boundsMode === "min" || arguments_.boundsMode === "minMax") {
    extensions.push(
      buildNumberBoundExtension(
        arguments_.answerType,
        EXT.MIN_VALUE,
        arguments_.minValue,
      ),
    );
  }

  if (arguments_.boundsMode === "max" || arguments_.boundsMode === "minMax") {
    extensions.push(
      buildNumberBoundExtension(
        arguments_.answerType,
        EXT.MAX_VALUE,
        arguments_.maxValue,
      ),
    );
  }

  if (arguments_.unitLabel.trim().length > 0) {
    extensions.push({
      url: EXT.QUESTIONNAIRE_UNIT,
      valueCoding: { display: arguments_.unitLabel },
    });
  }

  if (arguments_.placeholder && arguments_.placeholder.trim().length > 0) {
    extensions.push({
      url: EXT.ENTRY_FORMAT,
      valueString: arguments_.placeholder,
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

function buildNumberSliderItem(
  arguments_: NumberSliderArguments,
): QuestionnaireItem {
  const extensions = buildNumberExtensions({
    answerType: arguments_.answerType,
    boundsMode: arguments_.boundsMode,
    minValue: arguments_.minValue,
    maxValue: arguments_.maxValue,
    unitLabel: arguments_.unitLabel,
  });

  if (arguments_.useStep) {
    extensions.push(
      buildSliderStepExtension(arguments_.answerType, arguments_.step),
    );
  }

  const items: QuestionnaireItem[] = [];
  if (arguments_.lowerLabel.trim().length > 0) {
    items.push(
      buildDisplayItem({
        linkId: "lower-label",
        text: arguments_.lowerLabel,
        control: "lower",
      }),
    );
  }
  if (arguments_.upperLabel.trim().length > 0) {
    items.push(
      buildDisplayItem({
        linkId: "upper-label",
        text: arguments_.upperLabel,
        control: "upper",
      }),
    );
  }

  return buildQuestionItem({
    linkId: "number-slider",
    text: `Number slider (${arguments_.answerType})`,
    type: arguments_.answerType,
    control: "slider",
    repeats: arguments_.repeats,
    readOnly: arguments_.readOnly,
    extensions,
    initial: buildInitialValues(
      arguments_.answerType,
      arguments_.repeats,
      arguments_.initialValue,
    ),
    item: items,
  });
}

function buildNumberSpinnerItem(
  arguments_: NumberSpinnerArguments,
): QuestionnaireItem {
  const extensions = buildNumberExtensions({
    answerType: arguments_.answerType,
    boundsMode: arguments_.boundsMode,
    minValue: arguments_.minValue,
    maxValue: arguments_.maxValue,
    unitLabel: arguments_.unitLabel,
    placeholder: arguments_.placeholder,
  });

  return buildQuestionItem({
    linkId: "number-spinner",
    text: `Number spinner (${arguments_.answerType})`,
    type: arguments_.answerType,
    control: "spinner",
    repeats: arguments_.repeats,
    readOnly: arguments_.readOnly,
    extensions,
    initial: buildInitialValues(
      arguments_.answerType,
      arguments_.repeats,
      arguments_.initialValue,
    ),
  });
}

const baseArgumentTypes = {
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

const meta: Meta<NumberSliderArguments & Partial<NumberSpinnerArguments>> = {
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
  argTypes: baseArgumentTypes,
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

export const NumberSliderRenderer: StoryObj<NumberSliderArguments> = {
  name: "Number slider",
  args: {
    useStep: true,
    step: 5,
    lowerLabel: "Low",
    upperLabel: "High",
  },
  argTypes: {
    ...baseArgumentTypes,
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
  render: (arguments_, context) => {
    const item = buildNumberSliderItem(arguments_);
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
};

export const NumberSpinnerRenderer: StoryObj<NumberSpinnerArguments> = {
  name: "Number spinner",
  args: {
    placeholder: "Enter value",
  },
  argTypes: {
    ...baseArgumentTypes,
    placeholder: {
      name: "Placeholder",
      control: { type: "text" },
    },
  },
  render: (arguments_, context) => {
    const item = buildNumberSpinnerItem(arguments_);
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
};
