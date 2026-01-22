## Element

```json
{
  "id": "Questionnaire.item.initial.value[x]",
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
  "path": "Questionnaire.item.initial.value[x]",
  "short": "Actual value for initializing the question",
  "definition": "The actual value to for an initial answer.",
  "comment": "The type of the initial value must be consistent with the type of the item.",
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
      "code": "uri"
    },
    {
      "code": "Attachment"
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
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "QuestionnaireQuestionOption2"
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
