# Aidbox Forms Renderer

Minimal React renderer for HL7® FHIR® Questionnaires

```tsx
import { Renderer, type Questionnaire, type QuestionnaireResponse } from "aidbox-forms-renderer";
import { useState } from "react";

const questionnaire: Questionnaire = {
  resourceType: "Questionnaire",
  item: [
    { linkId: "first", text: "First name", type: "string", required: true },
    { linkId: "consent", text: "Consent to treatment", type: "boolean" },
  ],
};

export function IntakeForm() {
  const [response, setResponse] = useState<QuestionnaireResponse | null>(null);

  return (
    <Renderer
      questionnaire={questionnaire}
      initialResponse={response ?? undefined}
      onChange={setResponse}
      onSubmit={setResponse}
    />
  );
}
```

Useful scripts: `npm run dev` (playground), `npm run build` (type-check + bundle), `npm test`, `npm run lint`.

See [COVERAGE.md](COVERAGE.md) for the detailed SDC feature checklist.

# Development Roadmap (Q4 2025)

Each milestone lists the core features and extensions required to reach full compliance with the **HL7 FHIR Structured Data Capture (SDC)** specification.

## 🎯 **October 2025 — Core Questionnaire Rendering**

Focus: Establish baseline FHIR Questionnaire support and base rendering logic.

* [ ] **Core Questionnaire Resource**
    * [x] Support `Questionnaire.item` elements (text, type, linkId, required, repeats)
    * [x] Implement display of `prefix`, `text`, `item.type`
    * [ ] Apply constraints: `minLength`, `maxLength`, `minValue`, `maxValue`, `maxOccurs`
    * [x] Enable `readOnly`, `initial` behavior
    * [x] Support FHIR `enableWhen` conditions and nested groups
    * [ ] Render `item.control` and `item.control.displayCategory` extensions (basic)
* [ ] **Questionnaire Navigation & Layout*_*_
    * [x] Implement group hierarchy rendering
    * [ ] Respect `hidden` and `displayCategory` controls
    * [ ] Add label localization and prefix rendering
* [ ] **Input Controls**
    * [x] Map FHIR types → UI components (`string`, `boolean`, `integer`, `choice`, `date`, `quantity`, etc.)
    * [ ] Render choice options (`answerOption`, `answerValueSet`)
    * [ ] Support open-choice types
* [ ] **Basic Validation**
    * [x] Validate required questions
    * [x] Validate numeric and string bounds
    * [x] Validate answer cardinality (`repeats`, `maxOccurs`)

## ⚙️ **November 2025 — Advanced Form Rendering & Behavior**

Focus: Interactive logic, calculations, adaptive elements, and modular assembly.

* [ ] **Advanced Form Rendering**
    * [ ] Implement `sdc-questionnaire-itemControl` full support
    * [ ] Handle `appearance` extension rendering hints
    * [ ] Support `rendering-style`, `rendering-xhtml`, and `markdown` items
* [ ] **Form Behavior & Calculation**
    * [x] Implement calculated expressions via `calculatedExpression`
    * [x] Dynamic enablement: `enableWhenExpression`
    * [ ] Validation expressions: `constraint`, `constraintExpression`
    * [ ] Item visibility & computed display expressions
    * [ ] Value propagation (`derivedFrom`, `answerExpression`)
* [ ] **Adaptive & Modular Forms**
    * [ ] Implement `assemble-expectation` and sub-questionnaire resolution
    * [ ] Support adaptive `next-question` operations (`sdc-questionnaireresponse-adapt`)
    * [ ] Dynamic loading of next sections via adaptive operation (`Questionnaire/$next-question`)
    * [ ] Support inclusion of external subforms and library dependencies
* [ ] **User Interaction Layer**
    * [ ] Autosave progress to `QuestionnaireResponse`
    * [x] Support for resuming saved sessions
    * [x] Dynamic updates to visible fields based on answers

## 🧩 **December 2025 — Data Population & Extraction**

Focus: Form prefill, structured output mapping, and integration services.

* [ ] **Form Population**
    * [ ] Implement population via:
        * [x] `initialExpression`
        * [ ] `itemPopulationContext`
        * [ ] `candidateExpression`
    * [ ] Support FHIR `$populate` operation (StructureMap-based)
    * [ ] Integrate population service from external data sources (Patient, Observation, etc.)
* [ ] **Form Data Extraction**
    * [ ] Implement FHIR `$extract` operation
    * [ ] Map responses → resources using `structureMap`
    * [ ] Handle `extract` extensions: `sdc-questionnaire-extract`, `itemExtractionContext`
* [ ] **Export and Serialization**
    * [x] Generate valid `QuestionnaireResponse`
    * [ ] Support export in JSON and XML
    * [ ] Validate `QuestionnaireResponse` against source `Questionnaire`
* [ ] **Polish & QA**
    * [ ] Test all `must-support` extensions from SDC profiles
    * [ ] Ensure conformance with:
        * [ ] `sdc-questionnaire-render`
        * [ ] `sdc-questionnaire-adapt`
        * [ ] `sdc-questionnaire-extract`
    * [ ] Accessibility and internationalization compliance
