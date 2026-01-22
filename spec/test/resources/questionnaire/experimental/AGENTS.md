## Element

```json
{
  "id": "Questionnaire.experimental",
  "path": "Questionnaire.experimental",
  "short": "For testing purposes, not real usage",
  "definition": "A Boolean value to indicate that this questionnaire is authored for testing purposes (or education/evaluation/marketing) and is not intended for genuine usage.",
  "comment": "Allows filtering of questionnaires that are appropriate for use versus not.",
  "requirements": "Enables experimental content to be developed following the same lifecycle that would be used for a production-level questionnaire.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "boolean"
    }
  ],
  "meaningWhenMissing": "If absent, this resource is treated as though it is not experimental.",
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.experimental"
    },
    {
      "identity": "w5",
      "map": "FiveWs.class"
    },
    {
      "identity": "rim",
      "map": "N/A"
    }
  ]
}
```
