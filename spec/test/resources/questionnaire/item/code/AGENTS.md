## Element

```json
{
  "id": "Questionnaire.item.code",
  "path": "Questionnaire.item.code",
  "short": "Corresponding concept for this item in a terminology",
  "definition": "A terminology code that corresponds to this group or question (e.g. a code from LOINC, which defines many questions and answers).",
  "comment": "The value may come from the ElementDefinition referred to by .definition.",
  "requirements": "Allows linking of groups of questions to formal terminologies.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "Coding"
    }
  ],
  "condition": ["que-3"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
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
      "identity": "rim",
      "map": ".code"
    }
  ]
}
```
