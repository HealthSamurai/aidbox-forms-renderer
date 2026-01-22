## Element

```json
{
  "id": "Questionnaire.code",
  "path": "Questionnaire.code",
  "short": "Concept that represents the overall questionnaire",
  "definition": "An identifier for this collection of questions in a particular terminology such as LOINC.",
  "requirements": "Allows linking of the complete Questionnaire resources to formal terminologies.  It's common for \"panels\" of questions to be identified by a code.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "Coding"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "QuestionnaireConcept"
      }
    ],
    "strength": "example",
    "description": "Codes for questionnaires, groups and individual questions.",
    "valueSet": "http://hl7.org/fhir/ValueSet/questionnaire-questions"
  },
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.code"
    },
    {
      "identity": "rim",
      "map": ".code"
    }
  ]
}
```
