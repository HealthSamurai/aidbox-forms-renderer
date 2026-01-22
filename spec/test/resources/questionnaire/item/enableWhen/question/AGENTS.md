## Element

```json
{
  "id": "Questionnaire.item.enableWhen.question",
  "path": "Questionnaire.item.enableWhen.question",
  "short": "The linkId of question that determines whether item is enabled/disabled",
  "definition": "The linkId for the question whose answer (or lack of answer) governs whether this item is enabled.",
  "comment": "If multiple question occurrences are present for the same question (same linkId), then this refers to the nearest question occurrence reachable by tracing first the \"ancestor\" axis and then the \"preceding\" axis and then the \"following\" axis.  If there are multiple items with the same linkId and all are equadistant (e.g. a question references a question that appears in a separate repeating group), that is an error.  (Consider using the enableWhenExpression extension to define logic to handle such a situation.)",
  "min": 1,
  "max": "1",
  "type": [
    {
      "code": "string"
    }
  ],
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
