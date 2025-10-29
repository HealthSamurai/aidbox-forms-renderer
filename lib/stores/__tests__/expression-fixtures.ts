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
    url: "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-minValueExpression",
    valueExpression: {
      language: "text/fhirpath",
      expression,
      ...(name ? { name } : {}),
    },
  };
}
