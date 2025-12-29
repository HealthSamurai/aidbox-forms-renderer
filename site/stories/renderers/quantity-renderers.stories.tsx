import type { Meta, StoryObj } from "@storybook/react-vite";
import type {
  AnswerTypeToDataType,
  DataTypeToType,
} from "@aidbox-forms/renderer/types.ts";
import type { Coding, Extension, QuestionnaireItem } from "fhir/r5";
import {
  buildQuestionItem,
  buildQuestionnaire,
  makeInitialValues,
  Renderer,
} from "../helpers.tsx";
import { EXT } from "@aidbox-forms/renderer/utils.ts";

type UnitMode = "freeText" | "singleOption" | "multipleOptions";

type QuantitySliderArgs = {
  unitMode: UnitMode;
  repeats: boolean;
  readOnly: boolean;
  boundsMode: "none" | "min" | "max" | "minMax";
  minValue: number;
  maxValue: number;
  useStep: boolean;
  step: number;
  initialValue: number | undefined;
  initialUnit: string;
};

type QuantitySpinnerArgs = {
  unitMode: UnitMode;
  repeats: boolean;
  readOnly: boolean;
  boundsMode: "none" | "min" | "max" | "minMax";
  minValue: number;
  maxValue: number;
  initialValue: number | undefined;
  initialUnit: string;
};

const UNIT_SYSTEM = "http://unitsofmeasure.org";

function buildUnitOptions(mode: UnitMode): Coding[] {
  if (mode === "freeText") {
    return [];
  }

  if (mode === "singleOption") {
    return [
      {
        system: UNIT_SYSTEM,
        code: "mg",
        display: "mg",
      },
    ];
  }

  return [
    { system: UNIT_SYSTEM, code: "mg", display: "mg" },
    { system: UNIT_SYSTEM, code: "kg", display: "kg" },
    { system: UNIT_SYSTEM, code: "mL", display: "mL" },
  ];
}

function buildQuantityExtensions(
  args: {
    unitMode: UnitMode;
    boundsMode: "none" | "min" | "max" | "minMax";
    minValue: number;
    maxValue: number;
  },
  unitOptions: Coding[],
): Extension[] {
  const extensions: Extension[] = [];

  unitOptions.forEach((coding) => {
    extensions.push({
      url: EXT.QUESTIONNAIRE_UNIT_OPTION,
      valueCoding: coding,
    });
  });

  const defaultUnit = unitOptions[0]?.code;
  const minQuantity =
    args.boundsMode === "min" || args.boundsMode === "minMax"
      ? {
          value: args.minValue,
          unit: defaultUnit,
          system: defaultUnit ? UNIT_SYSTEM : undefined,
          code: defaultUnit,
        }
      : undefined;
  const maxQuantity =
    args.boundsMode === "max" || args.boundsMode === "minMax"
      ? {
          value: args.maxValue,
          unit: defaultUnit,
          system: defaultUnit ? UNIT_SYSTEM : undefined,
          code: defaultUnit,
        }
      : undefined;

  if (minQuantity) {
    extensions.push({
      url: EXT.MIN_VALUE,
      valueQuantity: minQuantity,
    });
  }

  if (maxQuantity) {
    extensions.push({
      url: EXT.MAX_VALUE,
      valueQuantity: maxQuantity,
    });
  }

  return extensions;
}

function buildInitialValues(
  repeats: boolean,
  value: number | undefined,
  unit: string,
): QuestionnaireItem["initial"] {
  if (value === undefined) {
    return [];
  }

  const base: Array<DataTypeToType<AnswerTypeToDataType<"quantity">>> = [
    {
      value,
      unit: unit || undefined,
      code: unit || undefined,
      system: unit ? UNIT_SYSTEM : undefined,
    },
  ];

  if (repeats) {
    base.push({
      value: value + 1,
      unit: unit || undefined,
      code: unit || undefined,
      system: unit ? UNIT_SYSTEM : undefined,
    });
  }

  return makeInitialValues("quantity", base);
}

function buildQuantitySliderItem(args: QuantitySliderArgs): QuestionnaireItem {
  const unitOptions = buildUnitOptions(args.unitMode);
  const extensions = buildQuantityExtensions(args, unitOptions);

  if (args.useStep) {
    extensions.push({
      url: EXT.SLIDER_STEP_VALUE,
      valueDecimal: args.step,
    });
  }

  return buildQuestionItem({
    linkId: "quantity-slider",
    text: "Quantity slider",
    type: "quantity",
    control: "slider",
    repeats: args.repeats,
    readOnly: args.readOnly,
    extensions,
    initial: buildInitialValues(
      args.repeats,
      args.initialValue,
      args.initialUnit,
    ),
  });
}

function buildQuantitySpinnerItem(
  args: QuantitySpinnerArgs,
): QuestionnaireItem {
  const unitOptions = buildUnitOptions(args.unitMode);
  const extensions = buildQuantityExtensions(args, unitOptions);

  return buildQuestionItem({
    linkId: "quantity-spinner",
    text: "Quantity spinner",
    type: "quantity",
    control: "spinner",
    repeats: args.repeats,
    readOnly: args.readOnly,
    extensions,
    initial: buildInitialValues(
      args.repeats,
      args.initialValue,
      args.initialUnit,
    ),
  });
}

const baseArgTypes = {
  unitMode: {
    name: "Unit mode",
    options: ["freeText", "singleOption", "multipleOptions"],
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
  initialValue: {
    name: "Initial value",
    control: { type: "number" },
  },
  initialUnit: {
    name: "Initial unit",
    control: { type: "text" },
  },
} as const;

const meta: Meta<QuantitySliderArgs & Partial<QuantitySpinnerArgs>> = {
  title: "Renderers/Quantity",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Quantity renderer playgrounds for slider and spinner behaviors.",
      },
    },
  },
  argTypes: baseArgTypes,
  args: {
    unitMode: "multipleOptions",
    repeats: false,
    readOnly: false,
    boundsMode: "minMax",
    minValue: 0,
    maxValue: 100,
    initialValue: 12,
    initialUnit: "mg",
  },
};

export default meta;

export const QuantitySliderRenderer: StoryObj<QuantitySliderArgs> = {
  name: "Quantity slider",
  args: {
    useStep: true,
    step: 2.5,
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
  },
  render: (args, context) => {
    const item = buildQuantitySliderItem(args);
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
};

export const QuantitySpinnerRenderer: StoryObj<QuantitySpinnerArgs> = {
  name: "Quantity spinner",
  argTypes: baseArgTypes,
  render: (args, context) => {
    const item = buildQuantitySpinnerItem(args);
    return (
      <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />
    );
  },
};
