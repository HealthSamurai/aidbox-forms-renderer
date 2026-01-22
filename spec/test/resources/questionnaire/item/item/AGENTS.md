## Element

```json
{
  "id": "Questionnaire.item.item",
  "path": "Questionnaire.item.item",
  "short": "Nested questionnaire items",
  "definition": "Text, questions and other groups to be nested beneath a question or group.",
  "comment": "There is no specified limit to the depth of nesting.  However, Questionnaire authors are encouraged to consider the impact on the user and user interface of overly deep nesting.",
  "requirements": "Reports can consist of complex nested groups.",
  "min": 0,
  "max": "*",
  "contentReference": "#Questionnaire.item",
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": ".outboundRelationship[typeCode=COMP].target"
    }
  ]
}
```
