## Element

```json
{
  "id": "Questionnaire.useContext",
  "extension": [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/structuredefinition-standards-status",
      "valueCode": "trial-use"
    }
  ],
  "path": "Questionnaire.useContext",
  "short": "The context that the content is intended to support",
  "definition": "The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate questionnaires.",
  "comment": "When multiple useContexts are specified, there is no expectation that all or even any of the contexts apply.",
  "requirements": "Assist in searching for appropriate content.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "UsageContext"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.useContext"
    },
    {
      "identity": "rim",
      "map": "N/A (to add?)"
    }
  ]
}
```
