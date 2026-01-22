## Element

```json
{
  "id": "Questionnaire.item.type",
  "path": "Questionnaire.item.type",
  "short": "group | display | boolean | decimal | integer | date | dateTime +",
  "definition": "The type of questionnaire item this is - whether text for display, a grouping of other items or a particular type of data to be captured (string, integer, Coding, etc.).",
  "comment": "Additional constraints on the type of answer can be conveyed by extensions. The value may come from the ElementDefinition referred to by .definition.",
  "requirements": "Defines the format in which the user is to be prompted for the answer.",
  "min": 1,
  "max": "1",
  "type": [
    {
      "code": "code"
    }
  ],
  "condition": [
    "que-9",
    "que-8",
    "que-6",
    "que-5",
    "que-3",
    "que-10",
    "que-1a",
    "que-1b",
    "que-1c"
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "QuestionnaireItemType"
      }
    ],
    "strength": "required",
    "description": "Distinguishes groups from questions and display text and indicates data type for questions.",
    "valueSet": "http://hl7.org/fhir/ValueSet/item-type|5.0.0"
  },
  "mapping": [
    {
      "identity": "rim",
      "map": "N/A - MIF rather than RIM level"
    }
  ]
}
```
