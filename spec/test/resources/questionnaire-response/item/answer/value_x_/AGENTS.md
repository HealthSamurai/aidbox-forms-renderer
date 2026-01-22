## Element

```json
{
  "id": "QuestionnaireResponse.item.answer.value[x]",
  "path": "QuestionnaireResponse.item.answer.value[x]",
  "short": "Single-valued answer to the question",
  "definition": "The answer (or one of the answers) provided by the respondent to the question.",
  "comment": "More complex structures (Attachment, Resource and Quantity) will typically be limited to electronic forms that can expose an appropriate user interface to capture the components and enforce the constraints of a complex data type.  Additional complex types can be introduced through extensions. Must match the datatype specified by Questionnaire.item.type in the corresponding Questionnaire.     Note that a question is answered using one of the possible choices defined with answerOption, answerValueSet or some other means and the answer has a complex data type, all elements within the answer in the QuestionnaireResponse **SHOULD** match the elements defined corresponding choice value in the Questionnaire.  However, it is possible that not all elements will be propagated.  Also, some systems might use language translations resulting in different displays.  Comparison of value to the values defined in the Questionnaire (whether by answerOption, answerValueSet or answerExpression) **SHALL NOT** pay attention to Coding.display, Reference.display, Quantity.unit unless those are the only elements present.  As well, systems are not required to check for a match on any extensions (e.g. ordinal values, translations, etc.).  Systems **MAY** enforce that if extensions such as ordinal values are present in both Questionnaire and QuestionnaireResponse, they match.",
  "requirements": "Ability to retain a single-valued answer to a question.",
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
      "code": "Quantity",
      "profile": ["http://hl7.org/fhir/StructureDefinition/SimpleQuantity"]
    },
    {
      "code": "Reference",
      "targetProfile": ["http://hl7.org/fhir/StructureDefinition/Resource"]
    }
  ],
  "condition": ["qrs-2"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/tools/StructureDefinition/binding-definition",
        "valueString": "Code indicating the response provided for a question."
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "QuestionnaireAnswer"
      }
    ],
    "strength": "example",
    "description": "Binding this is problematic because one value set can't apply to both codes and quantities.",
    "valueSet": "http://hl7.org/fhir/ValueSet/questionnaire-answers"
  },
  "mapping": [
    {
      "identity": "rim",
      "map": ".item"
    }
  ]
}
```
