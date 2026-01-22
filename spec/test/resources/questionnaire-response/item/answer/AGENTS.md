## Element

```json
{
  "id": "QuestionnaireResponse.item.answer",
  "path": "QuestionnaireResponse.item.answer",
  "short": "The response(s) to the question",
  "definition": "The respondent's answer(s) to the question.",
  "comment": "The value is nested because we cannot have a repeating structure that has variable type.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "BackboneElement"
    }
  ],
  "condition": ["qrs-1", "qrs-2"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": ".value[type=LIST_ANY]"
    }
  ]
}
```
