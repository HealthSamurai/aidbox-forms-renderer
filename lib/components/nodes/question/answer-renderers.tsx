import type { ReactElement } from "react";
import type { AnswerType, IQuestionNode } from "../../../types.ts";
import type { RowRenderProps } from "./answer.tsx";
import { TextInput } from "../../controls/text-input.tsx";
import { TextArea } from "../../controls/text-area.tsx";
import { NumberInput } from "../../controls/number-input.tsx";
import { DateInput } from "../../controls/date-input.tsx";
import { DateTimeInput } from "../../controls/date-time-input.tsx";
import { TimeInput } from "../../controls/time-input.tsx";
import { QuantityInput } from "../../controls/quantity-input.tsx";
import type { Coding, Reference } from "fhir/r5";

export type AnswerRowRenderer<T extends AnswerType> = (
  rowProps: RowRenderProps<T>,
) => ReactElement;

export function createStringAnswerRenderer(
  node: IQuestionNode<"string">,
): AnswerRowRenderer<"string"> {
  return (rowProps) => (
    <TextInput
      id={rowProps.inputId}
      list={rowProps.list}
      ariaLabelledBy={rowProps.labelId}
      ariaDescribedBy={rowProps.describedById}
      placeholder={node.placeholder}
      value={rowProps.value ?? ""}
      onChange={rowProps.setValue}
      disabled={node.readOnly}
      inputMode={node.keyboardType}
    />
  );
}

export function createTextAnswerRenderer(
  node: IQuestionNode<"text">,
): AnswerRowRenderer<"text"> {
  return (rowProps) => (
    <TextArea
      id={rowProps.inputId}
      ariaLabelledBy={rowProps.labelId}
      ariaDescribedBy={rowProps.describedById}
      placeholder={node.placeholder}
      value={rowProps.value ?? ""}
      onChange={rowProps.setValue}
      disabled={node.readOnly}
      inputMode={node.keyboardType}
    />
  );
}

export function createIntegerAnswerRenderer(
  node: IQuestionNode<"integer">,
): AnswerRowRenderer<"integer"> {
  return (rowProps) => (
    <NumberInput
      id={rowProps.inputId}
      list={rowProps.list}
      ariaLabelledBy={rowProps.labelId}
      ariaDescribedBy={rowProps.describedById}
      placeholder={node.placeholder}
      value={rowProps.value ?? null}
      onChange={(next) =>
        rowProps.setValue(next != null ? Math.round(next) : null)
      }
      disabled={node.readOnly}
      step={1}
      unitLabel={node.unitDisplay}
    />
  );
}

export function createDecimalAnswerRenderer(
  node: IQuestionNode<"decimal">,
): AnswerRowRenderer<"decimal"> {
  return (rowProps) => (
    <NumberInput
      id={rowProps.inputId}
      list={rowProps.list}
      ariaLabelledBy={rowProps.labelId}
      ariaDescribedBy={rowProps.describedById}
      placeholder={node.placeholder}
      value={rowProps.value ?? null}
      onChange={rowProps.setValue}
      disabled={node.readOnly}
      step="any"
      unitLabel={node.unitDisplay}
    />
  );
}

export function createUrlAnswerRenderer(
  node: IQuestionNode<"url">,
): AnswerRowRenderer<"url"> {
  return (rowProps) => (
    <TextInput
      id={rowProps.inputId}
      type="url"
      ariaLabelledBy={rowProps.labelId}
      ariaDescribedBy={rowProps.describedById}
      placeholder={node.placeholder}
      value={rowProps.value ?? ""}
      onChange={rowProps.setValue}
      disabled={node.readOnly}
    />
  );
}

export function createDateAnswerRenderer(
  node: IQuestionNode<"date">,
): AnswerRowRenderer<"date"> {
  return (rowProps) => (
    <DateInput
      id={rowProps.inputId}
      ariaLabelledBy={rowProps.labelId}
      ariaDescribedBy={rowProps.describedById}
      placeholder={node.placeholder}
      value={rowProps.value ?? ""}
      onChange={rowProps.setValue}
      disabled={node.readOnly}
    />
  );
}

export function createDateTimeAnswerRenderer(
  node: IQuestionNode<"dateTime">,
): AnswerRowRenderer<"dateTime"> {
  return (rowProps) => (
    <DateTimeInput
      id={rowProps.inputId}
      ariaLabelledBy={rowProps.labelId}
      ariaDescribedBy={rowProps.describedById}
      placeholder={node.placeholder}
      value={rowProps.value ?? ""}
      onChange={rowProps.setValue}
      disabled={node.readOnly}
    />
  );
}

export function createTimeAnswerRenderer(
  node: IQuestionNode<"time">,
): AnswerRowRenderer<"time"> {
  return (rowProps) => (
    <TimeInput
      id={rowProps.inputId}
      ariaLabelledBy={rowProps.labelId}
      ariaDescribedBy={rowProps.describedById}
      placeholder={node.placeholder}
      value={rowProps.value ?? ""}
      onChange={rowProps.setValue}
      disabled={node.readOnly}
    />
  );
}

export function createQuantityAnswerRenderer(
  node: IQuestionNode<"quantity">,
): AnswerRowRenderer<"quantity"> {
  return (rowProps) => (
    <QuantityInput
      inputId={rowProps.inputId}
      list={rowProps.list}
      disabled={node.readOnly}
      ariaLabelledBy={rowProps.labelId}
      ariaDescribedBy={rowProps.describedById}
      answer={rowProps.answer}
      node={node}
      placeholder={node.placeholder}
    />
  );
}

export function createCodingAnswerRenderer(
  node: IQuestionNode<"coding">,
): AnswerRowRenderer<"coding"> {
  return (rowProps) => {
    const coding = rowProps.value ?? {};
    const handleChange = (field: keyof Coding, nextValue: string) => {
      const draft: Coding = {
        ...coding,
        [field]: nextValue || undefined,
      };
      rowProps.setValue(pruneCoding(draft));
    };

    return (
      <div className="af-coding-input">
        <TextInput
          ariaLabelledBy={rowProps.labelId}
          ariaDescribedBy={rowProps.describedById}
          value={coding.system ?? ""}
          onChange={(value) => handleChange("system", value)}
          disabled={node.readOnly}
          placeholder="System (e.g. http://loinc.org)"
        />
        <TextInput
          ariaLabelledBy={rowProps.labelId}
          ariaDescribedBy={rowProps.describedById}
          value={coding.code ?? ""}
          onChange={(value) => handleChange("code", value)}
          disabled={node.readOnly}
          placeholder="Code"
        />
        <TextInput
          ariaLabelledBy={rowProps.labelId}
          ariaDescribedBy={rowProps.describedById}
          value={coding.display ?? ""}
          onChange={(value) => handleChange("display", value)}
          disabled={node.readOnly}
          placeholder="Display"
        />
      </div>
    );
  };
}

export function createReferenceAnswerRenderer(
  node: IQuestionNode<"reference">,
): AnswerRowRenderer<"reference"> {
  return (rowProps) => {
    const reference = rowProps.value ?? {};
    const setField = (field: keyof Reference, nextValue: string) => {
      const draft: Reference = {
        ...reference,
        [field]: nextValue || undefined,
      };
      rowProps.setValue(pruneReference(draft));
    };

    return (
      <div className="af-reference-input">
        <TextInput
          ariaLabelledBy={rowProps.labelId}
          ariaDescribedBy={rowProps.describedById}
          value={reference.reference ?? ""}
          onChange={(value) => setField("reference", value)}
          disabled={node.readOnly}
          placeholder={node.placeholder ?? "Resource/type/id"}
        />
        <TextInput
          ariaLabelledBy={rowProps.labelId}
          ariaDescribedBy={rowProps.describedById}
          value={reference.display ?? ""}
          onChange={(value) => setField("display", value)}
          disabled={node.readOnly}
          placeholder="Display label"
        />
      </div>
    );
  };
}

function pruneCoding(value: Coding): Coding | null {
  const next: Coding = { ...value };
  (["system", "code", "display", "version"] as const).forEach((key) => {
    if (!next[key]) {
      delete next[key];
    }
  });
  return Object.keys(next).length > 0 ? next : null;
}

function pruneReference(value: Reference): Reference | null {
  const next: Reference = { ...value };
  (Object.keys(next) as (keyof Reference)[]).forEach((key) => {
    if (next[key] === undefined || next[key] === null || next[key] === "") {
      delete next[key];
    }
  });
  return Object.keys(next).length > 0 ? next : null;
}
