import type { Extension, Quantity } from "fhir/r5";

export function makeVariable(name: string, expression: string): Extension {
  return {
    url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-variable",
    valueExpression: {
      language: "text/fhirpath",
      expression,
      name,
    },
  };
}

export function makeEnableExpression(
  name: string | undefined,
  expression: string,
): Extension {
  return {
    url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-enableWhenExpression",
    valueExpression: {
      language: "text/fhirpath",
      expression,
      ...(name ? { name } : {}),
    },
  };
}

export function makeInitialExpression(
  name: string | undefined,
  expression: string,
): Extension {
  return {
    url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression",
    valueExpression: {
      language: "text/fhirpath",
      expression,
      ...(name ? { name } : {}),
    },
  };
}

export function makeCalculatedExpression(
  name: string | undefined,
  expression: string,
): Extension {
  return {
    url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression",
    valueExpression: {
      language: "text/fhirpath",
      expression,
      ...(name ? { name } : {}),
    },
  };
}

export function makeMinValueExpression(
  name: string | undefined,
  expression: string,
): Extension {
  return {
    url: "http://hl7.org/fhir/StructureDefinition/minValue",
    valueInteger: 0,
    _valueInteger: {
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/cqf-expression",
          valueExpression: {
            language: "text/fhirpath",
            expression,
            ...(name ? { name } : {}),
          },
        },
      ],
    },
  } as Extension;
}

export function makeMinOccursExpression(
  expression: string,
  name?: string,
): Extension {
  return {
    url: "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs",
    valueInteger: 0,
    _valueInteger: {
      extension: [makeCqfExpression(expression, name)],
    },
  } as Extension;
}

export function makeMaxOccursExpression(
  expression: string,
  name?: string,
): Extension {
  return {
    url: "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
    valueInteger: 0,
    _valueInteger: {
      extension: [makeCqfExpression(expression, name)],
    },
  } as Extension;
}

export function makeMinQuantityExpression(
  expression: string,
  base?: Quantity,
  name?: string,
): Extension {
  return {
    url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-minQuantity",
    valueQuantity: {
      ...(base ?? { value: 0 }),
      extension: [makeCqfExpression(expression, name)],
    },
  } as Extension;
}

export function makeMaxQuantityExpression(
  expression: string,
  base?: Quantity,
  name?: string,
): Extension {
  return {
    url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-maxQuantity",
    valueQuantity: {
      ...(base ?? { value: 0 }),
      extension: [makeCqfExpression(expression, name)],
    },
  } as Extension;
}

export function makeAnswerExpression(
  expression: string,
  name?: string,
): Extension {
  return {
    url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression",
    valueExpression: {
      language: "text/fhirpath",
      expression,
      ...(name ? { name } : {}),
    },
  };
}

export function makeMaxValueExpression(
  name: string | undefined,
  expression: string,
): Extension {
  return {
    url: "http://hl7.org/fhir/StructureDefinition/maxValue",
    valueInteger: 0,
    _valueInteger: {
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/cqf-expression",
          valueExpression: {
            language: "text/fhirpath",
            expression,
            ...(name ? { name } : {}),
          },
        },
      ],
    },
  } as Extension;
}

export function makeCqfExpression(
  expression: string,
  name?: string,
): Extension {
  return {
    url: "http://hl7.org/fhir/StructureDefinition/cqf-expression",
    valueExpression: {
      language: "text/fhirpath",
      expression,
      ...(name ? { name } : {}),
    },
  } satisfies Extension;
}
