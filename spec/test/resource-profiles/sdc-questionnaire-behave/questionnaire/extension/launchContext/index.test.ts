import { describe, expect, it } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import en from "@formbox/strings/en";
import { assertQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { EXT } from "@formbox/renderer/utilities.ts";

import {
  makeCalculatedExpression,
  makeVariable,
} from "../../../../../utilities.ts";

import type { ExtensionOf, QuestionnaireOf } from "@formbox/renderer";
type Extension = ExtensionOf<"r5">;
type Questionnaire = QuestionnaireOf<"r5">;

function makeLaunchContext(config: {
  code?: string | undefined;
  types?: readonly string[] | undefined;
  description?: string | undefined;
}): Extension {
  const extension: Extension = {
    url: EXT.SDC_LAUNCH_CONTEXT,
    extension: [],
  };

  if (config.code) {
    extension.extension?.push({
      url: "name",
      valueCoding: {
        system: "http://hl7.org/fhir/uv/sdc/CodeSystem/launchContext",
        code: config.code,
      },
    });
  }

  (config.types ?? []).forEach((type) => {
    extension.extension?.push({
      url: "type",
      valueCode: type,
    });
  });

  if (config.description) {
    extension.extension?.push({
      url: "description",
      valueString: config.description,
    });
  }

  return extension;
}

describe("questionnaire launchContext extension", () => {
  it("exposes launch context values as variables", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [makeLaunchContext({ code: "patient", types: ["Patient"] })],
      item: [
        {
          linkId: "patient-name",
          type: "string",
          extension: [
            makeCalculatedExpression(
              undefined,
              "%patient.name.given.first().first()",
            ),
          ],
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
      undefined,
      {
        patient: {
          resourceType: "Patient",
          id: "p-1",
          name: [{ given: ["Alice"] }],
        },
      },
    );
    expect(form.scope.lookupVariable("patient")).toBeTruthy();

    const patientName = form.scope.lookupNode("patient-name");
    assertQuestionNode(patientName);

    expect(patientName.answers[0]?.value).toBe("Alice");
  });

  it("re-evaluates calculated expressions when launch context changes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [makeLaunchContext({ code: "patient", types: ["Patient"] })],
      item: [
        {
          linkId: "patient-name",
          type: "string",
          extension: [
            makeCalculatedExpression(
              undefined,
              "%patient.name.given.first().first()",
            ),
          ],
        },
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
      undefined,
      {
        patient: {
          resourceType: "Patient",
          id: "p-1",
          name: [{ given: ["Alice"] }],
        },
      },
    );

    const patientName = form.scope.lookupNode("patient-name");
    assertQuestionNode(patientName);
    expect(patientName.answers[0]?.value).toBe("Alice");

    form.setLaunchContext({
      patient: {
        resourceType: "Patient",
        id: "p-2",
        name: [{ given: ["Bob"] }],
      },
    });

    expect(patientName.answers[0]?.value).toBe("Bob");
  });

  it("records name collisions between launchContext and variable", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [
        makeLaunchContext({ code: "patient", types: ["Patient"] }),
        makeVariable("patient", "'override'"),
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const collision = form.issues.find((issue) =>
      issue.diagnostics?.includes('Variable name collision for "patient"'),
    );

    expect(collision).toBeTruthy();
  });

  it("enforces inv-1 type restrictions for well-known launchContext names", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [
        makeLaunchContext({ code: "patient", types: ["Practitioner"] }),
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const diagnostics = form.issues
      .map((issue) => issue.diagnostics)
      .filter((value): value is string => value != undefined);

    expect(
      diagnostics.some((diagnostic) =>
        diagnostic.includes('LaunchContext "patient" has invalid type(s)'),
      ),
    ).toBe(true);
    expect(form.scope.lookupVariable("patient")).toBeUndefined();
  });

  it("reports malformed launchContext declarations", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [
        makeLaunchContext({ types: ["Patient"] }),
        makeLaunchContext({ code: "encounter", types: [] }),
      ],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const diagnostics = form.issues
      .map((issue) => issue.diagnostics)
      .filter((value): value is string => value != undefined);

    expect(
      diagnostics.some((diagnostic) =>
        diagnostic.includes("LaunchContext extension #1 is missing name.code."),
      ),
    ).toBe(true);
    expect(
      diagnostics.some((diagnostic) =>
        diagnostic.includes(
          'LaunchContext "encounter" is missing at least one type.',
        ),
      ),
    ).toBe(true);
  });

  it("rejects reserved FHIRPath/SDC names", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [makeLaunchContext({ code: "context", types: ["Patient"] })],
    };

    const form = new FormStore(
      en,
      "r5",
      "form",
      questionnaire,
      undefined,
      undefined,
    );
    const diagnostics = form.issues
      .map((issue) => issue.diagnostics)
      .filter((value): value is string => value != undefined);

    expect(
      diagnostics.some((diagnostic) =>
        diagnostic.includes('Variable name "context" is reserved'),
      ),
    ).toBe(true);
    expect(form.scope.lookupVariable("context")).toBeUndefined();
  });
});
