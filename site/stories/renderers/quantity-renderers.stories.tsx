import type { Meta, StoryObj } from "@storybook/react-vite";
import type {
  AnswerTypeToDataType,
  DataTypeToType,
} from "@formbox/renderer/types.ts";
import type { Coding, Extension, QuestionnaireItem } from "fhir/r5";
import {
  buildQuestionItem,
  buildQuestionnaire,
  makeInitialValues,
} from "../helpers.tsx";
import { Renderer } from "../renderer.tsx";
import { EXT } from "@formbox/renderer/utilities.ts";

type UnitMode = "freeText" | "singleOption" | "multipleOptions";

type QuantitySliderArguments = {
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

type QuantitySpinnerArguments = {
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
  arguments_: {
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
    arguments_.boundsMode === "min" || arguments_.boundsMode === "minMax"
      ? {
          value: arguments_.minValue,
          unit: defaultUnit,
          system: defaultUnit ? UNIT_SYSTEM : undefined,
          code: defaultUnit,
        }
      : undefined;
  const maxQuantity =
    arguments_.boundsMode === "max" || arguments_.boundsMode === "minMax"
      ? {
          value: arguments_.maxValue,
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

function buildQuantitySliderItem(
  arguments_: QuantitySliderArguments,
): QuestionnaireItem {
  const unitOptions = buildUnitOptions(arguments_.unitMode);
  const extensions = buildQuantityExtensions(arguments_, unitOptions);

  if (arguments_.useStep) {
    extensions.push({
      url: EXT.SLIDER_STEP_VALUE,
      valueDecimal: arguments_.step,
    });
  }

  return buildQuestionItem({
    linkId: "quantity-slider",
    text: "Quantity slider",
    type: "quantity",
    control: "slider",
    repeats: arguments_.repeats,
    readOnly: arguments_.readOnly,
    extensions,
    initial: buildInitialValues(
      arguments_.repeats,
      arguments_.initialValue,
      arguments_.initialUnit,
    ),
  });
}

function buildQuantitySpinnerItem(
  arguments_: QuantitySpinnerArguments,
): QuestionnaireItem {
  const unitOptions = buildUnitOptions(arguments_.unitMode);
  const extensions = buildQuantityExtensions(arguments_, unitOptions);

  return buildQuestionItem({
    linkId: "quantity-spinner",
    text: "Quantity spinner",
    type: "quantity",
    control: "spinner",
    repeats: arguments_.repeats,
    readOnly: arguments_.readOnly,
    extensions,
    initial: buildInitialValues(
      arguments_.repeats,
      arguments_.initialValue,
      arguments_.initialUnit,
    ),
  });
}

const baseArgumentTypes = {
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

const meta: Meta<QuantitySliderArguments & Partial<QuantitySpinnerArguments>> =
  {
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
    argTypes: baseArgumentTypes,
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

export const QuantitySliderRenderer: StoryObj<QuantitySliderArguments> = {
  name: "Quantity slider",
  args: {
    useStep: true,
    step: 2.5,
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
  },
  render: (arguments_, context) => {
    const item = buildQuantitySliderItem(arguments_);
    return (
      <Renderer
        questionnaire={buildQuestionnaire(item)}
        storyId={context.id}
        mode="node"
      />
    );
  },
};

export const QuantitySpinnerRenderer: StoryObj<QuantitySpinnerArguments> = {
  name: "Quantity spinner",
  argTypes: baseArgumentTypes,
  render: (arguments_, context) => {
    const item = buildQuantitySpinnerItem(arguments_);
    return (
      <Renderer
        questionnaire={buildQuestionnaire(item)}
        storyId={context.id}
        mode="node"
      />
    );
  },
};
