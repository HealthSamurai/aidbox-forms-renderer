## Element

```json
{
  "id": "Questionnaire.purpose",
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
  "path": "Questionnaire.purpose",
  "short": "Why this questionnaire is defined",
  "definition": "Explanation of why this questionnaire is needed and why it has been designed as it has.",
  "comment": "This element does not describe the usage of the questionnaire. Instead, it provides traceability of ''why'' the resource is either needed or ''why'' it is defined as it is.  This may be used to point to source materials or specifications that drove the structure of this questionnaire.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "markdown"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.purpose"
    },
    {
      "identity": "w5",
      "map": "FiveWs.why[x]"
    },
    {
      "identity": "rim",
      "map": ".reasonCode.text"
    },
    {
      "identity": "objimpl",
      "map": "no-gen-base"
    }
  ]
}
```
