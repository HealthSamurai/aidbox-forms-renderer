## Element

```json
{
  "id": "Questionnaire.item.enableWhen.operator",
  "path": "Questionnaire.item.enableWhen.operator",
  "short": "exists | = | != | > | < | >= | <=",
  "definition": "Specifies the criteria by which the question is enabled.",
  "min": 1,
  "max": "1",
  "type": [
    {
      "code": "code"
    }
  ],
  "condition": ["que-7"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "QuestionnaireItemOperator"
      }
    ],
    "strength": "required",
    "description": "The criteria by which a question is enabled.",
    "valueSet": "http://hl7.org/fhir/ValueSet/questionnaire-enable-operator|5.0.0"
  },
  "mapping": [
    {
      "identity": "rim",
      "map": "N/A - MIF rather than RIM level"
    }
  ]
}
```
