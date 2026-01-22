## Element

```json
{
  "id": "Questionnaire.title",
  "extension": [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-translatable",
      "valueBoolean": true
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-translatable",
      "valueBoolean": true
    }
  ],
  "path": "Questionnaire.title",
  "short": "Name for this questionnaire (human friendly)",
  "definition": "A short, descriptive, user-friendly title for the questionnaire.",
  "comment": "This name does not need to be machine-processing friendly and may contain punctuation, white-space, etc.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "string"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.title"
    },
    {
      "identity": "rim",
      "map": ".title"
    }
  ]
}
```
