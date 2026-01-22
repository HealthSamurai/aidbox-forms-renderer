## Element

```json
{
  "id": "QuestionnaireResponse.item.item",
  "path": "QuestionnaireResponse.item.item",
  "short": "Child items of group item",
  "definition": "Sub-questions, sub-groups or display items nested beneath a group.",
  "comment": "Only used when nesting beneath a group - see item.answer.item for nesting beneath questions",
  "requirements": "Reports can consist of complex nested groups.",
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
