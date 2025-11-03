import type { Extension } from "fhir/r5";

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
