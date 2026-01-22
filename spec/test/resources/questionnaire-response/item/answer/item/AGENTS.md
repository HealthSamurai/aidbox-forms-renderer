## Element

```json
{
  "id": "QuestionnaireResponse.item.answer.item",
  "path": "QuestionnaireResponse.item.answer.item",
  "short": "Child items of question",
  "definition": "Nested groups and/or questions found within this particular answer.",
  "comment": "Only used when nesting beneath a question - see item.item for nesting beneath groups",
  "requirements": "It is useful to have \"sub-questions\", questions which normally appear when certain answers are given and which collect additional details.",
  "min": 0,
  "max": "*",
  "contentReference": "#QuestionnaireResponse.item",
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": ".outboundRelationship[typeCode=COMP].target[classCode=OBS, moodCode=EVN]"
    }
  ]
}
```
