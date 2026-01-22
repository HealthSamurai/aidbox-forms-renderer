## Element

```json
{
  "id": "Questionnaire.name",
  "path": "Questionnaire.name",
  "short": "Name for this questionnaire (computer friendly)",
  "definition": "A natural language name identifying the questionnaire. This name should be usable as an identifier for the module by machine processing applications such as code generation.",
  "comment": "The name is not expected to be globally unique. The name should be a simple alphanumeric type no-whitespace name to ensure that it is machine-processing friendly.",
  "requirements": "Supports code generation.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "string"
    }
  ],
  "condition": ["cnl-0"],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.name"
    },
    {
      "identity": "rim",
      "map": "N/A"
    }
  ]
}
```
