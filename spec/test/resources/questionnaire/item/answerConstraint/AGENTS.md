## Element

```json
{
  "id": "Questionnaire.item.answerConstraint",
  "path": "Questionnaire.item.answerConstraint",
  "short": "optionsOnly | optionsOrType | optionsOrString",
  "definition": "For items that have a defined set of allowed answers (via answerOption or answerValueSet), indicates whether values *other* than those specified can be selected.",
  "requirements": "Introduces the ability for questions to have 'other' answers",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "code"
    }
  ],
  "meaningWhenMissing": "If not specified, answerConstraint is presumed to be 'optionsOnly'",
  "condition": ["que-10", "que-14"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "QuestionnaireAnswerConstraint"
      }
    ],
    "strength": "required",
    "description": "Indicates differnt modes for restricting values when options or valueset are specified",
    "valueSet": "http://hl7.org/fhir/ValueSet/questionnaire-answer-constraint|5.0.0"
  },
  "mapping": [
    {
      "identity": "rim",
      "map": "N/A - MIF rather than RIM level"
    }
  ]
}
```
