## Element

```json
{
  "id": "Questionnaire.item.enableWhen.answer[x]",
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
  "path": "Questionnaire.item.enableWhen.answer[x]",
  "short": "Value for question comparison based on operator",
  "definition": "A value that the referenced question is tested using the specified operator in order for the item to be enabled.  If there are multiple answers, a match on any of the answers suffices.  If different behavior is desired (all must match, at least 2 must match, etc.), consider using the enableWhenExpression extension.",
  "min": 1,
  "max": "1",
  "type": [
    {
      "code": "boolean"
    },
    {
      "code": "decimal"
    },
    {
      "code": "integer"
    },
    {
      "code": "date"
    },
    {
      "code": "dateTime"
    },
    {
      "code": "time"
    },
    {
      "code": "string"
    },
    {
      "code": "Coding"
    },
    {
      "code": "Quantity"
    },
    {
      "code": "Reference",
      "targetProfile": ["http://hl7.org/fhir/StructureDefinition/Resource"]
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
        "valueString": "QuestionnaireQuestionOption3"
      }
    ],
    "strength": "example",
    "description": "Allowed values to answer questions.",
    "valueSet": "http://hl7.org/fhir/ValueSet/questionnaire-answers"
  },
  "mapping": [
    {
      "identity": "rim",
      "map": "N/A - MIF rather than RIM level"
    }
  ]
}
```
