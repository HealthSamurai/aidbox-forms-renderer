## Element

```json
{
  "id": "Questionnaire.item.answerOption.value[x]",
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
  "path": "Questionnaire.item.answerOption.value[x]",
  "short": "Answer value",
  "definition": "A potential answer that's allowed as the answer to this question.",
  "comment": "The data type of the value must agree with the item.type.",
  "min": 1,
  "max": "1",
  "type": [
    {
      "code": "integer"
    },
    {
      "code": "date"
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
      "code": "Reference",
      "targetProfile": ["http://hl7.org/fhir/StructureDefinition/Resource"]
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "QuestionnaireQuestionOption"
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
