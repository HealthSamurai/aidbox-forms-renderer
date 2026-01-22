## Element

```json
{
  "id": "Questionnaire.item.answerOption",
  "path": "Questionnaire.item.answerOption",
  "short": "Permitted answer",
  "definition": "One of the permitted answers for the question.",
  "comment": "This element can be used when the value set machinery of answerValueSet is deemed too cumbersome or when there's a need to capture possible answers that are not codes.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "BackboneElement"
    }
  ],
  "condition": ["que-5", "que-4", "que-11", "que-14"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": "N/A - MIF rather than RIM level"
    }
  ]
}
```
